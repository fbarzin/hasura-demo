import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterUserOutput {
  @Field()
  token: string;
}
