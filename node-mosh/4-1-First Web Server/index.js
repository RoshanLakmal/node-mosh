const express = require('express');
const app = express();

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

/* 
  IN - http://localhost:3000/api/posts/1
  OUT - {
          "id": 1,
          "name": "course1"
        }

  IN - http://localhost:3000/api/courses/10
  OUT - The course with the given ID was not found
*/
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send('The course with the given ID was not found');
  res.send(course);
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
