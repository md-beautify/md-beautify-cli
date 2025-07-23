
# 一级标题

## 二级标题
    
### 三级标题


- 无序列表 1
- 无序列表 2
  - 无序列表 2.1
    - 2.1.1  
    - 2.1.2
  - 无序列表 2.2  


1. 有序列表 1  
  1.1  c  
  1.2  c  
    1.2.1  a  
    1.2.2  b  
2. 有序列表 2
3. 有序列表 3



一级引用如下：

> ### 一级引用示例
> 
> 读一本好书。 **——歌德**
>> what you are you do not see
>>> what you see is what I want you to see



**这个是粗体**

*这个是斜体*
    
***这个是粗体加斜体***


[Markdown Nice最全功能介绍](https://mp.weixin.qq.com/s/lM808MxUu6tp8zU8SBu3sg)

图片还可以和链接嵌套使用，能够实现推荐卡片的效果，用法如下：

[![Markdown Nice 最全功能介绍](https://files.mdnice.com/dance.gif)](https://mp.weixin.qq.com/s/lM808MxUu6tp8zU8SBu3sg)

---

~~这是要被删除的内容。~~


| 姓名       | 年龄 |         工作 |
| :--------- | :--: | -----------: |
| 小可爱     |  18  |     吃可爱多 |
| 小小勇敢   |  20  |   爬棵勇敢树 |
| 小小小机智 |  22  | 看一本机智书 |


![这里写图片描述](https://files.mdnice.com/pic/cd3ca20c-896f-4cfc-9bdd-c4c58e69ba26.jpg)

![同时设置宽度和高度](https://files.mdnice.com/logo.png =150x150)
    
![只设置宽度，推荐使用百分比](https://files.mdnice.com/logo.png =40%x)



[全栈工程师](是指掌握多种技能，并能利用多种技能独立完成产品的人。 "什么是全栈工程师")
[我的Github](https://github.com/CoderMonkie)



```java
// FileName: HelloWorld.java
public class HelloWorld {
  // Java 入口程序，程序从此入口
  public static void main(String[] args) {
    System.out.println("Hello,World!"); // 向控制台打印一条语句
  }
}
```

支持以下语言种类：

```
bash
clojure，cpp，cs，css
dart，dockerfile, diff
erlang
go，gradle，groovy
haskell
java，javascript，json，julia
kotlin
lisp，lua
makefile，markdown，matlab
objectivec
perl，php，python
r，ruby，rust
scala，shell，sql，swift
tex，typescript
verilog，vhdl
xml
yaml
```

diff 效果：

```diff
+ 新增项
- 删除项
```


行内公式：$\ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-}$

块公式：$$H(D_2) = -\left(\frac{2}{4}\log_2 \frac{2}{4} + \frac{2}{4}\log_2 \frac{2}{4}\right) = 1$$


[TOC]

## 二级标题
    
### 三级标题


Markdown Nice 这么好用，简直是{喜大普奔|hē hē hē hē}呀！


<![蓝1](https://files.mdnice.com/blue.jpg),![绿2](https://files.mdnice.com/green.jpg),![红3](https://files.mdnice.com/red.jpg)>


::: block-1
### 容器块 1 示例

> 读一本好书，就是在和高尚的人谈话。 **——歌德**
:::

::: block-2
### 容器块 2 示例

> 读一本好书，就是在和高尚的人谈话。 **——歌德**
:::

::: block-3
### 容器块 3 示例

> 读一本好书，就是在和高尚的人谈话。 **——歌德**
:::


:::: column
::: column-left

**左边的内容**

![左边的图片](https://files.mdnice.com/blue.jpg)

:::
::: column-right

**右边的内容**

![右边的图片](https://files.mdnice.com/green.jpg)

:::
::::

设置百分比示例如下：

:::: column
::: column-left 30%

**左边的内容**

![左边的图片](https://files.mdnice.com/blue.jpg)

:::
::: column-right 70%

**右边的内容**

![右边的图片](https://files.mdnice.com/green.jpg)

:::
::::