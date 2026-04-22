import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  // ✅ REGISTER
  @Post('register')
  register(@Body() body) {
    return this.userService.register(body);
  }

  // ✅ LOGIN
  @Post('login')
  login(@Body() body) {
    return this.userService.login(body);
  }
}