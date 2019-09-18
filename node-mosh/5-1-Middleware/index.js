const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); //key=value&key=value
app.use(express.static('public')); //store static assests (http://localhost:3000/readme.txt - static content server from the root of the site)
app.use(helmet());

//cmd - exprt NODE_ENV = production
//      export NODE_ENV=development
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  // console.log('Morgan enabled...');
  // cmd      - export DEBUG=app:startup
  // cmd      - export DEBUG=app:startup,app:db
  // cmd      - export DEBUG=app:*
  // Reseting - export DEBUG=
  startupDebugger('Morgan enabled...');
}

//Db Work
dbDebugger('Connected to the database...!');

// Configuration change accordingly to exprt NODE_ENV varialbe
// config/default.json, development.json, production.json
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));

//adding sensitive data cmd - export app_password=1234
// config/custom-enviornment-variables.json
console.log('Mail Password: ' + config.get('mail.password'));

app.use(logger); //Middleware function (called in squence - logger)

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
