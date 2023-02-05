import Mock = jest.Mock;
import { mockContext } from './mock-libs';

export type MockClassType<T> = { [key in keyof T]: Mock };

export type MockGuardType = {
  canActivate: (context: typeof mockContext) => boolean;
};
