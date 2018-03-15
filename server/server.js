/*jshint esversion: 6 */
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

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

app.listen(port, () => {
    console.log(`Start on port ${port}`);
});

module.exports = {app};
