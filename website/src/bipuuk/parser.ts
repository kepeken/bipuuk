import { createBranch, createLeaf, isLeaf, Tree } from './tree';
import { fromDigits } from './numbering';
import P from 'parsimmon';

const TABLE = 'aeioubcdfghjklmnpqrstvwxyz';

function fromWordRoot(wordRoot: string): Tree {
  const left = fromDigits(String(TABLE.indexOf(wordRoot[0])));
  const right = fromDigits(String(TABLE.indexOf(wordRoot[1])));
  return createBranch(left, right);
}

function replaceLeaves(tree: Tree, replacement: () => Tree): Tree {
  if (isLeaf(tree)) {
    return replacement();
  } else {
    return createBranch(
      replaceLeaves(tree.left, replacement),
      replaceLeaves(tree.right, replacement)
    );
  }
}

const Language = P.createLanguage<{
  Start: Tree;
  Tree: Tree;
  NonEmptyTree: Tree;
  Branch: Tree;
  Leaf: Tree;
  Number: Tree;
  Word: Tree;
}>({
  Start(r) {
    return r.Tree.trim(P.optWhitespace);
  },

  Tree(r) {
    return P.alt(r.Number, r.Word, r.Branch, r.Leaf);
  },

  NonEmptyTree(r) {
    return P.alt(r.Number, r.Word, r.Branch);
  },

  Branch(r) {
    return P.seqMap(
      P.string('/').then(P.optWhitespace).then(r.Tree).skip(P.optWhitespace),
      P.alt(P.string('\\').then(P.optWhitespace).then(r.Tree), r.NonEmptyTree),
      createBranch
    );
  },

  Leaf() {
    return P.succeed(null).map(createLeaf);
  },

  Number() {
    return P.regexp(/0|[1-9][0-9]*/).map(fromDigits);
  },

  Word() {
    return P.regexp(/(?:[a-z]{2})+/i).chain((word) => {
      const wordRoots = word
        .toLowerCase()
        .match(/[a-z]{2}/g)!
        .map(fromWordRoot);

      const result = Morphology.Word.parse(word);
      if (result.status) {
        const tree = replaceLeaves(result.value, () => wordRoots.shift()!);
        return P.succeed(tree);
      } else {
        return P.fail(`word`);
      }
    });
  },
});

const Morphology = P.createLanguage<{
  Word: Tree;
  Structure: Tree;
  Suffix: Tree;
}>({
  Word(r) {
    return P.alt(
      P.regexp(/[A-Z]/).then(P.seqMap(r.Structure, r.Suffix, createBranch)),
      P.regexp(/[a-z]/).then(r.Structure)
    );
  },

  Structure(r) {
    return P.alt(
      P.regexp(/[A-Z]/).then(P.seqMap(r.Structure, r.Structure, createBranch)),
      P.regexp(/[a-z]/).map(createLeaf)
    );
  },

  Suffix() {
    return P.regexp(/[a-z]{2}/).map(createLeaf);
  },
});

export type Result = P.Result<Tree>;

export function parse(input: string): P.Result<Tree> {
  return Language.Start.parse(input);
}
