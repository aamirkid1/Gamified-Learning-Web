import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }
}