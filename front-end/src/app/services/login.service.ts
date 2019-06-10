import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _url:string = environment.appUrl + "/login";
  constructor(private _http:Http) { }

  login(formData:string) {
    return this._http.post(this._url, JSON.parse(formData));
  }

}
