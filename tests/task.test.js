const requestSt = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const {userId1, user1, task3, populateDb} = require('./fixtures/db');


beforeEach(populateDb);

test('Should create a task for user', async () => {
    const res = await requestSt(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: 'Finish learning about Jest.js'
        })
        .expect(201);
    const task = await Task.findById(res.body.task._id);
    expect(task).not.toBeNull();
    expect(task.description).toBe('Finish learning about Jest.js');
    expect(task.completed).toBe(false);
});

test('Should return all tasks related to user1', async () => {
    const res = await requestSt(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
    expect(res.body.tasks).not.toBeNull();
    expect(res.body.tasks.length).toBe(2);
});

test('Should not delete other user\'s tasks', async () => {
    const res = await requestSt(app)
        .delete(`/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(task3._id);
    expect(task).not.toBeNull();
});
