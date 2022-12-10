import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as admin from 'firebase-admin';
import { HasuraClient } from './hasura.client';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from './users/users.service';
import { GraphQLClient } from 'graphql-request';
import { ConfigModule } from '@nestjs/config';

export const graphqlClientProvider = {
  provide: 'graphql',
  useFactory: () => {
    return new GraphQLClient('http://localhost:8080/v1/graphql');
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersResolver,
    UsersService,
    HasuraClient,
    graphqlClientProvider,
  ],
})
export class AppModule {
  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    admin.initializeApp({
      credential: admin.credential.cert(
        './config/hasura-demo-f3d73-firebase-adminsdk-oprwd-502251c765.json',
      ),
    });
  }
}
