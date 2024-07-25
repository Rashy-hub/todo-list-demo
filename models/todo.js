const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    // Référence à l'utilisateur
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
})

const Todo = mongoose.model('todos', TodoSchema)

module.exports = Todo
