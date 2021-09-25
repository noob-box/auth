import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const authSignInPath = '/auth/signin';

  describe(authSignInPath, () => {
    it('POST - Empty body', () => {
      return request(app.getHttpServer()).post(authSignInPath).expect(HttpStatus.BAD_REQUEST);
    });

    it('POST - Non existing user body', () => {
      return request(app.getHttpServer())
        .post(authSignInPath)
        .send({
          formFields: [
            { id: 'email', value: 'test@example.com' },
            { id: 'password', value: 'password123' },
          ],
        })
        .expect(HttpStatus.OK)
        .expect('{"status":"WRONG_CREDENTIALS_ERROR"}');
    });
  });
});
