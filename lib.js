// round down below the decimal point
Big.DP = 0;
Big.RM = 0;

const LT = -1, EQ = 0, GT = 1;

const mapping = {
  ii2i(x, y) {
    switch (x.cmp(y)) {
      // case x < y: (y + 1) ** 2 - x
      case LT: return y.plus(1).pow(2).minus(x);
      // case x = y: x ** 2 + y + 1
      case EQ: return x.pow(2).plus(y).plus(1);
      // case x > y: x ** 2 + y + 1
      case GT: return x.pow(2).plus(y).plus(1);
    }
  },
  i2ii(z) {
    // m := sqrt(z - 1)
    const m = z.minus(1).sqrt();
    // h := (m + 1) * m + 1
    const h = m.plus(1).times(m).plus(1);
    switch (z.cmp(h)) {
      // case z < h: ( m, m - (h - z) )
      case LT: return [m, m.minus(h.minus(z))];
      // case z = h: ( m, m )
      case EQ: return [m, m];
      // case z > h: ( m - (z - h), m )
      case GT: return [m.minus(z.minus(h)), m];
    }
  },
};

class Node {
  constructor(...args) {
    this.isNull = args.length === 0;
    this.left = args[0] || null;
    this.right = args[1] || null;
    Object.freeze(this);
  }

  height() {
    if (this.isNull) return 0;
    return Math.max(this.left.height(), this.right.height()) + 1;
  }

  toBigInt() {
    if (this.isNull) return Big(0);
    return mapping.ii2i(this.left.toBigInt(), this.right.toBigInt());
  }

  toDigits() {
    return this.toBigInt().toFixed();
  }

  static fromInt(i) {
    i = Big(i).round().abs();
    if (i.eq(0)) return new Node();
    const [l, r] = mapping.i2ii(i);
    return new Node(Node.fromInt(l), Node.fromInt(r));
  }

  toDyckWord() {
    if (this.isNull) return "";
    return "(" + this.left.toDyckWord() + ")" + this.right.toDyckWord();
  }

  static fromString(src) {
    if (typeof src !== "string") throw new TypeError("invalid arguments");
    let pos = 0;
    function unexpected() {
      const done = src.slice(0, pos);
      const lines = done.split(/\r|\n|\r\n/);
      const position = `line ${lines.length}, column ${lines[lines.length - 1].length + 1}`;
      throw new SyntaxError(`unexpected ${src[pos] ? `token ${src[pos]}` : `end of input`} at ${position}`);
    }
    function spaces() {
      while (src[pos] === "\t" || src[pos] === "\n" || src[pos] === "\r" || src[pos] === " ") {
        pos += 1;
      }
    }
    function tree() {
      spaces();
      if (src[pos] === "(") {
        pos += 1;
        const left = tree();
        spaces();
        if (src[pos] === ")") {
          pos += 1;
          const right = tree();
          return new Node(left, right);
        } else {
          unexpected();
        }
      } else if ("0" <= src[pos] && src[pos] <= "9") {
        let num = "";
        while ("0" <= src[pos] && src[pos] <= "9") {
          num += src[pos];
          pos += 1;
        }
        return Node.fromInt(num);
      } else {
        return new Node();
      }
    }
    function text() {
      const val = tree();
      spaces();
      if (pos === src.length) {
        return val;
      } else {
        unexpected();
      }
    }
    return text();
  }

  renderAATree() {
    function getLines(n) {
      const thisInt = n.toDigits();
      if (n.isNull) {
        return ["0"];
      } else if (n.left.isNull && n.right.isNull) {
        return ["1"];
      } else if (n.left.isNull) {
        const rightLines = getLines(n.right);
        const pad = " ".repeat(rightLines[0].match(/\d+_* *$/)[0].length);
        let line0 = thisInt + " " + pad;
        let line1 = "\\" + pad;
        if (line0.length > rightLines[0].length) {
          return [
            line0,
            line1.padStart(line0.length),
            ...rightLines.map(line => line.padStart(line0.length))
          ];
        } else {
          return [
            line0.padStart(rightLines[0].length),
            line1.padStart(rightLines[0].length),
            ...rightLines
          ];
        }
      } else if (n.right.isNull) {
        const leftLines = getLines(n.left);
        const pad = " ".repeat(leftLines[0].match(/^ *_*\d+/)[0].length);
        let line0 = pad + " " + thisInt;
        let line1 = pad + "/";
        if (line0.length > leftLines[0].length) {
          return [
            line0,
            line1.padEnd(line0.length),
            ...leftLines.map(line => line.padEnd(line0.length))
          ];
        } else {
          return [
            line0.padEnd(leftLines[0].length),
            line1.padEnd(leftLines[0].length),
            ...leftLines
          ];
        }
      } else {
        let leftLines = getLines(n.left), rightLines = getLines(n.right);
        let margin = -Infinity;
        for (let i = Math.min(leftLines.length, rightLines.length); i--;) {
          margin = Math.max(margin, 3 - leftLines[i].match(/ *$/)[0].length - rightLines[i].match(/^ */)[0].length);
        }
        let line0 = thisInt;
        let line1 = "";
        let expands = leftLines[0].match(/_* *$/)[0].length + margin + rightLines[0].match(/^ *_*/)[0].length - 2;
        if (expands < line0.length) {
          margin += line0.length - expands;
          expands = line0.length;
        } else {
          if ((expands - line0.length) % 2 === 1) {
            margin += 1;
            expands += 1;
          }
          let us = "_".repeat((expands - line0.length) / 2);
          line0 = us + line0 + us;
        }
        if (-margin > leftLines[0].length) {
          leftLines = leftLines.map(line => line.padStart(-margin));
        } else if (-margin > rightLines[0].length) {
          rightLines = rightLines.map(line => line.padEnd(-margin));
        }
        line0 = " " + line0 + " ";
        line1 = "/" + " ".repeat(expands) + "\\";
        let ls = " ".repeat(leftLines[0].match(/^ *_*\d+/)[0].length);
        let rs = " ".repeat(rightLines[0].match(/\d+_* *$/)[0].length);
        line0 = ls + line0 + rs;
        line1 = ls + line1 + rs;
        const thisLines = [line0, line1];
        const width = line0.length;
        for (let i = 0, len = Math.max(leftLines.length, rightLines.length); i < len; i++) {
          let ll = (leftLines[i] || "").replace(/ *$/, "");
          let rl = (rightLines[i] || "").replace(/^ */, "");
          thisLines.push(ll + " ".repeat(width - ll.length - rl.length) + rl);
        }
        return thisLines;
      }
    }
    const lines = getLines(this);
    return lines.join("\n") + "\n";
  }

  renderHTree() {
    function silver(x) {
      return Math.round((x * Math.SQRT1_2) * 1e6) / 1e6;
    }
    // dir: [up right down left]
    function getPath(n, dir, size) {
      let d = "";
      if (n.isNull) return d;
      d += "vh"[dir & 1] + (1 - (dir & 2)) * size;
      d += getPath(n.left, (dir + 1) & 3, silver(size));
      d += getPath(n.right, (dir + 3) & 3, silver(size));
      d += "vh"[dir & 1] + ((dir & 2) - 1) * size;
      return d;
    }
    const width = this.height() * 40;
    const height = silver(width);
    const path = getPath(this, 2, height / 2);
    return `<svg width="${width}" height="${height}"><path d="M${width / 2} ${height}${path}" stroke="black"/></svg>`;
  }

  renderZigZag() {
    const lines = [];
    let space = 0;
    function put(n, idx) {
      if (n.isNull) return;
      lines[idx] = (lines[idx] || "").padEnd(space) + "/";
      space++;
      put(n.left, idx + 1);
      lines[idx] = lines[idx].padEnd(space) + "\\";
      space++;
      put(n.right, idx);
    }
    put(this, 0);
    return lines.reverse().join("\n") + "\n";
  }

  renderCircle() {
    if (this.isNull) {
      return "";
    }
    function radius(depth) {
      return 40 + 20 * depth;
    }
    const WIDTH = radius(this.height()) * 2;
    const HEIGHT = WIDTH;
    const { sin, cos, PI } = Math;
    const TAU = PI * 2;
    function polar(depth, turn) {
      let x = radius(depth) * cos(TAU * turn);
      let y = radius(depth) * sin(TAU * turn);
      return `${x} ${y}`;
    }
    function normalize(turn) {
      return (turn % 1 + 1) % 1;
    }
    let d = "";
    function line(d0, d1, turn) {
      d += `M ${polar(d0, turn)}\n`;
      d += `L ${polar(d1, turn)}\n`;
    }
    function arc(depth, t0, t1, large, clockwise) {
      d += `M ${polar(depth, t0)}`;
      d += `A ${radius(depth)} ${radius(depth)} ${TAU * t0} ${large} ${clockwise} ${polar(depth, t1)}`;
    }
    let curr = [
      { node: this, depth: 0, turn: 1 / 4 }
    ];
    while (curr.length) {
      let next = [];
      curr.forEach(({ node, depth: d0, turn: t0 }, idx) => {
        if (node.isNull || node.left.isNull && node.right.isNull) return;
        const d1 = d0 + 1;
        line(d0, d1, t0);
        if (!node.left.isNull) {
          const neighbor = curr[(idx || curr.length) - 1];
          let delta = normalize(neighbor.turn - t0);
          if (delta === 0) delta = 1;
          delta /= neighbor.node.right.isNull ? 2 : 4;
          const t1 = normalize(t0 + delta);
          arc(d1, t0, t1, 0, 1);
          next.push({ node: node.left, depth: d1, turn: t1 });
        }
        if (!node.right.isNull) {
          const neighbor = curr[(idx + 1) % curr.length];
          let delta = normalize(t0 - neighbor.turn);
          if (delta === 0) delta = 1;
          delta /= neighbor.node.left.isNull ? 2 : 4;
          const t1 = normalize(t0 - delta);
          arc(d1, t0, t1, 0, 0);
          next.push({ node: node.right, depth: d1, turn: t1 });
        }
      });
      curr = next;
    }
    return `<svg
      width="${WIDTH}"
      height="${HEIGHT}"
      viewBox="${-WIDTH / 2}, ${-HEIGHT / 2}, ${WIDTH}, ${HEIGHT}"
    >
      <circle cx="0" cy="0" r="${radius(0)}" stroke="black" fill="none"/>
      <path d="${d}" stroke-linecap="round" stroke="black" fill="none"/>
    </svg>`;
  }
}
