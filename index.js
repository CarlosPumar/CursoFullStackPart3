const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('post-info', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }

    return ''
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :post-info'
    )
)

//Endpoints

//GETS
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then((persons) => {
            response.json(persons)
        })
        .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then((person) => {
            response.json(person)
        })
        .catch((error) => next(error))
})

//DELETE
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

//POST
app.post('/api/persons', (request, response, next) => {
    let body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    Person.find({ name: newPerson.name }).then(() => {
        newPerson
            .save()
            .then((savedPerson) => {
                response.json(savedPerson)
            })
            .catch((error) => next(error))
    })
})

//PUT
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {
        new: true,
        runValidators: true,
    })
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch((error) => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then((persons) => {
        const dateStr = new Date().toString()
        response.send(
            `Phonebook has info for ${persons.length} people / ${dateStr}`
        )
    })
})

// ERRORS

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

// Run and listen to port
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
