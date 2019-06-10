import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateinventoryService {
  private _url:string = environment.appUrl + "/update_inventory/";

  constructor(
    private _http:Http
  ) { }

  build(movieData:string) {
    return this._http.post(this._url, JSON.parse(movieData));
  }

}
