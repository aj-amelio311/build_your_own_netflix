import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemovefromqueueService {
  private url:string = environment.appUrl + "/remove_from_queue";
  constructor(private _http:Http) { }

  remove(movieObject:string) {
    return this._http.post(this.url, JSON.parse(movieObject))
  }

}
