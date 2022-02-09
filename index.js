const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const config = require('./config')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function (req, ignore) {
  return JSON.stringify(req.body)
})
app.use(
  morgan('tiny', {
    skip: (req, res) => {
      return req.method === 'POST'
    },
  })
)
app.use(
  morgan(':method :url :status - :response-time ms :body', {
    skip: (req, res) => {
      return req.method !== 'POST'
    },
  })
)

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      console.log(
        `added ${savedPerson.name} ${savedPerson.number} to phonebook`
      )
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  /*   Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error)) */
  //using findOneAndUpdate function because findByIdAndUpdate doesn't work with runValidators options
  const filter = { _id: req.params.id }
  Person.findOneAndUpdate(filter, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id)
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send(`Person with id ${id} doesn't exists`).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res,next) => {
  Person.find({})
    .then((persons) => {
      const message =
        `Phonebook has info for ${persons.length} people` +
        '<br/> <br/>' +
        `${new Date()}`
      res.send(message)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id.toString()

  Person.findByIdAndRemove(id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        res
          .status(204)
          .send({
            success: `Person with id ${deletedPerson.name} deleted successfully`,
          })
          .end()
      } else {
        res.status(404).send(`Person with id ${id} doesn't exists`).end()
      }
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = config.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
