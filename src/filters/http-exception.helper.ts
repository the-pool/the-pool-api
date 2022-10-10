import { ResponseErrorItem, ResponseJson } from '@src/filters/type';

/**
 * exception filter 들이 사용하는 메서드 및 멤버변수를 모아놓은 class
 * 각 exception filter 들은 이 클레스를 상속받아 사용함
 */
export class HttpExceptionHelper {
  buildResponseJson(status: number): ResponseJson {
    return {
      status,
      timestamp: new Date().toISOString(),
      errors: [],
    };
  }

  /**
   * 4xx 번 에러시에 내려줄 request body 의 에러
   */
  preProcessByClientError(message: string): ResponseErrorItem {
    return {
      message,
    };
  }

  /**
   * 5xx 번 에러시에 내려줄 request body 의 에러
   */
  preProcessByServerError(errorStack: any): ResponseErrorItem {
    return {
      message: '서버 에러',
      errorStack,
    };
  }
}
