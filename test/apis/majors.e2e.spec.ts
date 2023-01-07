import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import path from 'path';
import request from 'supertest';
import { setTestingApp } from '../utils/setTestingApp';

describe('MajorsController (e2e)', () => {
  const basicPath = '/api/majors';
  let majorId: number;
  let stringMajorId: string;
  let mainSkillId: number;
  let stringMainSkillId: string;
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await setTestingApp();

    prismaService = app.get<PrismaService>(PrismaService);

    const major: Pick<MajorEntity, 'id'> = (await prismaService.major.findFirst(
      {
        select: {
          id: true,
        },
      },
    )) as Pick<MajorEntity, 'id'>;

    const mainSkill: Pick<MajorSkillEntity, 'id'> =
      (await prismaService.mainSkill.findFirst({
        select: {
          id: true,
        },
      })) as Pick<MajorSkillEntity, 'id'>;

    majorId = major.id;
    mainSkillId = mainSkill.id;
    stringMajorId = String(majorId);
    stringMainSkillId = String(mainSkillId);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GET - /api/majors', () => {
    it('mainSkill 이 없을 때', () => {
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
            expect(major).not.toHaveProperty('mainSkills');
          });
        });
    });

    it('mainSkill 이 false', () => {
      return request(app.getHttpServer())
        .get(basicPath)
        .query({ mainSkills: false })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.majors.forEach((major) => {
            expect(major).toHaveProperty('id');
            expect(typeof major.id).toBe('number');
            expect(major).toHaveProperty('name');
            expect(typeof major.name).toBe('string');
            expect(major).toHaveProperty('createdAt');
            expect(typeof major.createdAt).toBe('string');
            expect(major).not.toHaveProperty('mainSkills');
          });
        });
    });

    it('mainSkill 이 true', () => {
      return request(app.getHttpServer())
        .get(basicPath)
        .query({ mainSkills: true })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.majors.forEach((major: MajorEntity) => {
            expect(major).toHaveProperty('id');
            expect(typeof major.id).toBe('number');
            expect(major).toHaveProperty('name');
            expect(typeof major.name).toBe('string');
            expect(major).toHaveProperty('createdAt');
            expect(typeof major.createdAt).toBe('string');
            expect(major).toHaveProperty('mainSkills');
            major.majorSkills?.forEach((mainSkill) => {
              expect(mainSkill).toHaveProperty('id');
              expect(typeof mainSkill.id).toBe('number');
              expect(mainSkill).toHaveProperty('majorId');
              expect(typeof mainSkill.majorId).toBe('number');
              expect(mainSkill.majorId).toBe(major.id);
              expect(mainSkill).toHaveProperty('name');
              expect(typeof mainSkill.name).toBe('string');
              expect(mainSkill).toHaveProperty('createdAt');
              expect(typeof mainSkill.createdAt).toBe('string');
              expect(mainSkill).not.toHaveProperty('mainSkills');
            });
          });
        });
    });
  });

  describe('GET - /api/majors/:majorId', () => {
    it('mainSkill 이 없을 때', () => {
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

    it('mainSkill 이 false 일 때', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId))
        .query({ mainSkills: false })
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

    it('mainSkill 이 true 일 때', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId))
        .query({ mainSkills: true })
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          const major = res.body.major;
          expect(major).toHaveProperty('id');
          expect(typeof major.id).toBe('number');
          expect(major).toHaveProperty('name');
          expect(typeof major.name).toBe('string');
          expect(major).toHaveProperty('createdAt');
          expect(typeof major.createdAt).toBe('string');
          expect(major).toHaveProperty('mainSkills');
          major.mainSkills.forEach((mainSkill) => {
            expect(mainSkill).toHaveProperty('id');
            expect(typeof mainSkill.id).toBe('number');
            expect(mainSkill).toHaveProperty('majorId');
            expect(typeof mainSkill.majorId).toBe('number');
            expect(mainSkill.majorId).toBe(major.id);
            expect(mainSkill).toHaveProperty('name');
            expect(typeof mainSkill.name).toBe('string');
            expect(mainSkill).toHaveProperty('createdAt');
            expect(typeof mainSkill.createdAt).toBe('string');
            expect(mainSkill).not.toHaveProperty('mainSkills');
          });
        });
    });
  });

  describe('GET - /api/majors/:majorId/mainSkills', () => {
    it('majors 조회', () => {
      return request(app.getHttpServer())
        .get(path.join(basicPath, stringMajorId, 'mainSkills'))
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          res.body.mainSkills.forEach((mainSkill) => {
            expect(mainSkill).toHaveProperty('id');
            expect(typeof mainSkill.id).toBe('number');
            expect(mainSkill).toHaveProperty('majorId');
            expect(typeof mainSkill.majorId).toBe('number');
            expect(mainSkill.majorId).toBe(majorId);
            expect(mainSkill).toHaveProperty('name');
            expect(typeof mainSkill.name).toBe('string');
            expect(mainSkill).toHaveProperty('createdAt');
            expect(typeof mainSkill.createdAt).toBe('string');
            expect(mainSkill).not.toHaveProperty('mainSkills');
          });
        });
    });
  });

  describe('GET - /api/majors/:majorId/mainSkills/:mainSkillId', () => {
    it('major 조회', () => {
      return request(app.getHttpServer())
        .get(
          path.join(basicPath, stringMajorId, 'mainSkills', stringMainSkillId),
        )
        .then((res) => {
          expect(res.status).toBe(HttpStatus.OK);
          const mainSkill = res.body.mainSkill;
          expect(mainSkill).toHaveProperty('id');
          expect(typeof mainSkill.id).toBe('number');
          expect(mainSkill).toHaveProperty('majorId');
          expect(typeof mainSkill.majorId).toBe('number');
          expect(mainSkill.majorId).toBe(majorId);
          expect(mainSkill).toHaveProperty('name');
          expect(typeof mainSkill.name).toBe('string');
          expect(mainSkill).toHaveProperty('createdAt');
          expect(typeof mainSkill.createdAt).toBe('string');
          expect(mainSkill).not.toHaveProperty('mainSkills');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
