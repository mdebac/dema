import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ApiError} from "../domain/api-error";
import {GrowlMessage} from "../domain/growlMessage";

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}
  //private growlService: GrowlService
  public constructGrowlFromApiError(error: ApiError): void {
    let message: GrowlMessage;


    if (this.isAnApiErrorType(error)) {
      message = {
        summary: error.message,
        detail: `${error.status}
                        Request ID: ${error.requestId}
                        ${(error.subErrors || []).join(', ')}`,
        severity: 'warning',
        life: 10000,
      };

      switch (error.status) {
        case 'UNPROCESSABLE_ENTITY':
        case 'BAD_REQUEST':
        case 'NOT_FOUND':
        case 'CONFLICT':
          message.severity = 'warning';
          break;
        default:
          message.severity = 'danger';
      }
      console.error(error);
     /* console.error(
        `\nRequest: ${error.requestId}\nMessage: ${
          error.message
        }\nDetails: \n    -${(error.subErrors || [])
          .map(({ path, message }) => `${path}: ${message}`)
          .join('\n    -')}\n${
          error.debugMessage ? '\nDebug message:\n' : ''
        }`,
        error.debugMessage,
      );*/
    } else {
      message = {
        summary: 'Server unreachable',
        severity: 'danger',
      };
      console.error(error);
    }
  //  this.growlService.growl(message);
  }

  isAnApiErrorType(obj: any): obj is ApiError {
    return 'status' in obj && 'requestId' in obj && 'message' in obj;
  }

  handleError(error: HttpErrorResponse) {
    console.error('An backend error occured', error);

    if (error.status === 0) {
      console.error('An error occured', error.error);
    } else {
      console.error(
        'Backend error code' + error.status + ', body was',
        error.error,
      );
    }
    return throwError(() => error);
  }
}
