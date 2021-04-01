const express = require('express');
const router = new express.Router();

const Task = require('../models/task');
const checkIfFieldsValid = require('../utils/shared');


router.post('', async (req, res, next) => {
    const task = new Task(req.body);
    try {
        await task.save()
        res.status(201).json({
            message: 'New task saved successfully.'
        })
    } catch (e) {
        res.status(400)
            .json({
                message: err.message
            })
    }
});

router.get('', async (req, res, next) => {
    try {
        const tasks = await Task.find()
        res.status(200).json({
            tasks
        })
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
        if (task) {
            return res.status(200).json({
                task
            })
        }
        res.status(404).json({
            message: 'No task was found for that id.'
        })
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
});

router.patch('/:id', async (req, res, next) => {
    const allowedUpdates = ['description', 'completed'];
    const reqUpdateFields = Object.keys(req.body);
    checkIfFieldsValid(reqUpdateFields, allowedUpdates, res);
    try {
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        const newTask = await Task.findById(req.params.id);

        reqUpdateFields.forEach(updateField => newTask[updateField] = req.body[updateField]);

        await newTask.save();

        if (!newTask) {
            return res.status(404).json({
                message: 'No task was found with that id!'
            })
        }
        res.status(201).json({
            newTask
        })
    } catch ({message}) {
        res.status(400).json({
            message
        })
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                message: 'No task was found with that id!'
            })
        }
        res.status(201).json({
            deletedTask,
            message: 'Task deleted successfully.'
        })

    } catch ({message}) {
        res.status(400).json({
            message
        })
    }
});

module.exports = router;
