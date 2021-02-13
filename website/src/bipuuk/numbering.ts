import * as Tree from './tree';
import Big, { Comparison, RoundingMode } from 'big.js';

// 小数点以下を切り下げる。
Big.DP = 0;
Big.RM = 0 as RoundingMode.RoundDown;

const LT = -1 as Comparison.LT;
const EQ = 0 as Comparison.EQ;
const GT = 1 as Comparison.GT;

// function pair(x, y) {
//   if (x < y) return (y + 1) ** 2 - x;
//   if (x === y) return x ** 2 + y + 1;
//   if (x > y) return x ** 2 + y + 1;
// }
function pair(x: Big, y: Big): Big {
  switch (x.cmp(y)) {
    case LT:
      return y.plus(1).pow(2).minus(x);
    case EQ:
      return x.pow(2).plus(y).plus(1);
    case GT:
      return x.pow(2).plus(y).plus(1);
  }
}

// function unpair(z) {
//   const m = sqrt(z - 1);
//   const h = (m + 1) * m + 1;
//   if (z < h) return [m, m - (h - z)];
//   if (z === h) return [m, m];
//   if (z > h) return [m - (z - h), m];
// }
function unpair(z: Big): [Big, Big] {
  const m = z.minus(1).sqrt();
  const h = m.plus(1).times(m).plus(1);
  switch (z.cmp(h)) {
    case LT:
      return [m, m.minus(h.minus(z))];
    case EQ:
      return [m, m];
    case GT:
      return [m.minus(z.minus(h)), m];
  }
}

function toBigInt(tree: Tree.Tree): Big {
  if (Tree.isLeaf(tree)) return Big(0);
  return pair(toBigInt(tree.left), toBigInt(tree.right));
}

function fromBigInt(int: Big): Tree.Tree {
  if (int.eq(0)) return Tree.createLeaf();
  const [left, right] = unpair(int);
  return Tree.createBranch(fromBigInt(left), fromBigInt(right));
}

export function toDigits(tree: Tree.Tree): string {
  return toBigInt(tree).toFixed();
}

export function fromDigits(digits: string): Tree.Tree {
  const int = Big(digits).round().abs();
  return fromBigInt(int);
}
