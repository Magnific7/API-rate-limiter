import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto-js';
import { Users } from 'src/users/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Users> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === crypto.SHA1(password).toString()) {
      return user;
    }
    return null;
  }

  async login(data: LoginDto) {
    try {
      const user = await this.validateUser(data.username, data.password);
      return {
        access_token: this.jwtService.sign({
          username: user.username,
          limit: user.limit,
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async register(user: RegisterDto) {
    const payload = { username: user.username };
    user = {
      ...user,
      password: crypto.SHA1(user.password).toString(),
    };
    try {
      const userRow = await this.usersService.createUser(user);
      return {
        access_token: this.jwtService.sign({
          username: userRow.username,
          limit: userRow.limit,
        }),
      };
    } catch (e) {
      throw e;
    }
  }
}
