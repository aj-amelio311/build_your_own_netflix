import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RottenService {
  private _url:string = environment.rottenTomatoes + "/movie/"
  constructor(private _http:Http) { }

  getRating(movieTitle:string) {
    return this._http.get(this._url + movieTitle)
  }

}
