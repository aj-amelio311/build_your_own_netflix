import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DownloadinfoService } from '../../services/downloadinfo.service';
import { v4 as uuid } from 'uuid';
import { CreateaccountService } from '../../services/createaccount.service';
import { CreatelibraryService } from '../../services/createlibrary.service';


@Component({
  selector: 'register',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  userId:string;
  movies:any[] = [];
  searches:any[] = [];
  inc:number;
  end:number;
  counter:number;
  percent:string;
  userCreated:boolean = false;

  constructor(
  private _get:DownloadinfoService,
  private _create:CreateaccountService,
  private _build:CreatelibraryService,
  private _router:Router
  ) {}

  ngOnInit() {

  }

  createAccount() {
    this.userId = uuid();
    localStorage.setItem("user_id", this.userId);
  }

  createMovies(form) {
    this.createAccount();
    localStorage.getItem("user_id");
    let userObj = {
      "username": form.value.username,
      "password": form.value.password,
      "user_id": this.userId,
      "file_path": encodeURIComponent(form.value.filepath)
    }
    let userString = JSON.stringify(userObj)
    this._create.addAccount(userString).subscribe((resp) => {
        if (resp.json().status === 200) {
          if (resp.json().result.nModified === 1) {
            alert("This username already exists")
          } else {
            this.userCreated = true;
          }
        }
    })
    const fileExtensions = ["mp4", "divx", "avi", "mkv", "m4v", "mpg", "mpeg"];
    this.inc = 0;
    this.counter = 0;
    let filepath = form.value.filepath;
    let fs = window["fs"];
    const files = fs.readdirSync(filepath);
    files.forEach((item) => {
      let extension = item.replace(/.*\./, '').toLowerCase();
      if (fileExtensions.includes(extension) && !item.includes("._")) {
        const movieClean = encodeURI(item.replace(/\.[^/.]+$/, "").replace("&", "and").replace("'", ""));
        const movieRaw = encodeURI(item)
        let searchPath = `https://api.themoviedb.org/3/search/movie?query=${movieClean}&api_key=xxx`;
        let search = {
          "searchPath": searchPath,
          "rawTitle": decodeURI(movieRaw.replace(/\.[^/.]+$/, "")),
          "fileName": decodeURI(movieRaw)
        }
        this.searches.push(search)
      }
    })
    if (this.searches.length > 0) {
      this.end = this.searches.length
      const timer = setInterval(()=> {
      if (this.counter < this.end) {
      let movieHolder = [];
      movieHolder.push(this.searches.slice(this.inc, this.inc + 10))
        if (movieHolder.length) {
          movieHolder[0].forEach((movie) => {
            this.counter++;
            this.inc++;
            this._get.getMovieInfo(movie.searchPath).subscribe((resp) => {
              let movieData = resp.json().results[0];
              if (movieData !== undefined) {
                movieData.user_id = this.userId;
                movieData.raw_title = movie.rawTitle;
                movieData.file_name = movie.fileName
                this.movies.push(movieData)
                this.percent = (Math.trunc((this.inc / this.end) * 100)).toString() + "%";
              }
            })
          })
        }
      } else {
        clearInterval(timer)
        this.buildLibrary();
      }
    }, 4050)
    }
  }

  buildLibrary() {
    if (this.userCreated) {
      let movieData = {
        inventory: this.movies
      }
      let movieString = JSON.stringify(movieData);
      this._build.build(movieString).subscribe((resp) => {
        if (resp.json().status === 200) {
          this._router.navigate(["dashboard"])
        }
      })
    }
  }

}
