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
  /*  This error handling is very bad use joi instead*/
  // if (!req.body.name || req.body.name.length < 3) {
  //   //400 Bad Request
  //   res
  //     .status(400)
  //     .send('Name is required and shoud be minimum 3 character long');
  // }

  /* DON'T NEED THIS USE THE SIMPLYFY VERSION
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  const result = Joi.validate(req.body, schema);
  */

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  /*
    IN - http://localhost:3000/api/courses 
    Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
    CORRECT INPUT
    {
      "name": "name"
    }
    OUT IN CONSOLE FOR result
      { error: null,
        value: { name: 'name' },
        then: [Function: then],
        catch: [Function: catch] 
      }


      IN - http://localhost:3000/api/courses 
    Then select the body as a request raw. In the drop text drop down select JSON(applicaiton/json)
    INCORRECT INPUT
    {
      "name": "a"
    }
    OUT IN CONSOLE FOR result
      { error: { ValidationError: child "name" fails because ["name" length must be at least 3 characters long].........,
        isJoi: true,
        name: 'ValidationError',
        details: [ [Object] ],
        _object: { name: 'a' },
        annotate: [Function] },
        value: { name: 'a' },
        then: [Function: then],
        catch: [Function: catch] 
      }
  */
  // console.log(result);

  // if (result.error) {
  //400 Bad Request
  //res.status(400).send(result.error); /* Too complex we can simplyfy*/
  /* 
      In - {
            "name": "a"
           }
      Out - "name" length must be at least 3 characters long

      In - {}
      Out - "name" is required
    */
  // res.status(400).send(result.error.details[0].message);
  // return;
  // }
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
  //Look up the course
  //If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send('The course with the given ID was not found');
  //Validate
  //If invalid, return 400 - Bad request

  /*
  const result = validateCourse(req.body); //Simplyfy by object redestruction
  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  */
  //object redestruction
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //Update course
  course.name = req.body.name;
  // Return the update course
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
