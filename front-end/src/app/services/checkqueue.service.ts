import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckqueueService {

  private _url:string = environment.appUrl + "/check_queue/";
  constructor(private _http:Http) { }

  checkMovie(movieTitle:string, userId:string) {
    return this._http.get(this._url + userId + "/" + movieTitle);
  }
}
