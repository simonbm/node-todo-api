/*jshint esversion: 6 */

// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');

 



    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });


    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });


    db.collection('Users').deleteMany({name: 'Simon'}).then((result) => {
            console.log(result);
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5a9786deeabc8162f93d4e1e")}).then((result) => {
        console.log(result);
    });



    //client.close();
});