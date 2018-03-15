/*jshint esversion: 6 */

const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var userID = '5a9a0b72b2a55dba0e3029e0';

// var id = '5aa0a14e9b2805964cfe36ef';

// if (!ObjectID.isValid()) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {

//     if (!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo By ID', todo);

// }).catch((e) => console.log(e));

User.findById(userID).then((user) => {

    if (!user) {
        return console.log('ID not found');
    }
    console.log(JSON.stringify(user, undefined, 2));

},(e) => {
    console.log(e);
}).catch((e) => console.log(e));


