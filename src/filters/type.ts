export type ExceptionError = {
  error?: string;
  statusCode: number;
  message: any;
};

export type ResponseJson = {
  status: number;
  timestamp: string;
  errors: ResponseErrorItem[];
};

export type ResponseErrorItem = {
  message: string;
  errorStack?: any;
};
