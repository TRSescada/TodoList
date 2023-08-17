const router = require("express").Router();
const isAuthenticated = require("../middlewares/jwt.middleware");
const protectRoute = require("../middlewares/protectRoute");
const Task = require("../models/Task.model");

// GET  - get all tasks for a list
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const tasks = await Task.find({ list: req.params.listId });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /lists/:listId/tasks - create a new task for a list
router.post("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      list: req.params.listId,
    });
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:taskId - get a single task
router.get("/:taskId", isAuthenticated, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:taskId - update a single task
router.put("/:taskId", isAuthenticated, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
      },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:taskId - delete a single task
router.delete("/:taskId", isAuthenticated, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
