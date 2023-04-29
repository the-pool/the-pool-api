import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorDto } from '@src/modules/major/dtos/major.dto';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import path from 'path';
import request from 'supertest';
import { setTestingApp } from '../utils/setTestingApp';

describe('MajorsController (e2e)', () => {
  const basicPath = '/api/majors';
  let majorId: number;
  let stringMajorId: string;
  let majorSkillId: number;
  let stringMainSkillId: string;
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await setTestingApp();

    prismaService = app.get<PrismaService>(PrismaService);

    const major: Pick<MajorDto, 'id'> = (await prismaService.major.findFirst({
      select: {
        id: true,
      },
    })) as Pick<MajorDto, 'id'>;

    const majorSkill: Pick<MajorSkillEntity, 'id'> =
      (await prismaService.majorSkill.findFirst({
        select: {
          id: true,
        },
      })) as Pick<MajorSkillEntity, 'id'>;

    majorId = major.id;
    majorSkillId = majorSkill.id;
    stringMajorId = String(majorId);
    stringMainSkillId = String(majorSkillId);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GET - /api/majors', () => {
    it('majorSkill 이 없을 때', () => {
      return request(app.getHttpServer())
        .get(basicPath)
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.majors.forEach((major) => {
            expect(major).toHaveProperty('id');
            expect(typeof major.id).toBe('number');
            expect(major).toHaveProperty('name');
            expect(typeof major.name).toBe('string');
            expect(major).toHaveProperty('createdAt');
            expect(typeof major.createdAt).toBe('string');
            expect(major).not.toHaveProperty('majorSkills');
          });
        });
    });

    it('majorSkill 이 false', () => {
      return request(app.getHttpServer())
        .get(basicPath)
        .query({ majorSkills: false })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.majors.forEach((major) => {
            expect(major).toHaveProperty('id');
            expect(typeof major.id).toBe('number');
            expect(major).toHaveProperty('name');
            expect(typeof major.name).toBe('string');
            expect(major).toHaveProperty('createdAt');
            expect(typeof major.createdAt).toBe('string');
            expect(major).not.toHaveProperty('majorSkills');
          });
        });
    });

    it('majorSkill 이 true', () => {
      return request(app.getHttpServer())
        .get(basicPath)
        .query({ majorSkills: true })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.majors.forEach((major: MajorDto) => {
            expect(major).toHaveProperty('id');
            expect(typeof major.id).toBe('number');
            expect(major).toHaveProperty('name');
            expect(typeof major.name).toBe('string');
            expect(major).toHaveProperty('createdAt');
            expect(typeof major.createdAt).toBe('string');
            expect(major).toHaveProperty('majorSkills');
            major.majorSkills?.forEach((majorSkill) => {
              expect(majorSkill).toHaveProperty('id');
              expect(typeof majorSkill.id).toBe('number');
              expect(majorSkill).toHaveProperty('majorId');
              expect(typeof majorSkill.majorId).toBe('number');
              expect(majorSkill.majorId).toBe(major.id);
              expect(majorSkill).toHaveProperty('name');
              expect(typeof majorSkill.name).toBe('string');
              expect(majorSkill).toHaveProperty('createdAt');
              expect(typeof majorSkill.createdAt).toBe('string');
              expect(majorSkill).not.toHaveProperty('majorSkills');
            });
          });
        });
    });
  });

  describe('GET - /api/majors/:majorId', () => {
    it('majorSkill 이 없을 때', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId))
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          const major = res.body.major;
          expect(major).toHaveProperty('id');
          expect(typeof major.id).toBe('number');
          expect(major).toHaveProperty('name');
          expect(typeof major.name).toBe('string');
          expect(major).toHaveProperty('createdAt');
          expect(typeof major.createdAt).toBe('string');
        });
    });

    it('majorSkill 이 false 일 때', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId))
        .query({ majorSkills: false })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          const major = res.body.major;
          expect(major).toHaveProperty('id');
          expect(typeof major.id).toBe('number');
          expect(major).toHaveProperty('name');
          expect(typeof major.name).toBe('string');
          expect(major).toHaveProperty('createdAt');
          expect(typeof major.createdAt).toBe('string');
        });
    });

    it('majorSkill 이 true 일 때', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId))
        .query({ majorSkills: true })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          const major = res.body.major;
          expect(major).toHaveProperty('id');
          expect(typeof major.id).toBe('number');
          expect(major).toHaveProperty('name');
          expect(typeof major.name).toBe('string');
          expect(major).toHaveProperty('createdAt');
          expect(typeof major.createdAt).toBe('string');
          expect(major).toHaveProperty('majorSkills');
          major.majorSkills.forEach((majorSkill) => {
            expect(majorSkill).toHaveProperty('id');
            expect(typeof majorSkill.id).toBe('number');
            expect(majorSkill).toHaveProperty('majorId');
            expect(typeof majorSkill.majorId).toBe('number');
            expect(majorSkill.majorId).toBe(major.id);
            expect(majorSkill).toHaveProperty('name');
            expect(typeof majorSkill.name).toBe('string');
            expect(majorSkill).toHaveProperty('createdAt');
            expect(typeof majorSkill.createdAt).toBe('string');
            expect(majorSkill).not.toHaveProperty('majorSkills');
          });
        });
    });
  });

  describe('GET - /api/majors/:majorId/majorSkills', () => {
    it('majors 조회', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId, 'majorSkills'))
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.majorSkills.forEach((majorSkill) => {
            expect(majorSkill).toHaveProperty('id');
            expect(typeof majorSkill.id).toBe('number');
            expect(majorSkill).toHaveProperty('majorId');
            expect(typeof majorSkill.majorId).toBe('number');
            expect(majorSkill.majorId).toBe(majorId);
            expect(majorSkill).toHaveProperty('name');
            expect(typeof majorSkill.name).toBe('string');
            expect(majorSkill).toHaveProperty('createdAt');
            expect(typeof majorSkill.createdAt).toBe('string');
            expect(majorSkill).not.toHaveProperty('majorSkills');
          });
        });
    });
  });

  describe('GET - /api/majors/:majorId/majorSkills/:majorSkillId', () => {
    it('major 조회', () => {
      return request(app.getHttpServer())
        .get(
          path.join(basicPath, stringMajorId, 'majorSkills', stringMainSkillId),
        )
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          const majorSkill = res.body.majorSkill;
          expect(majorSkill).toHaveProperty('id');
          expect(typeof majorSkill.id).toBe('number');
          expect(majorSkill).toHaveProperty('majorId');
          expect(typeof majorSkill.majorId).toBe('number');
          expect(majorSkill.majorId).toBe(majorId);
          expect(majorSkill).toHaveProperty('name');
          expect(typeof majorSkill.name).toBe('string');
          expect(majorSkill).toHaveProperty('createdAt');
          expect(typeof majorSkill.createdAt).toBe('string');
          expect(majorSkill).not.toHaveProperty('majorSkills');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
