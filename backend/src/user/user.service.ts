import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async register(data: any) {
    if (data.password.length < 6) {
      return { message: 'Password must be at least 6 characters' };
    }

    const existingUser = await this.repo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return { message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      name: data.name,
      rollNo: data.role === 'student' ? data.rollNo : null,
      studentId: data.role === 'student' ? data.studentId : null,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    return this.repo.save(user);
  }

  async login(data: any) {
    const user = await this.repo.findOne({
      where: { email: data.email },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    if (user.role !== data.role) {
      return {
        message:
          'Selected role does not match this account',
      };
    }

    const isMatch = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isMatch) {
      return { message: 'Invalid password' };
    }

    const { password, ...userData } = user;

    return {
      message: 'Login successful',
      user: userData,
    };
  }
}