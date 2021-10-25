import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { jwtRegex } from './utils/regex';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('API', () => {
    describe('/', () => {
      it('(GET) should return NOT FOUND', () => {
        return request(app.getHttpServer()).post('/').expect(HttpStatus.NOT_FOUND);
      });
    });

    describe('/auth', () => {
      const authPath = '/auth';

      describe('/login', () => {
        const authLoginPath = `${authPath}/login`;

        it('(POST) should return UNAUTHORIZED given empty body', () => {
          return request(app.getHttpServer()).post(authLoginPath).expect(HttpStatus.UNAUTHORIZED);
        });

        it('(POST) should return OK given valid login body', async () => {
          const res = await request(app.getHttpServer())
            .post(authLoginPath)
            .send({ email: 'test@example.com', password: 'SecretPassword123' })
            .expect(HttpStatus.CREATED);
          expect(res.body.access_token).toMatch(jwtRegex);
        });
      });

      describe('/profile', () => {
        const authProfilePath = `${authPath}/profile`;

        it('(GET) should return UNAUTHORIZED when anonymous', () => {
          return request(app.getHttpServer()).get(authProfilePath).expect(HttpStatus.UNAUTHORIZED);
        });
      });
    });

    describe('/admin', () => {
      const adminPath = '/admin';

      describe('/users', () => {
        const adminUsersPath = `${adminPath}/users`;

        it('(GET) should return UNAUTHORIZED when anonmyous', () => {
          return request(app.getHttpServer()).get(adminUsersPath).expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('/user', () => {
        const adminUserPath = `${adminPath}/user`;

        it('(GET) should return UNAUTHORIZED when anonmyous', () => {
          return request(app.getHttpServer()).get(adminUserPath).expect(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });
});
