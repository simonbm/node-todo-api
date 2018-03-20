/*jshint esversion: 6 */
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
const {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
            res.send(doc);
    }, (e) => {
            res.status(400).send(JSON.stringify(e,undefined,2));
    });
    
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Object ID: ${id}`);
    }

    Todo.findById(id).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});        

    }).catch((e) => res.status(500).send(e));

});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Object ID: ${id}`);
    }

    Todo.findByIdAndRemove(id).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }
        res.status(202).send(todo);

    }).catch((e) => res.sendStatus(500).send(e));

});

app.listen(port, () => {
    console.log(`Start on port ${port}`);
});

module.exports = {app};
