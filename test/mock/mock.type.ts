import Mock = jest.Mock;

export type MockClassType<T> = { [key in keyof T]: Mock };
