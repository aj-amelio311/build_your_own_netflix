import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateaccountService {

  private _url:string = environment.appUrl + "/create_account/";
  constructor(
    private _http:Http
  ) { }

  addAccount(formData:string) {
    return this._http.post(this._url, JSON.parse(formData));
  }
}
