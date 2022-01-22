const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json());

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny',{skip: (req,res) => { return req.method == 'POST'}}))
app.use(morgan(':method :url :status - :response-time ms :body',{skip: (req,res) => { return req.method != 'POST'}} ))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const generateId = () => {
  return Math.floor(Math.random() * 6000);
};


app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name && !body.number) {
    return res.status(400).json({
      error: "name and number missing",
    });
  } else {
    if (!body.name) {
      return res.status(400).json({
        error: "name is missing"
      })
    }else{
      if (!body.number) {      
        return res.status(400).json({
        error: "number is missing"
      })}
    }
  }

  existing = persons.find(person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

  if (existing){
    return res.status(400).json({
      error: "the name already exits"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send(`Person with id ${id} doesn't exists`).end();
  }
});

app.get("/info", (req, res) => {
  const numberOfPersons = persons.length;
  const message =
    `Phonebook has info for ${numberOfPersons} people` +
    "<br/> <br/>" +
    `${new Date()}`;
  res.send(message);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const existing = persons.find((person) => person.id === id);

  if (existing) {
    persons = persons.filter((person) => person.id !== id);
    res.status(204).send(`Person with id ${id} deleted successfully`).end();
  } else {
    res.status(404).send(`Person with id ${id} doesn't exists`).end();
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
