---
id: kegtairon
title: 形態論
slug: /kegtairon/
---

## 形態素

bipuuk には大きく分けて２つの形態素があります。

### 接辞

高さ 1 ～ 3 の木を **接辞** (affix) とします。自然数表記では `1` ～ `25` に相当し、全部で 25 個あります。

### 語根

高さ 4 の木を **語根** (word root) とします。自然数表記では `26` ～ `676` に相当し、全部で 651 個あります。


## 糖衣構文

bipuuk は最も原始的には以下の文法で表せます。

```bnf
<tree> ::= ""
         | "/" <tree> "\" <tree>
```

よって接辞・語根は以下のように表せます。

```bnf
<h0> ::= ""
<h1> ::= "/" <h0> "\" <h0>
<h2> ::= "/" <h1> "\" <h0>
       | "/" <h1> "\" <h1>
       | "/" <h0> "\" <h1>
<h3> ::= "/" <h2> "\" <h0>
       | "/" <h2> "\" <h1>
       | "/" <h2> "\" <h2>
       | "/" <h1> "\" <h2>
       | "/" <h0> "\" <h2>
<h4> ::= "/" <h3> "\" <h0>
       | "/" <h3> "\" <h1>
       | "/" <h3> "\" <h2>
       | "/" <h3> "\" <h3>
       | "/" <h2> "\" <h3>
       | "/" <h1> "\" <h3>
       | "/" <h0> "\" <h3>

;; 構造的定義
<affix> ::= <h1> | <h2> | <h3>
<word-root> ::= <h4>
```

しかしこれでは人間が文を書くのに適していないので、同じ意味のわかりやすい書き方を導入します。

高さ 0 ～ 2 の木、すなわち自然数表記の `0` ～ `4` に母音字 `a e i o u` を割り当てます。高さ 3 ～ 5 の木、すなわち自然数表記の `5` ～ `25` に子音字 `b c d f g h j k l m n p q r s t v w x y z` を割り当てます。

接辞は小母音字 2 文字で表されます。語根はそれ以外の小文字の組み合わせ 2 文字で表されます。1 文字目が左の子、2 文字目が右の子に対応します。

```bnf
<small-vowel-letter> ::= "a" | "e" | "i" | "o" | "u"
<small-consonant-letter> ::= "b" | "c" | "d" | "f" | "g" | "h" | "j" | "k" | "l" | "m" | "n" | "p" | "q" | "r" | "s" | "t" | "v" | "w" | "x" | "y" | "z"
<capital-vowel-letter> ::= "A" | "E" | "I" | "O" | "U"
<capital-consonant-letter> ::= "B" | "C" | "D" | "F" | "G" | "H" | "J" | "K" | "L" | "M" | "N" | "P" | "Q" | "R" | "S" | "T" | "V" | "W" | "X" | "Y" | "Z"

;; 字句的定義
<affix> ::= <small-vowel-letter> <small-vowel-letter>
<word-root> ::= <small-consonant-letter> <small-vowel-letter>
              | <small-consonant-letter> <small-consonant-letter>
              | <small-vowel-letter> <small-consonant-letter>
```

## 形態素の連結

### 接辞同士の連結

まず、接辞と接辞は連結することができません。なぜなら、連結してできる木の高さが 1 ～ 4 となってしまい、既存の形態素と被ってしまうからです。

この制約によって bipuuk では木の形態素解析が一意にできるようになっています。

### 語幹

語根と語根を連結すると、新たな辞書定義が生まれます。こうしてできるまとまりを **語幹** (word stem) とします。

語幹の左に接辞をつけてもよく、これも語幹になります。

```bnf
;; 構造的定義
<word-stem> ::= <word-root>
              | "/" <affix> "\" <word-stem>
              | "/" <word-stem> "\" <word-stem>
```

語幹にも糖衣構文があります。

例として `//aa\bb\cc` の糖衣構文を考えます。

- まず語根・接辞部分 `aabbcc` を抜き出します。
- 最初の文字と最後の文字は小文字のままにします。
- 残りの文字は、余った `/` と `\` を前から対応させ、`/` なら大文字、`\` なら小文字とします。この場合 `aABbcc` になります。

いくつか例を挙げます。

- `/aa\bb` → `aAbb`
- `//aa\bb\cc` → `aABbcc`
- `///aa\bb\cc\dd` → `aABBccdd`
- `//aa\/bb\cc\dd` → `aABbCcdd`

文法に以下を付け足すことができます。

```bnf
<small-letter> ::= <small-vowel-letter> | <small-consonant-letter>
<capital-letter> ::= <capital-vowel-letter> | <capital-consonant-letter>

;; 字句的定義 (接辞の連結を含んでしまうため正確ではない)
<word-stem> ::= <small-letter> <word-stem′> <small-letter>
<word-stem′> ::= ""
               | <capital-letter> <word-stem′> <small-letter> <word-stem′>
```

> 大文字・小文字の対応はディック言語風になっているのに対し意味的な塊は前から２文字ずつなのでずれが生じます。大文字小文字を使うのは木構造を機械的に定めるためであって、人間がいちいち気にする必要はありません。


### 語

語幹の右に接辞を連結すると **語** (word) となります。語幹が意味内容、接辞が文法的役割を決定します。

糖衣構文は、語幹の最初の文字を大文字にし、接辞をそのまま最後に付けます。

```bnf
;; 構造的定義
<word> ::= "/" <word-stem> "\" <affix>

;; 字句的定義
<word> ::= <capital-letter> <word′> <small-letter> <small-letter> <small-letter>
<word′> ::= ""
          | <capital-letter> <word′> <small-letter> <word′>
```


### 文

文はこのような語の連結からなります。

```bnf
<sentence> ::= <word>
             | "/" <sentence> "\" <sentence>
```
