const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const genres = [
  { id: 1, name: 'genre1' },
  { id: 2, name: 'genre2' },
  { id: 3, name: 'genre3' }
];

app.get('/', (req, res) => {
  res.send('Vindly is running');
});

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

app.post('/api/genres', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  genre.name = req.body.name;
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
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
