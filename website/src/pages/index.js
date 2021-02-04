import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: '言語仕様',
    description: (
      <>
        現在 v0.3.1 を執筆中です。
      </>
    ),
    link: {
      to: 'docs/',
      text: <>言語仕様を見る</>,
    },
  },
  {
    title: '構文解析器',
    description: (
      <>
        現在移植中です。しばらくは古いバージョンにアクセスできます。
        <ul>
          <li><Link to="https://kepeken.github.io/bipuuk/v0.3/parser/">v0.3.1</Link></li>
          <li><Link to="https://kepeken.github.io/bipuuk/parser/">v0.3.0</Link></li>
          <li><Link to="https://kepeken.github.io/bipuuk/v0.2/parser/">v0.2.1</Link></li>
        </ul>
      </>
    ),
  },
  {
    title: 'GitHub',
    description: (
      <>
        このサイトとパーサのソースコードや辞書データは GitHub で公開しています。
      </>
    ),
    link: {
      to: 'https://github.com/kepeken/bipuuk',
      text: <>リポジトリを見る</>,
    },
  },
  {
    title: 'Scrapbox',
    description: (
      <>
        言語仕様外のことは Scrapbox にまとめています。
      </>
    ),
    link: {
      to: 'https://scrapbox.io/bipuuk/',
      text: <>Scrapbox を見る</>,
    },
  },
];

function Feature({title, description, link}) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg', styles.feature)}>
      <div className="card">
        <div className="card__header">
          <h3>{title}</h3>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        {link && (
          <div className="card__footer">
            <Link className="button button--secondary button--block" to={useBaseUrl(link.to)}>{link.text}</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
