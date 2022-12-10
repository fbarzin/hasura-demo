import { Inject, Injectable, Logger } from '@nestjs/common';
import { GraphQLClient, Variables } from 'graphql-request';

@Injectable()
export class HasuraClient {
  private readonly logger = new Logger(HasuraClient.name);

  constructor(@Inject('graphql') private readonly client: GraphQLClient) {}

  async requestAsAdmin(query: string, variables?: Variables): Promise<any> {
    const headers: any = {
      ['x-hasura-admin-secret']: 'myadminsecretkey',
    };
    this.client.setHeaders(headers);
    try {
      return await this.client.request(query, variables);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
