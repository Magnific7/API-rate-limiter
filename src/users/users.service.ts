import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findByUsername(username: string): Promise<Users | undefined> {
    return this.usersRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username })
      .getOne();
  }

  async createUser(user: RegisterDto): Promise<Users> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: user.username },
    });
    if (existingUser) {
      throw new Error('User with the specified username already exists.');
    }
    return (await this.usersRepository.insert(user)).raw;
  }
}
