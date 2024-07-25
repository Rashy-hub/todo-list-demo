require('dotenv-flow').config() // Load environment variables from .env file

const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const todoRouter = require('./routes/todo-route')
const authRouter = require('./routes/auth-route')
const logRequest = require('./middleware/request-logger')
const { registratedRoutes, extractRoutes } = require('./middleware/registratedRoutes')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // To parse the incoming requests with JSON payloads

//extract env variables
const { PORT, NODE_ENV, MONGODB_URI, MONGO_LOCAL } = process.env
const port = PORT
let mongoURI = null
// Connect to MongoDB (replace with your connection string)
if (NODE_ENV === 'development') {
    mongoURI = MONGO_LOCAL
} else {
    mongoURI = MONGODB_URI
}

mongoose
    .connect(mongoURI)
    .then(() => console.log(`Connected to MongoDB - Connection string :  ${mongoURI}`))
    .catch((err) => console.error('Error connecting to MongoDB:', err))

// Middleware

app.use(logRequest)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public'))) // Serve static assets from public folder

// Routes
registratedRoutes.push(todoRouter)
registratedRoutes.push(authRouter)

app.use('/api', ...registratedRoutes)

// Handle root URL to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('*', extractRoutes, (req, res) => {
    const errorMessage = 'Page not found. Available routes:'
    const responseBody = {
        error: errorMessage,
        availableRoutes: req.extractedPaths,
    }

    res.status(404).json(responseBody)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port} - in ${NODE_ENV} environnement`)
})
