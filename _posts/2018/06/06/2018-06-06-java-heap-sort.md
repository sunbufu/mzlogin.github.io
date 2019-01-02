---
layout: post
title: 堆排序的Java实现
categories: [algorithm]
description: 堆排序的Java实现
keywords: heap, heapsort
---

```java
package sunbufu.sort;

/**
 * 堆排序
 * 
 *              0
 *      1               2
 *  3       4       5       6
 * 
 * 在二叉树中：
 * 因为   
 *      根节点下标=左节点下标-1/2
 *      根节点下标=右节点下标-2/2
 * 所以
 *      左节点下标=根节点下标*2+1
 *      右节点下标=根节点下标*2+2
 * 
 * @author 孙不服
 *
 */
public class HeapSort {

    public static void main(String[] args) {
        HeapSort heapSort = new HeapSort();
        int[] data = { 3, 5, 8, 9, 1, 2 };
        heapSort.data = data;
        heapSort.buildHeap();
        for (int i = 0; i < data.length; i++) {
            System.out.print(data[0] + ",");
            data[0] = Integer.MAX_VALUE;
            heapSort.buildHeap();
        }
    }

    public int[] data;

    /**
     * 将数组转换成最小堆
     */
    public void buildHeap() {
        // 完全二叉树只有数组下标小于或等于 (data.length) / 2 - 1 的元素有孩子结点，遍历这些结点。
        for (int i = (data.length) / 2 - 1; i >= 0; i--) {
            // 对有孩子结点的元素heapify
            heapify(i);
        }
    }

    /**
     * 让i元素下降到合适的位置
     * @param i
     */
    private void heapify(int i) {
        // 获取左右结点的数组下标
        int l = left(i);
        int r = right(i);

        // 这是一个临时变量，表示 根结点、左结点、右结点中最小的值的结点的下标
        int smallest = i;

        // 存在左结点，且左结点的值小于根结点的值
        if (l < data.length && data[l] < data[i])
            smallest = l;

        // 存在右结点，且右结点的值小于以上比较的较小值
        if (r < data.length && data[r] < data[smallest])
            smallest = r;

        // 左右结点的值都大于根节点，直接return，不做任何操作
        if (i == smallest)
            return;

        // 交换根节点和左右结点中最小的那个值，把根节点的值替换下去
        swap(i, smallest);

        // 由于替换后左右子树会被影响，所以要对受影响的子树再进行heapify
        heapify(smallest);
    }

    /**
     * 获取根节点的左节点
     * @param i
     * @return
     */
    private int left(int i) {
        return i * 2 + 2;
    }

    /**
     * 获取根节点的右节点
     * @param i
     * @return
     */
    private int right(int i) {
        return i * 2 + 1;
    }

    /**
     * 交换数组下表为a跟b的位置
     * 
     * @param a
     * @param b
     */
    public void swap(int a, int b) {
        int temp = data[a];
        data[a] = data[b];
        data[b] = temp;
    }

    /**
     * 打印堆
     */
    public void printHeap() {
        for (int i : data) {
            System.out.print(i + ", ");
        }
        System.out.println();
    }

}
```