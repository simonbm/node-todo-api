/*jshint esversion: 6 */

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
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


    it('should create a todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should not return todo doc created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });



    it('should return 404 if todo not found', (done) => {
        var newId = new ObjectID();

        request(app)
            .get(`/todos/${newId.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {

        var invalidID = 'dhdhdhdhdhdhd';
        request(app)
            .get(`/todos/${invalidID}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexID = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
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
            });
        });

    });


    it('should not delete todo doc owned by another user', (done) => {
        var hexID = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexID).then((todo) => {

                expect(todo).toExist();
                done();
            });
        });

    });

    it('should return 404 if todo not found', (done) => {
        var newId = new ObjectID();

        request(app)
            .delete(`/todos/${newId.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {

        var invalidID = 'dhdhdhdhdhdhd';
        request(app)
            .delete(`/todos/${invalidID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);

    });
});

describe('PATCH /todos/:id', () => {

    it('should modify the specified todo', (done) => {
        var hexID = todos[0]._id.toHexString();
        var modifiedValues = {
            text:"this is the test text",
            completed: true
        }

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(modifiedValues)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(modifiedValues.text);
                expect(res.body.completed).toBe(modifiedValues.completed);
                expect(res.body.completedAt).toExist()
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });

    })

    it('should clear completedAt when todo is not completed', (done) => {
        var hexID = todos[1]._id.toHexString();
        var modifiedValues = {
            text:"this is the test text",
            completed: false
        }

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(modifiedValues)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(modifiedValues.text);
                expect(res.body.completed).toBe(modifiedValues.completed);
                expect(res.body.completedAt).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });

    })

    it('should not modify the specified todo if owned by another user', (done) => {
        var hexID = todos[1]._id.toHexString();
        var modifiedValues = {
            text:"this is the test text",
            completed: true
        }

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(modifiedValues)
            .expect(404)
            .end(done);

    })

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

describe('POST /users', () => {

    it('should create user', (done) => {
        var email = 'email@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'emailexample.com';
        var password = '123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    })

    it('should not create user if email in user', (done) => {
        var email = 'nicks@test.com';
        var password = '123#eedcdf';
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password
            })
            .expect(400)
            .end(done);
    });

});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'badpassword'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {

    it('should remove the access token on logout', (done) => {
        request(app)
            .del('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });

});
