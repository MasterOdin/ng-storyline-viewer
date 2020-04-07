const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

const data = require('./data/sample_spa_data.json');

app.use(cors());

app.get('/', (req, res) => {
  const start = req.query.start ? parseInt(req.query.start) : 0;
  const count = req.query.count ? parseInt(req.query.count) : 50;

  console.log(`Getting storylines (${start}, ${count})`);

  const clusters = data.shortClusters.slice(start, start + count);
  let ids = new Set();
  for (const cluster of clusters) {
    for (const id of cluster) {
      ids.add(id);
    }
  }
  const articles = data.articles.filter((article) => ids.has(article.id));

  console.log(`Returning ${articles.length} articles, ${clusters.length} short clusters`);
  res.json({
    articles: articles,
    shortClusters: clusters
  })
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
})
