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
    // 🔴 basic validation
    if (data.password.length < 6) {
      return { message: "Password must be at least 6 characters" };
    }

    const existingUser = await this.repo.findOne({
      where: [
        { email: data.email },
        { rollNo: data.rollNo },
        { studentId: data.studentId },
      ],
    });

    if (existingUser) {
      return { message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      name: data.name,
      rollNo: data.rollNo,
      studentId: data.studentId,
      email: data.email,
      password: hashedPassword,
    });

    return this.repo.save(user);
  }

  async login(data: any) {
    const user = await this.repo.findOne({
      where: { email: data.email },
    });

    if (!user) {
      return { message: "User not found" };
    }

    const isMatch = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isMatch) {
      return { message: "Invalid password" };
    }

    const { password, ...userData } = user;

    return {
      message: "Login successful",
      user: userData,
    };
  }
}