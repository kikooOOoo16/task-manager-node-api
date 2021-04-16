const requestSt = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const {userId1, user1, user2, task1, task3, populateDb} = require('./fixtures/db');


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

test('Should not create a task for user with invalid data', async () => {
    await requestSt(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: '',
            completed: true
        })
        .expect(400);
});

test('Should not update task with invalid data', async () => {
    await requestSt(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: '',
            completed: true
        })
        .expect(400);
});

test('Should not update other users task', async () => {
    await requestSt(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            description: 'Task test description',
            completed: true
        })
        .expect(404);

    const task = await Task.findById(task1._id);
    expect(task.description).toBe('Finish the tasks section.');
});

test('Should return single user task by id', async () => {
    const res = await requestSt(app)
        .get(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.task).not.toBeNull();
    expect(res.body.task.description).toBe('Finish the tasks section.')
});

test('Should not return single user task by id for unauthenticated user', async () => {
    const res = await requestSt(app)
        .get(`/tasks/${task1._id}`)
        .send()
        .expect(401)

    expect(res.body.task).toBeUndefined();
});

test('Should not return other user task by id', async () => {
    await requestSt(app)
        .get(`/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(404)
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

test('Should return all completed user tasks', async () => {
    const res = await requestSt(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.tasks.length).toBe(1);
});

test('Should return all tasks sorted by complete status', async () => {
    const res = await requestSt(app)
        .get('/tasks?sortBy=complete:asc')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.tasks.length).toBe(2);
    expect(res.body.tasks[0].completed).toBe(true);
});

test('Should return all tasks sorted by createdAt status', async () => {
    const res = await requestSt(app)
        .get('/tasks?sortBy=createdAt:asc')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.tasks.length).toBe(2);
    expect(res.body.tasks[0].description).toBe('Finish the tasks section.');
});

test('Should return specific page of tasks', async () => {
    const res = await requestSt(app)
        .get('/tasks?limit=1&skip=1')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.tasks.length).toBe(1);
    expect(res.body.tasks[0].description).toBe('Check when motogp fp1 starts tomorrow.');
});

test('Should return all incomplete user tasks', async () => {
    const res = await requestSt(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.tasks.length).toBe(1);
});

test('Should not delete other user\'s tasks', async () => {
    await requestSt(app)
        .delete(`/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(task3._id);
    expect(task).not.toBeNull();
});

test('Should delete user task', async () => {
    await requestSt(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(201);

    const task = await Task.findById(task1._id);
    expect(task).toBeNull();
});

test('Should not delete user task for unauthenticated user', async () => {
    await requestSt(app)
        .delete(`/tasks/${task1._id}`)
        .send()
        .expect(401);

    const task = await Task.findById(task1._id);
    expect(task).not.toBeNull();
});
