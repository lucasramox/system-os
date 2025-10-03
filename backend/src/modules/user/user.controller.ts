import { Controller, Post, Body, HttpException, HttpStatus, Get, Param } from '@nestjs/common';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUsersDto } from './dtos/create-user.dto';
import { Public } from 'src/comon/decorators/public.decorator';


@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @Public()
  @ApiBody({ type: RegisterUsersDto })
  async register(@Body() body: RegisterUsersDto) {
    try {
      return await this.userService.createUser(body.email, body.name, body.password);
    } catch (error) {
      if (error.code === 'P2002') {

        throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
      }
      throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list')
  async listUsers() {
    return this.userService.listUsers();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(Number(id));
  }
}
