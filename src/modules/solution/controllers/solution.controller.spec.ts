import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { SolutionController } from '@src/modules/solution/controllers/solution.controller';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { mockSolutionService } from '@test/mock/mock-services';

describe('SolutionController', () => {
  let solutionController: SolutionController;
  let solutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionController],
      providers: [
        {
          provide: SolutionService,
          useValue: mockSolutionService,
        },
      ],
    }).compile();

    solutionController = module.get<SolutionController>(SolutionController);
    solutionService = mockSolutionService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(solutionController).toBeDefined();
  });

  describe('Create Lesson Solution', () => {
    let createSolutionDto: CreateSolutionRequestBodyDto;
    let memberId: number;
    let solutionEntity: SolutionEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      createSolutionDto = {
        lessonId: faker.datatype.number(),
        description: faker.lorem.text(),
        relatedLink: faker.internet.url(),
      };
      solutionEntity = new SolutionEntity();
      solutionService.createSolution.mockReturnValue(solutionEntity);
    });

    it('SUCCESS - Create Solution', async () => {
      const result = await solutionController.createSolution(
        createSolutionDto,
        memberId,
      );

      expect(solutionService.createSolution).toBeCalledTimes(1);
      expect(result).toStrictEqual(solutionEntity);
    });
  });
});
