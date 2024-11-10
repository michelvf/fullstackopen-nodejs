const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

morgan.token('body', function getBody (req) {
  const body = req.body
  return JSON.stringify(body)
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    console.log('x')
    response.status(404).end()
  }
})

// Delete a Note
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// Update a Note
app.put('/api/notes/:id', (req, res) => {

  const id = Number(req.params.id)
  const body = req.body

  note = notes.find(note => note.id == id)

  const noteUpdate = {
    id: id,
    content: body.content,
    important: body.important
  }

  const noteIndex = notes.indexOf(note)

  notes.splice(noteIndex, 1, noteUpdate)

  res.status(201).json({ 'message': "data updated" })
})



app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
