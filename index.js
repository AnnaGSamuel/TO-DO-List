const express = require("express");
const app = express();
const port = 3000;
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('./models/toDoModel')
const toDoModel = mongoose.model('todo')

mongoose.connect('mongodb://127.0.0.1:27017/todo',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("The db is connected"))
.catch((err)=>console.log(err))

const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }))
 app.use(bodyParser.json({ extended: true }))

 app.get('/', (req, res) => {
     toDoModel.find({}) .lean().exec(function (err, docs) {
         if(!err){
             res.render('home', {tasks: docs})
         }
         else{
             console.log(`error while reading from db ${err}`)
             res.render('home')
         }
         
     })
        
});

app.post('/', (req, res) => {
    addTask(req, res)
})
app.get('/delete/:id', (req, res)=>{
    deleteTask(req.params.id, res)

   
})

app.get('/edit/:id',(req, res)=>{
    toDoModel.findById(req.params.id, (err,doc)=>{
        if(!err){
             res.render('edit', {task: doc.toJSON()})
        }else{
            console.log(`Error while finding task ${err}`);
        }
    })
     
})
app.post('/edit/:id/save', (req, res)=>{
    editTask(req, res)
}
)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// Functions
function addTask(req, res) {
    let task = new toDoModel({
        taskName: req.body.taskName,
        taskDesc: req.body.taskDesc
    })
    task.save((err, doc)=>{
        if(!err){
            console.log(`Saved Task of id ${doc.id}`)
            res.redirect('/')
        }else{
            console.log(`Error while saving Task ${err}`)
            res.redirect('/')
        }
    })
}

function deleteTask(id, res){
    toDoModel.findByIdAndDelete(id, (err,doc)=>{
        if(!err){
            console.log(`deleted task of id ${doc.id}`);
            res.redirect('/')
        }else{
            console.log(`error while deleting task ${err}`);
            res.redirect('/')
        }
    })

}
function editTask(req, res) {
    let update ={
        taskName: req.body.editTaskName,
        taskDesc: req.body.editTaskDesc
    };
    toDoModel.findByIdAndUpdate(req.params.id,update, (err, doc)=>{
        if(!err){
             console.log(`updated doc of id ${doc._id}`);
             res.redirect('/')
        }else{
            console.log(`Error Updating Task ${err}`)
            res.redirect('/')

        }

    })
}