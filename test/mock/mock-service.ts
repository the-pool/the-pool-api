import { MajorService } from '@src/modules/major/services/major.service';
import Mock = jest.Mock;

type mockServiceType<S> = { [key in keyof S]: Mock };

export const mockMajorService: mockServiceType<MajorService> = {
  findMajors: jest.fn(),
  findMajor: jest.fn(),
  findMainSkills: jest.fn(),
  findMainSkill: jest.fn(),
};
