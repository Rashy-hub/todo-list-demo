const express = require('express')
const todoController = require('../controllers/todo-controller')
const { authentificateJwt } = require('../middleware/authentificate-jwt')

const todoRouter = express.Router()
authentificateJwt
todoRouter.get('/todo', authentificateJwt(), todoController.getTodos)
todoRouter.post('/todo/add', authentificateJwt(), todoController.addTodo)
todoRouter.post('/todo/complete/:id', authentificateJwt(), todoController.completeTodo)
todoRouter.post('/todo/delete/:id', authentificateJwt(), todoController.deleteTodo)
todoRouter.post('/todo/clear', authentificateJwt(), todoController.clearTodo)

module.exports = todoRouter
