/*jshint esversion: 6 */

// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5a98c29feae57eb6d2dc4069")
    // }, {
    //     $set: { completed: true }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     consolels.log(result);
    // });

    //ObjectID("5a9786333d51c562f6e3a0e6")

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5a9786333d51c562f6e3a0e6")
    }, {
        $set: { name: 'Simon' },
        $inc: {age: 1}

    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    //client.close();
});