
const User = require('../models/UserModel');
const Joi = require('joi');
const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid('pending', 'in-progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    due_date: Joi.date().iso()
});
exports.newTask=async (req, res) => {
    try {
        const { error } = taskSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { title, description, status, priority, due_date } = req.body;
        const user = await User.findById(req.user);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const newTask = {
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            due_date: due_date ? new Date(due_date) : null,
        };

        user.tasks.push(newTask);
        await user.save();
        res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.allTask =  async (req, res) => {
    try {
    
        const user = await User.findById(req.user);
        if (!user) return res.status(400).json({ error: 'User not found' });
  
        res.status(200).json(user.tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
  }

exports.getTask= async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ error: 'User not found' });
       
        const task = user.tasks.id(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.updateTask=async (req, res) => {
    try {
        const { error } = taskSchema.validate(req.body, { allowUnknown: true });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const task = user.tasks.id(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const { title, description, status, priority, due_date } = req.body;

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (due_date) task.due_date = new Date(due_date);

        await user.save();
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
exports.deleteTask=async (req, res) => {
    try {
     const taskId=req.params.id
      const updatedUser = await User.findOneAndUpdate(
        { _id:req.user  },
        { $pull: { tasks: { _id:taskId } } },
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User or task not found' });
      }
  
      
      await updatedUser.save();
  
      
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  