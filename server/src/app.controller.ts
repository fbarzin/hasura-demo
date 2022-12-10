import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Login
  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    const token = await this.usersService.loginWithPassword(email, password);
    return { token };
  }
}
