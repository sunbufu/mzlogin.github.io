---
layout: post
title: RestTemplate中的URLEncode
categories: [踩坑]
description: RestTemplate中的URLEncode，不会对加号encode
keywords: RestTemplate
---

# 0. 起因
正常情况下 url 只会出现英文字母、数字和标点符号，特殊字符会在请求前进行 encode 操作，转化成合法的 url。 例如我们用浏览器在百度上搜索 `+=` 时，浏览器实际上访问的是 `https://www.baidu.com/s?wd=%2B%3D`。 
encode 操作其实是将需要转码的字符转为 16 进制，然后从右到左，取 4 位(不足 4 位直接处理)，每 2 位做一位，前面加上 % ，编码成 %XY 格式。  
常见特殊字符及编码后值如下：

| 字符 |  ！  |  #   |  $   |  %   |  +   |  @   |  :   |  =   |  ?   |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 编码 | %21  | %23  | %24  | %25  | %2B  | %40  | %3A  | %3D  | %3F  |

# 1. 经过
在最近的开发中恰好用到了 HTTP 的 GET 方式请求，并且参数中涉及到特殊字符。
在通信过程中发现，第三方服务收到的数据，与我发出的不一致。例如我发出的数据是 `a+b=` ，第三方收到的却是 `a b=` ，这就变得有意思了。因为 '+' 和 '=' 都是特殊字符，为什么一个可以正常收到，另一个却不行。  
刚开始我们怀疑是日志打印的问题，可是在我开发环境上也能重现这个问题。然后我们开始怀疑是我发出去的请求没有进行 UrlEncode 处理，可是 '=' 却可以被正常接收和处理，经过猜测和跟代码，最后我们终于找到了问题的原因。
找问题的过程如下：  
因为我们使用了 Spring 的 RestTemplate 作为 http 的 client ，所以从 RestTemplate 入手。  
具体的跟踪思路和源码如下:

1. RestTemplate 中会有一个 uriTemplateHandler 来处理 uri。

```java
private UriTemplateHandler uriTemplateHandler = new DefaultUriBuilderFactory();
```

```java
@Override
@Nullable
public <T> T execute(String url, HttpMethod method, @Nullable RequestCallback requestCallback,
        @Nullable ResponseExtractor<T> responseExtractor, Object... uriVariables) throws RestClientException {

    URI expanded = getUriTemplateHandler().expand(url, uriVariables);
    return doExecute(expanded, method, requestCallback, responseExtractor);
}
```

2. DefaultUriBuilderFactory 会使用 UriComponentsBuilder 来实例化自己。也就是说

```java
/**
 * Default constructor without a base URI.
 * <p>The target address must be specified on each UriBuilder.
 */
public DefaultUriBuilderFactory() {
    this(UriComponentsBuilder.newInstance());
}
```

```java
/**
 * Variant of {@link #DefaultUriBuilderFactory(String)} with a
 * {@code UriComponentsBuilder}.
 */
public DefaultUriBuilderFactory(UriComponentsBuilder baseUri) {
    Assert.notNull(baseUri, "'baseUri' is required");
    this.baseUri = baseUri;
}
```

3. 而 UriComponentsBuilder 的 encode 处理默认会通过 HierarchicalUriComponents 完成

```java
/**
 * Encode all URI components using their specific encoding rules and return
 * the result as a new {@code UriComponents} instance.
 * @param charset the encoding of the values
 * @return the encoded URI components
 */
@Override
public HierarchicalUriComponents encode(Charset charset) {
    if (this.encoded) {
        return this;
    }
    String scheme = getScheme();
    String fragment = getFragment();
    String schemeTo = (scheme != null ? encodeUriComponent(scheme, charset, Type.SCHEME) : null);
    String fragmentTo = (fragment != null ? encodeUriComponent(fragment, charset, Type.FRAGMENT) : null);
    String userInfoTo = (this.userInfo != null ? encodeUriComponent(this.userInfo, charset, Type.USER_INFO) : null);
    String hostTo = (this.host != null ? encodeUriComponent(this.host, charset, getHostType()) : null);
    PathComponent pathTo = this.path.encode(charset);
    MultiValueMap<String, String> paramsTo = encodeQueryParams(charset);
    return new HierarchicalUriComponents(
            schemeTo, fragmentTo, userInfoTo, hostTo, this.port, pathTo, paramsTo, true, false);
}

private MultiValueMap<String, String> encodeQueryParams(Charset charset) {
    int size = this.queryParams.size();
    MultiValueMap<String, String> result = new LinkedMultiValueMap<>(size);
    this.queryParams.forEach((key, values) -> {
        String name = encodeUriComponent(key, charset, Type.QUERY_PARAM);
        List<String> encodedValues = new ArrayList<>(values.size());
        for (String value : values) {
            encodedValues.add(encodeUriComponent(value, charset, Type.QUERY_PARAM));
        }
        result.put(name, encodedValues);
    });
    return result;
}
```

再往下跟踪 encodeUriComponent 方法，就找到了进行 UrlEncode 的地方

```java
/**
 * Encode the given source into an encoded String using the rules specified
 * by the given component and with the given options.
 * @param source the source String
 * @param charset the encoding of the source String
 * @param type the URI component for the source
 * @return the encoded URI
 * @throws IllegalArgumentException when the given value is not a valid URI component
 */
static String encodeUriComponent(String source, Charset charset, Type type) {
    if (!StringUtils.hasLength(source)) {
        return source;
    }
    Assert.notNull(charset, "Charset must not be null");
    Assert.notNull(type, "Type must not be null");

    byte[] bytes = source.getBytes(charset);
    ByteArrayOutputStream bos = new ByteArrayOutputStream(bytes.length);
    boolean changed = false;
    for (byte b : bytes) {
        if (b < 0) {
            b += 256;
        }
        if (type.isAllowed(b)) {
            bos.write(b);
        }
        else {
            bos.write('%');
            char hex1 = Character.toUpperCase(Character.forDigit((b >> 4) & 0xF, 16));
            char hex2 = Character.toUpperCase(Character.forDigit(b & 0xF, 16));
            bos.write(hex1);
            bos.write(hex2);
            changed = true;
        }
    }
    return (changed ? new String(bos.toByteArray(), charset) : source);
}
```

进行 encode 处理的就是下面的代码与刚才描述的一致，没有问题，那么问题很可能会出在判断是否需要进行 encode 操作的代码上。

```java
bos.write('%');
char hex1 = Character.toUpperCase(Character.forDigit((b >> 4) & 0xF, 16));
char hex2 = Character.toUpperCase(Character.forDigit(b & 0xF, 16));
bos.write(hex1);
bos.write(hex2);
```

` type.isAllowed(b) ` 就是进行判断操作，按照语义上来理解，返回值表示是否是符合规范的字符，也就是说如果不符合规范，则会被执行下面的 encode 操作。  
这样看起来还没有问题，在跟下这个方法。发现有个枚举实现了这个方法，我们是处理的参数，正常情况下会调用到 QUERY_PARAM.isAllowed 方法。  
看源码可以了解到，如果是 `=` 或者 `&` 符号直接会返回 `false` 表示不符合规范，如果是 `/` 或者 `？` 符号直接返回 `true` 表示符合规范，其它情况由 isPchar 方法判断是否符合规范。 

```java
/**
 * Enumeration used to identify the allowed characters per URI component.
 * <p>Contains methods to indicate whether a given character is valid in a specific URI component.
 * @see <a href="http://www.ietf.org/rfc/rfc3986.txt">RFC 3986</a>
 */
enum Type {
    SCHEME {
        @Override
        public boolean isAllowed(int c) {
            return isAlpha(c) || isDigit(c) || '+' == c || '-' == c || '.' == c;
        }
    }
    ...
    QUERY_PARAM {
        @Override
        public boolean isAllowed(int c) {
            if ('=' == c || '&' == c) {
                return false;
            }
            else {
                return isPchar(c) || '/' == c || '?' == c;
            }
        }
    },
    FRAGMENT {
        @Override
        public boolean isAllowed(int c) {
            return isPchar(c) || '/' == c || '?' == c;
        }
    },
    URI {
        @Override
        public boolean isAllowed(int c) {
            return isUnreserved(c);
        }
    };
```

但我们再跟下 isPchar 方法就会发现，这个方法并不是判断字符是否符合 url 的规范。恰恰相反，它是判断字符是否是规定的特殊字符。

```java
/**
 * Indicates whether the given character is in the {@code sub-delims} set.
 * @see <a href="http://www.ietf.org/rfc/rfc3986.txt">RFC 3986, appendix A</a>
 */
protected boolean isSubDelimiter(int c) {
    return ('!' == c || '$' == c || '&' == c || '\'' == c || '(' == c || ')' == c || '*' == c || '+' == c ||
            ',' == c || ';' == c || '=' == c);
}
...
/**
 * Indicates whether the given character is in the {@code unreserved} set.
 * @see <a href="http://www.ietf.org/rfc/rfc3986.txt">RFC 3986, appendix A</a>
 */
protected boolean isUnreserved(int c) {
    return (isAlpha(c) || isDigit(c) || '-' == c || '.' == c || '_' == c || '~' == c);
}

/**
 * Indicates whether the given character is in the {@code pchar} set.
 * @see <a href="http://www.ietf.org/rfc/rfc3986.txt">RFC 3986, appendix A</a>
 */
protected boolean isPchar(int c) {
    return (isUnreserved(c) || isSubDelimiter(c) || ':' == c || '@' == c);
}
```

# 2. 结论
也就是说，除了 '=' '&' 符号之外的其它特殊字符，在参数中出现时都不会被执行 encode。不知道这个地方是开发者的纰漏还是我理解的问题，已经尝试在联系开发者中。  
暂时的解决方案是使用 `java.url` 包下面的 `URLEncoder` 来进行 encode 操作，示例代码如下：
```java
RestTemplate restTemplate = new RestTemplate();
// 准备参数
String url = "http://a.com";
Map<String, String> params = Collections.singletonMap("p1", "+=");
// 构造uri
UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(url);
for (Map.Entry<String, String> entry : params.entrySet()) {
    uriComponentsBuilder.queryParam(entry.getKey(), entry.getValue());
}
URI uri = uriComponentsBuilder.build().encode().toUri();
// 执行请求
ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
```
