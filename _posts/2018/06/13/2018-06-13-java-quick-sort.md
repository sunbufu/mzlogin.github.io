---
layout: post
title: 快速排序的Java实现
categories: [algorithm]
description: 快速排序的Java实现
keywords: quicksort
---

快速排序是目前所有排序中性能较好的一种算法，最好情况和平均情况下时间复杂度均为O(nlogn)，最坏的情况下时间复杂度为O(n^2)。快速排序采用递归，用空间换取时间。由于使用了递归，因此需要额外的存储空间。  

```java
package sunbufu.sort;

import java.util.Arrays;

public class MyQuickSort {

    public static void main(String[] args) {
        int[] array = { 2, 5, 1, 4, 3, 9, 5, 1, 12 };
        System.out.println(Arrays.toString(array));
        System.out.println("--------------------------");
        quickSort(array, 0, array.length - 1);
        System.out.println("--------------------------");
        System.out.println(Arrays.toString(array));
    }

    private static void quickSort(int[] array, int low, int high) {

        int l = low;
        int h = high;

        int key = array[low];// 默认选择第0个为基数

        while (l != h) {// l跟h相等则结束
            while (l < h && array[h] >= key)// h从右向左移动,直到找到一个比基数小的值
                h--;
            if (l < h)
                swap(array, l, h);
            while (l < h && array[l] <= key)// l从左向右移动,直到找到一个比基数大的值
                l++;
            if (l < h)
                swap(array, l, h);
        }

        // 然后把数组从基数所在的位置分成两部分,分别递归
        if (l > low)
            quickSort(array, low, l - 1);
        if (h < high)
            quickSort(array, h + 1, high);

    }

    private static void swap(int[] array, int a, int b) {
        int temp = array[a];
        array[a] = array[b];
        array[b] = temp;
        System.out.println("交换下标为" + a + "和" + b + "的两个元素");
        System.out.println(Arrays.toString(array));
    }

}
```
运行结果如下：  
```
[2, 5, 1, 4, 3, 9, 5, 1, 12]
--------------------------
交换下标为0和7的两个元素
[1, 5, 1, 4, 3, 9, 5, 2, 12]
交换下标为1和7的两个元素
[1, 2, 1, 4, 3, 9, 5, 5, 12]
交换下标为1和2的两个元素
[1, 1, 2, 4, 3, 9, 5, 5, 12]
交换下标为3和4的两个元素
[1, 1, 2, 3, 4, 9, 5, 5, 12]
交换下标为5和7的两个元素
[1, 1, 2, 3, 4, 5, 5, 9, 12]
--------------------------
[1, 1, 2, 3, 4, 5, 5, 9, 12]
```