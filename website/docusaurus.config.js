const path = require('path');
import remarkMath from 'remark-math';
const rehypeKatex = require('rehype-katex');

module.exports = {
  title: 'bipuuk',
  tagline: 'A constructed language',
  url: 'https://kepeken.github.io',
  baseUrl: '/bipuuk/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'kepeken',
  projectName: 'bipuuk',
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig: {
    navbar: {
      title: 'bipuuk',
      logo: {
        alt: 'bipuuk logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/kepeken/bipuuk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `&copy; 2018-${new Date().getFullYear()} kepeken.`,
    },
    prism: {
      additionalLanguages: ['bnf'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      path.resolve(__dirname, 'plugins/docusaurus-plugin-alias'),
      {
        alias: {
          '@bipuuk': path.resolve(__dirname, '..'),
          '@components': path.resolve(__dirname, './src/components'),
        },
      },
    ],
    [
      path.resolve(__dirname, 'plugins/docusaurus-plugin-elm'),
      {
        cwd: path.resolve(__dirname, '../parser'),
      },
    ],
    [
      path.resolve(__dirname, 'plugins/docusaurus-plugin-copy'),
      {
        patterns: [
          '../dictionary.tsv',
        ],
      },
    ],
  ],
};
