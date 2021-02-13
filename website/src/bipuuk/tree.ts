export type Tree = Leaf | Branch;
export type Leaf = Readonly<{ type: typeof Leaf }>;
export type Branch = Readonly<{ type: typeof Branch; left: Tree; right: Tree }>;

const Leaf = Symbol('Leaf');
const Branch = Symbol('Branch');

export function createLeaf(): Leaf {
  return { type: Leaf };
}

export function createBranch(left: Tree, right: Tree): Branch {
  return { type: Branch, left, right };
}

export function isLeaf(tree: Tree): tree is Leaf {
  return tree.type === Leaf;
}

export function isBranch(tree: Tree): tree is Branch {
  return tree.type === Branch;
}

export function height(tree: Tree): number {
  if (isLeaf(tree)) {
    return 0;
  } else {
    return Math.max(height(tree.left), height(tree.right)) + 1;
  }
}
