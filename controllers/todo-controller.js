const { default: mongoose } = require('mongoose')
const Todo = require('../models/todo')
const User = require('../models/user')

exports.getTodos = async (req, res) => {
    try {
        // Ensure req.user is populated with the authenticated user's information
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User not authenticated')
        }

        const userId = req.user.id // Get the logged-in user's ID
        console.log(userId)
        // Validate that userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID')
        }

        // Find all todos where the user field matches the logged-in user's ID
        const todos = await Todo.find({ user: userId })

        console.log('Rendering layout with filtered todos')
        res.json({ todos })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving todos')
    }
}

exports.addTodo = async (req, res) => {
    const { user, text } = req.body
    const userId = req.user.id // Get the logged-in user's ID
    // const currentUser = await UserModel.findOne({ _id: req.user })
    console.log(`add todo "${text}" as user ${user} with id = ${req.user.id}`)
    try {
        const todo = new Todo({ text: text, completed: false, user: req.user.id })
        await todo.save()
        const todos = await Todo.find({ user: userId })
        res.json({ todos })
        //res.redirect('/todo')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error adding todo')
    }
}
exports.completeTodo = async (req, res) => {
    const { id } = req.params
    // Ensure req.user is populated with the authenticated user's information
    if (!req.user || !req.user.id) {
        return res.status(401).send('Unauthorized: User not authenticated')
    }

    const userId = req.user.id // Get the logged-in user's ID

    try {
        // Find the todo by ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(id)
            return res.status(400).send('Invalid todo ID')
        }
        const todo = await Todo.findById(id)
        console.log('GETTING INSIDE CONTROLER COMPLETEDTODO')

        if (!todo) {
            return res.status(404).send('Todo not found')
        }

        // Toggle the 'completed' state
        todo.completed = !todo.completed

        // Save the updated todo
        await todo.save()
        const todos = await Todo.find({ user: userId })
        res.json({ todos })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error updating todo')
    }
}
exports.deleteTodo = async (req, res) => {
    const { id } = req.params
    // Ensure req.user is populated with the authenticated user's information
    if (!req.user || !req.user.id) {
        return res.status(401).send('Unauthorized: User not authenticated')
    }

    const userId = req.user.id // Get the logged-in user's ID

    try {
        // Find the todo by ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(id)
            return res.status(400).send('Invalid todo ID')
        }
        await Todo.findByIdAndDelete(id)
        const todos = await Todo.find({ user: userId })
        res.json({ todos })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting todo')
    }
}

exports.clearTodo = async (req, res) => {
    // Ensure req.user is populated with the authenticated user's information
    if (!req.user || !req.user.id) {
        return res.status(401).send('Unauthorized: User not authenticated')
    }

    const userId = req.user.id // Get the logged-in user's ID

    try {
        // Delete all todos associated with the user ID
        await Todo.deleteMany({ user: userId })
        res.json({ todos: [] })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error clearing todos')
    }
}
