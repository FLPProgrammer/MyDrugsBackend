import { Router } from 'express';
import { UserController } from '../Controllers/UserController';

const userController = new UserController();
export const userRoutes = Router();

userRoutes.post('/register', (req, res) => userController.register(req, res));
userRoutes.post('/login', (req, res) => userController.login(req, res));
