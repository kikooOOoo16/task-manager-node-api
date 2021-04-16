const express = require('express');
const router = new express.Router();
const auth = require('../middleware/middleware');

const Task = require('../models/task');
const checkIfFieldsValid = require('../utils/shared');


// POST single task
router.post('', auth, async (req, res, next) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save()
        res.status(201).json({
            task,
            message: 'New task saved successfully.'
        })
    } catch ({message}) {
        res.status(400)
            .json({
                message
            })
    }
});

// GET all tasks
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc

router.get('', auth, async (req, res, next) => {
    try {
        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.sortBy) {
            if (Array.isArray(req.query.sortBy)) {
                req.query.sortBy.forEach(sortQuery => {
                    const parts = sortQuery.split(':');
                    sort[parts[0]] = parts[1] === 'asc'? 1 : -1;
                })
            } else {
                const parts = req.query.sortBy.split(':');
                sort[parts[0]] = parts[1] === 'asc'? 1 : -1;
            }
        }

        // const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                // if no req.query.limit mongoose ignores the limit prop
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).json({
            tasks: req.user.tasks
        })
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
});

// GET single task
router.get('/:id', auth, async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (task) {
            return res.status(200).json({
                task
            })
        }
        res.status(404).json({
            task,
            message: 'No task was found.'
        });
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
});

// PATCH single task
router.patch('/:id', auth, async (req, res, next) => {
    const allowedUpdates = ['description', 'completed'];
    const reqUpdateFields = Object.keys(req.body);
    try {
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        await checkIfFieldsValid(reqUpdateFields, allowedUpdates, res);

        const newTask = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!newTask) {
            return res.status(404).json({
                message: 'No task was found!'
            })
        }

        reqUpdateFields.forEach(updateField =>
            newTask[updateField] = req.body[updateField]
        );
        await newTask.save();

        res.status(201).json({
            newTask
        })
    } catch ({message}) {
        res.status(400).json({
            message
        })
    }
});

// DELETE single task
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const deletedTask = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!deletedTask) {
            return res.status(404).json({
                message: 'No task was found!'
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
