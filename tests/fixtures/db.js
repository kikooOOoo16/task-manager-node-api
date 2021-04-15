const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');


const userId1 = new mongoose.Types.ObjectId();

const user1 = {
    _id: userId1,
    name: 'Kristijan',
    email: 'kiko_bt_@hotmail.com',
    password: 'pass1234!',
    tokens: [
        {
            token: jwt.sign({
                _id: userId1,
            }, process.env.JWTSECRET)
        }
    ]
};

const userId2 = new mongoose.Types.ObjectId();

const user2 = {
    _id: userId2,
    name: 'Angela',
    email: 'angela@hotmail.com',
    password: 'pass1234!',
    tokens: [
        {
            token: jwt.sign({
                _id: userId2,
            }, process.env.JWTSECRET)
        }
    ]
};

const task1 = {
    _id: new mongoose.Types.ObjectId,
    description: 'Finish the tasks section.',
    completed: false,
    owner: userId1
}

const task2 = {
    _id: new mongoose.Types.ObjectId,
    description: 'Check when motogp fp1 starts tomorrow.',
    completed: false,
    owner: userId1
}

const task3 = {
    _id: new mongoose.Types.ObjectId,
    description: 'Fix PC LED config.',
    completed: false,
    owner: userId2
}

const populateDb = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(user1).save();
    await new User(user2).save();
    await new Task(task1).save();
    await new Task(task2).save();
    await new Task(task3).save();
}

module.exports = {
    userId1,
    userId2,
    user1,
    user2,
    task1,
    task2,
    task3,
    populateDb
}
