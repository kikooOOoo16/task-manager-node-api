const requestSt = require('supertest');
const {userId1, populateDb, user1} = require('./fixtures/db')

const app = require('../src/app');
const User = require('../src/models/user');

beforeEach(populateDb);

test('Should sign up a new user', async () => {
    const res = await requestSt(app)
        .post('/users')
        .send({
            name: 'Kristijan',
            email: 'kristijan.pavlevski@outlook.com',
            password: 'pass1234!'
        }).expect(201);

//    Assert that the DB aws changed correctly.
    const user = await User.findById(res.body.user._id);
    expect(user).not.toBeNull();

//    Assertions about the response
//     expect(res.body.user.name).toBe('Kristijan');
    expect(res.body).toMatchObject({
        user: {
            name: 'Kristijan',
            email: 'kristijan.pavlevski@outlook.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('pass1234!');
});

test('Should login existing user', async () => {
    const res = await requestSt(app)
        .post('/users/login')
        .send({
            email: user1.email,
            password: user1.password
        })
        .expect(200);

//    Validate new token is saved
    const userInDb = await User.findById(res.body.user._id);

    expect(res.body.token).toBe(userInDb.tokens[1].token);
});

test('Shouldn\'t login nonexistent user.', async () => {
    await requestSt(app)
        .post('/users/login')
        .send({
            email: 'nonexistent@mail.com',
            password: '12345r3212'
        })
        .expect(400);
});

test('Should get user profile', async () => {
    await requestSt(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await requestSt(app)
        .get('/users/profile')
        .send()
        .expect(401);
});

test('Should delete user account', async () => {
    await requestSt(app)
        .delete('/users/profile')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(201);

//    validate user is removed from DB
    const deletedUser = await User.findById(userId1);
    expect(deletedUser).toBeNull();
});

test('Should not delete user account for unauthenticated user', async () => {
    await requestSt(app)
        .delete('/users/profile')
        .send()
        .expect(401)
});

test('Should upload avatar image', async () => {
    await requestSt(app)
        .post('/users/profile/image')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('profileImage', 'tests/fixtures/profile-picture.jpg')
        .expect(200);

    const returnUser = await User.findById(userId1);
    //toEqual doesnt use strict equality. It checks fields for equal values.
    expect(returnUser.profileImage).toEqual(expect.any(Buffer));
//     Check if profileImage equals to any buffer.
});

test('Should update name field of user', async () => {
    await requestSt(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            name: 'Kiko',
            age: 26
        })
        .expect(201);
    const updatedUser = await User.findById(userId1);
    expect(updatedUser.name).toBe('Kiko');
});

test('Should fail user update because of invalid field', async () => {
    await requestSt(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            birthday: '13 Oct 1994'
        })
        .expect(400);
});
