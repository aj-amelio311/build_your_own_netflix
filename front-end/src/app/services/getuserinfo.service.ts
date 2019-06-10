import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetuserinfoService {
  private _url:string = environment.appUrl + "/get_profile/";
  constructor(private _http:Http) { }

  getProfile(userId:string) {
      return this._http.get(this._url + userId)
  }
}
