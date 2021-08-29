# math2image

[![npm](https://img.shields.io/npm/v/math2image.svg)](https://www.npmjs.com/package/math2image) [![Node CI](https://github.com/nwtgck/math2image-npm/actions/workflows/ci.yml/badge.svg)](https://github.com/nwtgck/math2image-npm/actions/workflows/ci.yml)

CLI for generating beautiful SVG/PNG mathematical image from LaTeX syntax

## Installation

```bash
npm install -g math2image
```

### Usages

#### from stdin

```bash
echo "e^{i \pi} + 1 = 0" | math2image > euler-identity.svg
```

#### from a file

```bash
math2image sample7.math.tex
```

#### from a file specifying output name

```bash
math2image -o output.svg sample7.math.tex
```

#### save as .png

```bash
math2image --to-png --png-width=500 sample7.math.tex
```

##### `sample7.math.tex`

```tex
% (from: https://en.wikibooks.org/wiki/LaTeX/Mathematics)
f(n) =
\begin{cases}
  n/2       & \quad \text{if } n \text{ is even}\\
  -(n+1)/2  & \quad \text{if } n \text{ is odd}
\end{cases}
```

## Gallery

<img src="demo_svgs/euler-identity.svg" height="50"><br>


<img src="demo_svgs/sample7.math.tex.svg" height="50">


## My Note

[MYNOTE.md](MYNOTE.md)
