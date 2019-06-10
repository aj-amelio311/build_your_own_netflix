import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddtoqueueService {
  private url:string = environment.appUrl + "/add_to_queue";
  constructor(private _http:Http) { }

  insert(movieObject:string) {
    return this._http.post(this.url, JSON.parse(movieObject))
  }

}
