const mongoose = require('mongoose')



const Task = mongoose.model('Task', {
    name: String,
    status: Boolean,
    deleted: Boolean,
    userId: String
})

module.exports = Task