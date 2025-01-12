import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    'kouzau',
    'xeuki',
    'bangau',
    'kegtairon',
    {
      '文法': [
        'bunpafu/kixon',
        'bunpafu/jokaku',
        'bunpafu/seisi',
        'bunpafu/simtaisi',
      ],
    },
    'rimgobun',
  ],
};

export default sidebars;
