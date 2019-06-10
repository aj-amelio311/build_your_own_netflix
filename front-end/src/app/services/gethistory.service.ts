import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GethistoryService {
  private _url:string = environment.appUrl + "/get_history/";
  constructor(private _http:Http) { }

  fetch(userId:string) {
    return this._http.get(this._url + userId);
  }
}
