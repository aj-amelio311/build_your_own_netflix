import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userId:string = "";

  constructor(
    private _router:Router
  ) { }

  ngOnInit() {
  this.userId = localStorage.getItem("user_id").toString();
  }

  logout() {
    localStorage.clear();
    this._router.navigate(["/"])
  }


}
