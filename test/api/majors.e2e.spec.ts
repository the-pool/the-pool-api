import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setTestingApp } from '../utils/setTestingApp';

describe('MajorsController (e2e)', () => {
  const path = '/api/majors';
  let app: INestApplication;

  beforeAll(async () => {
    app = await setTestingApp();

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/api/majors - (GET)', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer()).get(path);
    });

    it('status 체크', () => {
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
