

const User = require('../models/UserModel');


const {newTask,allTask,getTask,updateTask,deleteTask}=require('../Controllers/taskController')
const jwt = require('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../models/UserModel');
jest.mock('../genAuthToken');
jest.mock('jsonwebtoken');


describe('newTask', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                title: 'Test Task',
                description: 'Test Description',
                status: 'pending',
                priority: 'medium',
                due_date: '2024-12-31'
            },
            user: 'userId'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should add a task successfully', async () => {
  
        const mockUser = {
            _id: 'userId',
            tasks: [],
            save: jest.fn()
        };
        User.findById.mockResolvedValue(mockUser);
      
        jwt.verify.mockReturnValue({ _id: 'userId' });

     
        await newTask(req, res, next);



        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(mockUser.tasks).toHaveLength(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Task added successfully',
            task: expect.objectContaining({
                title: 'Test Task',
                description: 'Test Description',
                status: 'pending',
                priority: 'medium',
                due_date: new Date('2024-12-31')
            })
        });
    });
});

describe('allTask', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: 'userId'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should get all tasks successfully', async () => {
      
        const mockTasks = [
            { title: 'Task 1', description: 'Description 1' },
            { title: 'Task 2', description: 'Description 2' }
        ];
        const mockUser = {
            _id: 'userId',
            tasks: mockTasks
        };
        User.findById.mockResolvedValue(mockUser);

       
        await allTask(req, res, next);

        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser.tasks);
    });
});

describe('getTask', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: 'userId',
            params: {
                id: 'taskId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should get a task successfully', async () => {
        
        const mockTask = { _id: 'taskId', title: 'Test Task', description: 'Test Description' };
        const mockUser = {
            _id: 'userId',
            tasks: {
                id: jest.fn().mockReturnValue(mockTask)
            }
        };
        User.findById.mockResolvedValue(mockUser);

        
        await getTask(req, res, next);

      
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(mockUser.tasks.id).toHaveBeenCalledWith('taskId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockTask);
    });
});

describe('updateTask', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: 'userId',
            params: {
                id: 'taskId'
            },
            body: {
                title: 'Updated Task',
                description: 'Updated Description',
                status: 'completed',
                priority: 'high',
                due_date: '2024-12-31'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should update a task successfully', async () => {
     
        const mockTask = { _id: 'taskId', title: 'Test Task', description: 'Test Description', status: 'pending', priority: 'medium', due_date: new Date('2024-06-30') };
        const mockUser = {
            _id: 'userId',
            tasks: {
                id: jest.fn().mockReturnValue(mockTask)
            },
            save: jest.fn()
        };
        User.findById.mockResolvedValue(mockUser);


        
        await updateTask(req, res, next);

      
  
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(mockUser.tasks.id).toHaveBeenCalledWith('taskId');
        expect(mockTask.title).toBe('Updated Task');
        expect(mockTask.description).toBe('Updated Description');
        expect(mockTask.status).toBe('completed');
        expect(mockTask.priority).toBe('high');
        expect(mockTask.due_date).toEqual(new Date('2024-12-31'));
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Task updated successfully' });
    });
});

describe('deleteTask', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: 'userId',
            params: {
                id: 'taskId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should delete a task successfully', async () => {
  
        const mockUser = {
            _id: 'userId',
            tasks: [{ _id: 'taskId', title: 'Test Task' }],
            save: jest.fn()
        };
        User.findOneAndUpdate.mockResolvedValue(mockUser);

   
        await deleteTask(req, res, next);

      
        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'userId' },
            { $pull: { tasks: { _id: 'taskId' } } },
            { new: true }
        );
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });
});