import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private _url:string = environment.appUrl + "/get_inventory/";
  constructor(private _http:Http) { }

  getInventory(userId:string) {
    return this._http.get(this._url + userId);
  }

}
