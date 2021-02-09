---
id: xeuki
title: 様々な表記
slug: /xeuki/
---

bipuuk の特徴的な点として、表記方法があります。

基本となるのは木構造ですが、それを十分に表現できる表記であれば何でも良いです。そのため、色々な表記方法を考えることができます。

現在取り扱っている表記方法は大きく分けて

- 視覚的な表現
- テキストによる表現
- 自然数による表現

の 3 種類があります。


## 視覚的な表現

### そのまま描く

冒頭に挙げたような、二分木構造をそのまま描くものです。

変種として、葉（後述する自然数表記における `0`）を省略するかどうかが考えられます。


### H木表記

[H木 - Wikipedia](https://ja.wikipedia.org/wiki/H%E6%9C%A8)

白銀比の長方形に線を引いていくことでできる、フラクタル図形です。


### 同心円表記

中心から、放射状の直線と同心の円弧を繰り返していくものです。


### ポワンカレ円板表記

[ポワンカレの円板モデル - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%9D%E3%83%AF%E3%83%B3%E3%82%AB%E3%83%AC%E3%81%AE%E5%86%86%E6%9D%BF%E3%83%A2%E3%83%87%E3%83%AB)

[スライムさんの提案](https://twitter.com/slaimsan/status/1063052016178540544) によるものです。


## テキストによる表現

### ディック言語表記

[ディック言語 - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%A3%E3%83%83%E3%82%AF%E8%A8%80%E8%AA%9E)

対応する括弧の列です。以下の文法からなります。

```
<tree> ::= ""
         | "(" <tree> ")" <tree>
```

変種として括弧を前置するか後置するかが考えられます。

括弧の種類を変えるのもいいと思います。

後述する自然数表記と混在させることができます。


### スラッシュ表記

スライムさんの提案によるものです。以下の文法からなります。

```
<tree> ::= <leaf>
         | "/" <tree> <tree>
<leaf> ::= 何らかのトークン
```

スラッシュじゃなくてもいいです。

括弧表記と本質的には同じですが、葉が何らかの形で明示される必要があります。また、葉が並んだときに区切りがわかる必要があります。


## 自然数表記

木をナンバリングしていくことで、自然数と木を対応させる方法です。別ページで解説します。


## 多分木との変換

[二分木 - Wikipedia](https://ja.wikipedia.org/wiki/%E4%BA%8C%E5%88%86%E6%9C%A8#N%E9%80%B2%E6%9C%A8%E3%81%AE%E4%BA%8C%E5%88%86%E6%9C%A8%E8%A1%A8%E7%8F%BE)

多分木とは子を複数持つ木のことであり、["maybe a tree" という意味ではありません](https://translate.google.co.jp/?hl=ja#view=home&op=translate&sl=ja&tl=en&text=%E5%A4%9A%E5%88%86%E6%9C%A8)。

LISP のリスト構造のようにすると二分木と多分木は一対一に変換できるので、多分木を元に表記を考えることもできます。

[へだるさんの提案](https://twitter.com/hedalu244/status/1108341081677037570)：多分木から自然数数列への単射