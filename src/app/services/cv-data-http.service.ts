import {inject, Injectable} from "@angular/core";
import {ErrorService} from "./error.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {CvData} from "../domain/cv-data";
import {catchError, Observable, tap} from "rxjs";
import {BaseService} from "./base-service";
import {ApiConfiguration} from "./api-configuration";
import {Page, SearchCriteria} from "../util/search-criteria";


@Injectable({providedIn: 'root'})
export class CvDataHttpService extends BaseService {

  errorService = inject(ErrorService);
  url: string;

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
    this.url = this.rootUrl + '/documents';
  }


  createCvData(cvData: CvData): Observable<void> {

    const headers = new HttpHeaders().set('captcha-response', cvData.captchaResponse);

    const url = this.url;
    console.log('(http request) create CvData', cvData);
    console.log('(http request) create CvData headers', headers);
    let formData = new FormData();
    if (cvData.content) {
      formData.append('file', cvData.content);
      cvData.content = null;
    }
    formData.append('payload', new Blob([JSON.stringify(cvData)], {
      type: 'application/json'
    }));
    return this.http.post<void>(url, formData, {headers: headers}).pipe(
      tap((response) => console.log('(http response) create CvData', response)),
      catchError((err) => {
        console.log("(http error) create CvData", err);
        return this.errorService.handleError(err);
      }),
    );
  }

  searchCVData(criteria: SearchCriteria): Observable<Page<CvData>> {
    const url = this.url;
    console.log('(http request) searchCVData URL ---' + url + ', by criteria', criteria);
    // @ts-ignore
    return this.http
      .get<Page<CvData>>(url, {
        params: new HttpParams().set("page", String(criteria.page)).set("size", String(criteria.size)).set("sort", String(criteria.sort))
      })
      .pipe(
        tap((res) => console.log('(http response) searchCVData', res)),
        catchError((err) => {
          console.log("(http error) searchCVData", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  downloadReport(id: number,reportName: string) {
    const url = this.url + '/download/' + id;
    this.http
      .get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/pdf',
        }),
        responseType: 'blob',
      })
      .pipe(catchError((err) => this.errorService.handleError(err)))
      .subscribe((response) => this.downLoadFile(response, reportName));
  }

  downLoadFile(response: Blob, reportName: string) {
    const file = new Blob([response], {type: 'application/pdf'});
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = reportName;
    link.click();
    link.remove();
  }
}
