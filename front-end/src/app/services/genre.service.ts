import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private _url:string = environment.appUrl + "/genres/";
  constructor(
    private _http:Http
  ) { }

  search(userId:string, genreId:string) {
    console.log(this._url + userId + "/" + genreId)
    return this._http.get(this._url + userId + "/" + genreId)
  }

}
