import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../comon/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/comon/decorators/public.decorator';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
