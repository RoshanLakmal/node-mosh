const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send([1, 2, 3]);
});

/* 
  IN - http://localhost:3000/api/posts/1
  OUT - 1
*/
app.get('/api/courses/:id', (req, res) => {
  res.send(req.params.id);
});

/*
  IN - http://localhost:3000/api/posts/2019/09
  OUT - {
          "year": "2019",
          "month": "09"
        }
*/
app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.params);
});

/* uncomment the top one with the same route
  IN - http://localhost:3000/api/posts/2019/09?sortBy=name
  OUT - {
          "sortBy": "name"
        }
*/
app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.query);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
