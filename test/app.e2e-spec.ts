// eslint-disable-next-line unicorn/prevent-abbreviations
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { containsJwtRegex } from './utils/regex';
import { UsersService } from '../src/users/users.service';
import { Role } from '@prisma/client';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userService = app.get(UsersService);
    await userService.create('test@example.com', 'UserPassword123$', 'Test User', Role.USER);
    await userService.create('admin@example.com', 'AdminPassword123$', 'Test Admin', Role.ADMIN);
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

        it('(POST) should return cookie given valid login body', async () => {
          const response = await request(app.getHttpServer())
            .post(authLoginPath)
            .send({ email: 'test@example.com', password: 'UserPassword123$' })
            .expect(HttpStatus.CREATED);

          const cookie = response.headers['set-cookie'][0];
          expect(cookie.startsWith('sAccessToken='));
          expect(cookie).toMatch(containsJwtRegex);
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
