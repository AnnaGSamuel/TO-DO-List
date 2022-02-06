const {Schema, model} = require('mongoose');

const toDoSchema = new Schema({
    taskName:{
        type:String,
        required:true
    },
    taskDesc:{
        type:String,
        required:true
    }
})

 model('todo', toDoSchema)

