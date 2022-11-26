import { HttpStatus, INestApplication } from '@nestjs/common';
import { MajorText } from '@src/constants/enum';
import { MajorsDto } from '@src/modules/major/dto/majors.dto';
import { MajorModule } from '@src/modules/major/major.module';
import request from 'supertest';
import { buildTestingApp } from '../utils/buildTestingApp';

describe('MajorsController (e2e)', () => {
  const path = '/api/majors';
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildTestingApp(MajorModule);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/api/majors - (GET)', async () => {
    const response = await request(app.getHttpServer()).get(path);

    it('status 체크', () => {
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('body 체크', () => {
      const { majors }: MajorsDto = response.body;

      expect(majors).toBeInstanceOf(MajorsDto);

      it.each(majors)('major 객체 테스트', (major) => {
        expect(MajorText[major.name]).toBeDefined();
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
