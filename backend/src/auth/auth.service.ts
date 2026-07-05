import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  async login(data: any) {
    const user = await this.userService.findByEmail(
      data.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    if (user.role !== data.role) {
      throw new UnauthorizedException(
        'Selected role does not match this account',
      );
    }

    const isMatch = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token =
      await this.jwtService.signAsync(payload);

    const { password, ...userData } = user;

    return {
      message: 'Login successful',

      access_token: token,

      user: userData,
    };
  }

  async register(data: any) {
    return this.userService.register(data);
  }
}