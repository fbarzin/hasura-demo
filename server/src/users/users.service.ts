import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { gql } from 'graphql-request';
import { HasuraClient } from '../hasura.client';
import { UserModel } from './user.model';
import * as axios from 'axios';

export type UserRole = 'user' | 'admin';

@Injectable()
export class UsersService {
  constructor(private readonly hasuraClient: HasuraClient) {}

  async registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<string> {
    // Create the user in Hasura
    const userModel = await this.createHasuraUser(firstName, lastName, email);

    // Create the user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      uid: userModel.id,
    });

    // Set the custom claims on the user
    await this.setCustomClaims(userRecord.uid, 'user');

    // Generate a custom token for the user
    const token = await this.generateUserTokenId(userRecord.uid);

    return token;
  }

  async loginWithPassword(email: string, password: string) {
    const reponse = await axios.default.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        process.env.FIREBASE_WEB_API_KEY,
      { email, password, returnSecureToken: true },
    );

    return reponse.data.idToken;
  }

  private async createHasuraUser(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<UserModel> {
    const MUTATION = gql`
      mutation createUser(
        $email: String!
        $firstName: String!
        $lastName: String!
      ) {
        appDbUserInsertOne(
          object: { firstName: $firstName, email: $email, lastName: $lastName }
        ) {
          lastName
          id
          firstName
          email
          createdAt
          updatedAt
        }
      }
    `;

    const { appDbUserInsertOne } = await this.hasuraClient.requestAsAdmin(
      MUTATION,
      { email, firstName, lastName },
    );

    return UserModel.fromJson(appDbUserInsertOne);
  }

  private setCustomClaims(userId: string, userRole: UserRole) {
    return admin
      .auth()
      .setCustomUserClaims(userId, this.buildClaims(userId, userRole));
  }

  private buildClaims(userId: string, userRole: UserRole) {
    return {
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': [userRole],
        'x-hasura-default-role': userRole,
        'x-hasura-user-id': userId,
      },
    };
  }

  private async generateCustomToken(uid: string): Promise<string> {
    return await admin.auth().createCustomToken(uid);
  }

  private async generateUserTokenId(firebaseUid: string) {
    const customToken = await this.generateCustomToken(firebaseUid);

    const reponse = await axios.default.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' +
        process.env.FIREBASE_WEB_API_KEY,
      { token: customToken, returnSecureToken: true },
    );

    return reponse.data.idToken;
  }
}
