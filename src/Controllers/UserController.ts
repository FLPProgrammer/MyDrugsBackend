import { Request, Response } from 'express';
import { UserService } from '../Services/UserServices';
import { createUserSchema, loginUserSchema } from '../Schemas/userSchema';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);
      const result = await userService.register(data);
      res.status(201).json(result); 
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = loginUserSchema.parse(req.body);
      const result = await userService.login(data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
