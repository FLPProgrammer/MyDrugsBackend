import { UserRepository } from '../Repositories/UserRepository';
import { CreateUserDTO, LoginDTO } from '../Schemas/userSchema';
import bcrypt from 'bcryptjs';
import { generateToken } from '../Utils/generateToken';
import { randomUUID } from 'crypto';

export class UserService {
  private repo = new UserRepository();

  async register(data: CreateUserDTO) {
   
    const existing = await this.repo.findUserByEmail(data.email);
    if (existing) throw new Error('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 8);

    const newUser = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
    };

    await this.repo.save(newUser);
    return { message: 'Usuário cadastrado com sucesso' };
  }

  async login(data: LoginDTO) {

    const user = await this.repo.findUserByEmail(data.email);
    if (!user) throw new Error('Email ou senha inválidos');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new Error('Email ou senha inválidos');

    const token = generateToken({ id: user.id });
    return { token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,}
    };
  }
}
