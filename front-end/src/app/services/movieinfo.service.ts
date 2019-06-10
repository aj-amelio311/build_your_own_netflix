import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieinfoService {
  private _url:string = environment.appUrl + "/get_movie/";
  constructor(private _http:Http) { }



  getMovieInfo(title:string, userId:string) {
    return this._http.get(this._url + title + "/" + userId);
  }
}
