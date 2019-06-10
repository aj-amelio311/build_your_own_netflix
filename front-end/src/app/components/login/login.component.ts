import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _login:LoginService,
    private _router:Router
  ) { }

  ngOnInit() {
  }

  login(form) {
    let jsonString = JSON.stringify(form.value)
    this._login.login(jsonString).subscribe((resp) => {
      if (resp.json().status === 200) {
        localStorage.setItem("user_id", resp.json().user_id)
        this._router.navigate(["dashboard"])
      } else {
        alert("Invalid Login")
      }
    })
  }

}
