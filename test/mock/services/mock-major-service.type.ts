import { MajorService } from '@src/modules/major/services/major.service';
import Mock = jest.Mock;

export type MockMajorService = { [key in keyof MajorService]: Mock };
