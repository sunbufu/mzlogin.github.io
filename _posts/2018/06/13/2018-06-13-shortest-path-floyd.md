---
layout: post
title: 最短路径-弗洛伊德
categories: [algorithm]
description: 最短路径-弗洛伊德
keywords: shortest path, Floyd-Warshall
---

### 1.定义概述
Floyd-Warshall算法（Floyd-Warshall algorithm）是解决任意两点间的最短路径的一种算法，可以正确处理有向图或负权的最短路径问题，同时也被用于计算有向图的传递闭包。
### 2.实例演示
![floyd]({{ site.url }}/images{{ page.url }}/20171108155607180.jpg)

```java
/**
 * 弗洛伊德算法求最短路径
 * @author sunbufu
 *
 */
public class ShortestPathFloyd {
	/**无穷大*/
	final static int INF = Integer.MAX_VALUE;

	public static void main(String[] args) {
		int[] points = { 1, 2, 3, 4, 5, 6 };
		int[][] weights = {
//				 1    2    3    4    5    6
				{0,   7,   9,   INF, INF, 14   },//1
				{7,   0,   10,  15,  INF, INF  },//2
				{9,   10,  0,   11,  INF, 2    },//3
				{INF, 15,  11,  0,   6,   INF  },//4
				{INF, INF, INF, 6,   0,   9    },//5
				{14,  INF, 2,   INF, 9,   0    } //6
		};
		int[][] previousPoint = {
//				 1    2    3    4    5    6
				{1,   2,   3,   4,   5,   6    },//1
				{1,   2,   3,   4,   5,   6    },//2
				{1,   2,   3,   4,   5,   6    },//3
				{1,   2,   3,   4,   5,   6    },//4
				{1,   2,   3,   4,   5,   6    },//5
				{1,   2,   3,   4,   5,   6    } //6
		};
		floyd(points, weights, previousPoint);
	}

	private static void floyd(int[] points, int[][] weights, int[][] previousPoint) {
		int pointsNumber = points.length;
		for(int k = 0; k < pointsNumber; k ++){
			for(int i = 0; i < pointsNumber; i ++){
				for(int j = 0; j < pointsNumber; j ++){
					if(weights[i][k] != INF && weights[k][j] != INF && (weights[i][k] + weights[k][j]) < weights[i][j]){
						weights[i][j] = weights[i][k] + weights[k][j];
						previousPoint[i][j] = k;
					}
				}
			}
		}
		System.out.println(weights);
	}
}
```

### 3.总结
简洁的解决了最短路径问题，但是时间复杂度为`O(n^3)`。