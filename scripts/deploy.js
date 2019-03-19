const ghpages = require('gh-pages');

[
  new Promise((resolve, reject) => {
    ghpages.publish('.', {
      src: [
        'README.md',
      ],
      add: true,
    }, (err) => {
      err ? reject(err) : resolve();
    });
  }),
  new Promise((resolve, reject) => {
    ghpages.publish('docs/_book', {
      dest: 'docs',
      add: true,
    }, (err) => {
      err ? reject(err) : resolve();
    });
  }),
  new Promise((resolve, reject) => {
    ghpages.publish('parser/build', {
      dest: 'parser',
      add: true,
    }, (err) => {
      err ? reject(err) : resolve();
    });
  }),
].reduce((p, f) => p.then(f), Promise.resolve()).catch(e => console.error(e));
