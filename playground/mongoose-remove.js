/*jshint esversion: 6 */

const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((result) => {
//     console.log(result);
// });

//Todo.findOneAndRemove

Todo.findByIdAndRemove('adsf').then((result) => {
    console.log(result);
});

Todo.findOneAndRemove({
    _id: '123456778'
}).then((result) => {
    console.log(result);
});