import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeywordqueueService {
  private _url:string = environment.appUrl + "/search_queue";

  constructor(
    private _http:Http
  ) { }

  search( movieTitle:string, userId:string) {
    return this._http.get(this._url + "/" + movieTitle + "/" + userId)
  }


}
