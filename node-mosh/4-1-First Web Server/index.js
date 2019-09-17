const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

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
    return res.status(404).send('The course with the given ID was not found');
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

/* Use postman to test this METHOD = POST
  IN - http://localhost:3000/api/courses
  Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
  {
    "name": "new course"
  }
  OUT - {
          "id": 4,
          "name": "new course"
        }

  IN - http://localhost:3000/api/courses 
  Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
  {
    "name": "a"
  }
  OUT - Name is required and shoud be minimum 3 character long 
      - With 400 Bad request
*/
app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);

  res.send(course);
});

/*
    IN - http://localhost:3000/api/courses/1 MEHTOD - PUT
    Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
    CORRECT INPUT
    {
      "name": "new course"
    }
    OUT - id one course will be updatede to new course
      {
        "id": 1,
        "name": "new course"
      }

    IN - http://localhost:3000/api/courses/10 MEHTOD - PUT
    Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
    CORRECT INPUT
    {
      "name": "new course"
    }
    OUT - The course with the given ID was not found

    IN - http://localhost:3000/api/courses/1 MEHTOD - PUT
    Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
    CORRECT INPUT
    {
      "name": "new course"
    }
    OUT - The course with the given ID was not found

*/
app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send('The course with the given ID was not found');

  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('The course with the given ID was not found');
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
