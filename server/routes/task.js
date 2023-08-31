const router = require("express").Router();
const isAuthenticated = require("../middlewares/jwt.middleware");
const protectRoute = require("../middlewares/protectRoute");
const Task = require("../models/Task.model");

// GET  - get all tasks for a list
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const tasks = await Task.find({ list: req.params.listId });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /lists/:listId/tasks - create a new task for a list
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      todoList: req.body.todoList,
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
        todoList: req.body.todoList,
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
router.get('/tasks/:todoListId', isAuthenticated, async (req, res) => {
  try {
    const { todoListId } = req.params;

    const tasks = await Task.find({ todoList:todoListId });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
