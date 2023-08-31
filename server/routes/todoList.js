const router = require("express").Router();
const isAuthenticated = require("../middlewares/jwt.middleware");
const protectRoute = require("../middlewares/protectRoute");
const todoList = require("../models/todoList.model");
const User = require("../models/User.model");
const Task = require("../models/Task.model");

// CREATE a new todolist
router.post("/", isAuthenticated, async (req, res) => {
  const { title } = req.body;
  const user = await User.findById(req.payload.id);
  if (!user || !user._id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const newtodoList = new todoList({ title, user: user._id });
  newtodoList
    .save()
    .then((todoList) => res.status(201).json(todoList))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to create todo list' });
    });
});

//GET all todoList
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const populatedTodoLists = await todoList.find().populate("tasks");
    res.json(populatedTodoLists);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// READ a single todolist by ID
router.get("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  todoList
    .findById(id)
    .populate("tasks")
    .then((todoList) => res.json(todoList))
    .catch((error) => res.status(404).json({ error: "todoList not found" }));
});

// UPDATE a todolist by ID
router.put("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  todoList
    .findByIdAndUpdate(id, { title }, { new: true })
    .then((list) => res.json(list))
    .catch((error) => res.status(404).json({ error: "todoList not found" }));
});

// DELETE a todolist by ID
router.delete("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  todoList
    .findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => res.status(404).json({ error: "todoList not found" }));
});

router.get("/findByUserId/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const todoLists = await todoList.find({ user: id });

    const todoListsWithCompletion = await Promise.all(
      todoLists.map(async todoList => {
        const tasks = await Task.find({ todoList: todoList._id });
        const allTasksCompleted = tasks.every(task => task.completed);
        
        return {
          ...todoList.toObject(),
          tasks,
          allTasksCompleted,
        };
      })
    );

    res.json(todoListsWithCompletion);
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
