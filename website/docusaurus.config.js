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
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
