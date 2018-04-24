/*jshint esversion: 6 */
require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(JSON.stringify(e, undefined, 2));
    });

});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Object ID: ${id}`);
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e) => res.status(500).send(e));

});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Object ID: ${id}`);
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }
        res.status(202).send(todo);

    }).catch((e) => res.sendStatus(500).send(e));

});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Object ID: ${id}`);
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true})
        .then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }

        res.send(todo);

    }).catch((e) => res.status(400).send());

});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);

});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    });

});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    });

})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((user) => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });


});


app.listen(port, () => {
    console.log(`Start on port ${port}`);
});

module.exports = {app};
