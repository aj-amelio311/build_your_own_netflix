import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadinfoService {

  constructor(private _http:Http) { }

  getMovieInfo(movieUrl:string) {
    return this._http.get(movieUrl)
  }
}
