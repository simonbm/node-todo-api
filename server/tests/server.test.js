/*jshint esversion: 6 */

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(3);
                expect(todos[2].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => { 
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var newId = new ObjectID();

        request(app)
        .get(`/todos/${newId.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {

        var invalidID = 'dhdhdhdhdhdhd';
        request(app)
        .get(`/todos/${invalidID}`)
        .expect(404)
        .end(done);
        
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexID = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(202)
        .expect((res) => {
            expect(res.body._id).toBe(`${hexID}`);
        }).end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexID).then((todo) => {

                expect(todo).toNotExist(); 
                done();       
            }).catch((e) => done(e));
        });

    });

    it('should return 404 if todo not found', (done) => {
        var newId = new ObjectID();

        request(app)
        .delete(`/todos/${newId.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {

        var invalidID = 'dhdhdhdhdhdhd';
        request(app)
        .delete(`/todos/${invalidID}`)
        .expect(404)
        .end(done);
        
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);

    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});
