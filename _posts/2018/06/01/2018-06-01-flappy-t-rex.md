---
layout: post
title: 恐龙快跑(Flappy T-Rex)
categories: [open source]
description: 恐龙快跑(Flappy T-Rex)
keywords: flappy T-Rex
---

# 0、写在前面
相信大家都了解过Google的Flappy T-Rex。一次偶然的机会，我也有幸在断网的情况下玩了几局，感觉就是一句话—“不愧是Google的作品”。在这里就不多夸奖Google和他的Flappy T-Rex如何如何牛X了，不了解的读者还请自行百度。
由于那时候正在学Java和线程，觉得正好练下手，于是就有了这款山寨版的Dinosaur Run。当然使用Java写的，为了方便读者的学习，本人公开[Dinosaur Run的源代码](http://download.csdn.net/detail/sunbufu/9214745)（很简单，但还是要拿出来丢人现眼）。求路过的大神高抬贵手，轻喷。叩首谢过。
# 1、运行界面
Google Flappy T-Rex
![Flappy T-Rex]({{ site.url }}/images{{ page.url }}/20151026194318837.jpg)
Dinosaur Run
![Dinosaur Run]({{ site.url }}/images{{ page.url }}/20151026194526404.jpg)
Google Flappy T-Rex
![Flappy T-Rex]({{ site.url }}/images{{ page.url }}/20151026194252041.jpg)
Dinosaur Run
![Dinosaur Run]({{ site.url }}/images{{ page.url }}/20151026194601938.jpg)

因为是山寨的，所有本人本着尽量不给“山寨”丢人的原则，一张一张的把恐龙的动作，地平线的变化，植物的种类，天上的云彩整合成图片，然后应用在这个小小的游戏里。
当然游戏体验还是差的一塌糊涂。感兴趣的大神不妨抽空调一下，使之更符合人类的直觉，提高游戏的可玩性。
# 2、操作逻辑
Google的产品一致是以简单为基础的，从Google的搜索主页就可以看出。增加用户的学习成本是一个非常不明智的选择。
Dinosaur Run和Flappy T-Rex在操作上一致的（因为本来就是山寨啊= =）。
回车键：开始/停止
上键：跳跃
下键：蹲
![跳跃]({{ site.url }}/images{{ page.url }}/20151026195315675.jpg)
![蹲]({{ site.url }}/images{{ page.url }}/20151026195331666.jpg)

注意：其实在Google的Flappy T-Rex里面，如果你能玩的后期的话，还会出现一种在天上飞的恐龙（目测是翼龙）。需要蹲在跑才能躲过去，**但是，由于时间关系，我没有继续实现这个功能。**
# 3、源码分析
项目的工程列表如下所示：
![工程]({{ site.url }}/images{{ page.url }}/20151026195649620.jpg)

1. `image` 文件夹里面存放了各种图片，包括：恐龙的各种动作、地貌的变化、云朵等。
2. `sound` 文件夹里面存放了各种音频资料，例如恐龙死亡时发出的超级玛丽死亡时的声音（请不要再鄙视我了，谢谢= =）
3. `AudioTest` 用来播放音效的类
4. `BarrierThread` 障碍物和背景运动的线程，包括仙人掌、地貌和云朵等
5. `CrashThread` 碰撞检测线程，实时监测恐龙和障碍物是否重叠，即是否碰撞
6. `DinosaurRun` 该游戏的主线程，除了`start()` 其他线程之外，还负责监听键盘事件
7. `DinosaurThread` 恐龙运动的线程，主要包括分析恐龙的运动轨迹（跳跃时按照`h = V0t-0.5gt^2`）、刷新恐龙的位置（坐标）
8. `ScaleIcon` 一个可以自动调节图片大小的类
9. `ScoreThread` 统计玩家得分的线程

我之所以在这里写这个，是希望拿到我的源码的朋友能够快速了解我的思路，如果哪位大神觉得我写的太菜了，希望可以跟我联系，也可以在本文下边评论，我孙不服在这里谢过各位朋友了。
# 4、致谢
实在没什么好写的了，感谢Google吧！