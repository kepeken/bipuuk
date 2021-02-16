import { createBranch, createLeaf, Tree } from './tree';
import { fromDigits } from './numbering';
import P from 'parsimmon';

interface Language {
  start: Tree;
  tree: Tree;
  dyck: Tree;
  number: Tree;
}

const language = P.createLanguage<Language>({
  start(r) {
    return r.tree.trim(P.optWhitespace);
  },

  tree(r) {
    return P.alt(r.dyck, r.number);
  },

  dyck(r) {
    return P.alt(
      P.seqObj<{ left: Tree; right: Tree }>(
        P.string('/'),
        P.optWhitespace,
        ['left', r.tree],
        P.optWhitespace,
        P.string('\\'),
        P.optWhitespace,
        ['right', r.tree]
      ).map(({ left, right }) => createBranch(left, right)),
      P.succeed(null).map(() => createLeaf())
    );
  },

  number() {
    return P.regexp(/0|[1-9][0-9]*/).map(fromDigits);
  },
});

export type Result = P.Result<Tree>;

export function parse(input: string): P.Result<Tree> {
  return language.start.parse(input);
}
