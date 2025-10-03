import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }
  
  async listUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return users.map(u => ({
      id: u.id,
      name: u.name,
    }));
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
      },
    });
  }
}
