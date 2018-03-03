/*jshint esversion: 6 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo',
{
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type:Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var User = mongoose.model('User', 
{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }

});

/*var newTodo = new Todo({
    text: true
    
});

newTodo.save().then((doc) => {

    console.log('Saveed todo', JSON.stringify(doc,undefined,2));

}, (e) => {

    console.log('Unable to save todo',e);

});*/

var newUser = new User({
    email: 'simonbm@gmail.com'
});

newUser.save().then((doc) => {
    console.log('Saveed todo', JSON.stringify(doc,undefined,2));
}, (e) => {
    console.log('Unable to save todo',e);
});