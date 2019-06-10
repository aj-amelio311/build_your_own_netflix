import { Component, OnInit } from '@angular/core';
import { GethistoryService } from '../../services/gethistory.service';
import { GetuserinfoService } from '../../services/getuserinfo.service';
import { DownloadinfoService } from '../../services/downloadinfo.service';
import { UpdateinventoryService } from '../../services/updateinventory.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId:string = "";
  history:any[];
  loading:boolean = true;
  disabled:boolean = false;

  filepath:string = "";
  movies:any[] = [];
  searches:any[] = [];
  inc:number;
  end:number;
  counter:number;
  percent:string;
  userCreated:boolean = false;

  constructor(
    private _history: GethistoryService,
    private _user:GetuserinfoService,
    private _get:DownloadinfoService,
    private _build:UpdateinventoryService,
    private _router:Router
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem("user_id").toString();
    this._history.fetch(this.userId).subscribe((resp) => {
      this.loading = false;
      this.history = resp.json()
    })
    this._user.getProfile(this.userId).subscribe((resp) => {
      this.filepath = resp.json()[0].file_path;
    })
  }

  resyncLibrary() {
    this.disabled = true;
    const fileExtensions = ["mp4", "divx", "avi", "mkv", "m4v", "mpg", "mpeg"];
    this.inc = 0;
    this.counter = 0;
    let filepath = this.filepath;
    let fs = window["fs"];
    const files = fs.readdirSync(filepath);
    files.forEach((item) => {
      let extension = item.replace(/.*\./, '').toLowerCase();
      if (fileExtensions.includes(extension) && !item.includes("._")) {
        const movieClean = encodeURI(item.replace(/\.[^/.]+$/, "").replace("&", "and").replace("'", ""));
        const movieRaw = encodeURI(item)
        let searchPath = `https://api.themoviedb.org/3/search/movie?query=${movieClean}&api_key=b6ff109edfbb695e5769846611d26bb7`;
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
      let movieData = {
        inventory: this.movies,
        userId: this.userId
      }
      let movieString = JSON.stringify(movieData);
      this._build.build(movieString).subscribe((resp) => {
        if (resp.json().status === 200) {
          this._router.navigate(["dashboard"])
        }
      })
  }


}
