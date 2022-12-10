import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.input';
import { RegisterUserOutput } from './register-user.output';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  private readonly logger = new Logger(UsersResolver.name);

  constructor(private usersService: UsersService) {}

  @Query(() => String)
  hello() {
    return 'Hello World!';
  }

  @Mutation(() => RegisterUserOutput)
  async registerUser(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    const { firstName, lastName, email, password } = registerUserInput;
    const token = await this.usersService.registerUser(
      firstName,
      lastName,
      email,
      password,
    );

    return { token };
  }

  @Mutation(() => RegisterUserOutput)
  async loginUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<RegisterUserOutput> {
    const token = await this.usersService.loginWithPassword(email, password);
    return { token };
  }
}
