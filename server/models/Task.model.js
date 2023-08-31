const { Schema, model } = require("mongoose");
//The task model would store information about each to-do item,
//such as the title, description, due date, status (completed or not),
//and any other relevant information.
//Note that this model has a reference to the user model,
//so that tasks can be associated with a specific user.
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false,
    },
    todoList: { type: Schema.Types.ObjectId, ref: "TodoList" , required : true},
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model("Task", taskSchema);
