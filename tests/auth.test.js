const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/UserModel');
const genAuthToken = require('../genAuthToken');
const { registerSchema } = require('../validation');
const { registerUser, login } = require('../Controllers/authController');
const {newTask}=require('../Controllers/taskController')
const jwt = require('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../models/UserModel');
jest.mock('../genAuthToken');
jest.mock('jsonwebtoken');
jest.mock('../validation', () => ({
    registerSchema: {
        validate: jest.fn()
    }
}));

describe('registerUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should register a user successfully', async () => {
        registerSchema.validate.mockReturnValue({ error: null });
        User.findOne.mockResolvedValue(null);
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedPassword');
        const userMock = {
            save: jest.fn().mockResolvedValue({}),
            _id: 'userId',
            name: 'John Doe',
            email: 'test@example.com',
            password: 'hashedPassword'
        };
        User.mockImplementation(() => userMock);
        genAuthToken.mockReturnValue('token');

        await registerUser(req, res);

        
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
        expect(userMock.save).toHaveBeenCalled();
        expect(genAuthToken).toHaveBeenCalledWith(userMock);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ user: userMock });
    });
});

describe('login', () => {
    it('should return a token for a successful login', async () => {
        
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const user = {
            _id: 'userId',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword'
        };

        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);

        const token = 'mockedToken';
        jwt.sign.mockReturnValue(token);
        genAuthToken.mockImplementation(() => token);

       
        await login(req, res);

       
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(genAuthToken).toHaveBeenCalledWith(user);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token });
    });
});

