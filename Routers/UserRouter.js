const express = require('express');
const { auth } = require("../middlewares/auth");
const {registerUser, login } = require('../Controllers/authController');
const {allTask, newTask,getTask,updateTask,deleteTask } = require('../Controllers/taskController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/tasks',auth,allTask)
router.post('/tasks',auth,newTask)
router.get('/tasks/:id',auth,getTask)
router.put('/tasks/:id',auth,updateTask)
router.delete('/tasks/:id',auth,deleteTask)


module.exports = router;
