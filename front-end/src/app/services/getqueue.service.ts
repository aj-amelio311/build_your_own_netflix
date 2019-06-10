import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetqueueService {
  private _url:string = environment.appUrl + "/get_queue/";
  constructor(private _http:Http) { }

  getQueue(userId:string) {
    return this._http.get(this._url + userId);
  }

}
