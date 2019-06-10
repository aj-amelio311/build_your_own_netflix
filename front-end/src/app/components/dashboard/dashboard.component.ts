import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { MovieinfoService } from '../../services/movieinfo.service';
import { CheckqueueService } from '../../services/checkqueue.service';
import { AddtoqueueService } from '../../services/addtoqueue.service';
import { RemovefromqueueService } from '../../services/removefromqueue.service';
import { AddtohistoryService } from '../../services/addtohistory.service';
import { GetuserinfoService } from '../../services/getuserinfo.service';
import { RottenService } from '../../services/rotten.service';
import { GenreService } from '../../services/genre.service';
import { KeywordService } from '../../services/keyword.service';


@Component({
  providers: [],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private _getInventory:InventoryService,
    private _getMovie:MovieinfoService,
    private _check:CheckqueueService,
    private _add:AddtoqueueService,
    private _remove:RemovefromqueueService,
    private _user:GetuserinfoService,
    private _addHistory:AddtohistoryService,
    private _rotten:RottenService,
    private _genre:GenreService,
    private _keyword:KeywordService
  ) { }
  userId:string = "";
  loading:boolean = false;
  inventory:any[];
  movieDetails:any;
  infoTitle:string = "";
  infoOverview:string = "";
  movieId:string = "";
  rawTitle:string = "";
  fileName:string = "";
  movieCount:number;
  showInfo:boolean = false;
  infoPosterPath:string = "";
  inQueue:boolean;
  criticScore:string;
  genreEnable:boolean = true;

  ngOnInit() {
    this.userId = localStorage.getItem("user_id").toString();
    this._getInventory.getInventory(this.userId).subscribe((resp) => {
      this.loading = true;
      this.inventory = resp.json();
      this.movieCount = resp.json().length;
    })
  }

  search(event) {
    setTimeout(() => {
      let keyword = event.srcElement.value;
      if (keyword.length > 0) {
        this._keyword.search(keyword, this.userId).subscribe((resp) => {
          this.inventory = resp.json();
          this.movieCount = this.inventory.length;
          this.genreEnable = false;
        })
      } else {
        this._getInventory.getInventory(this.userId).subscribe((resp) => {
          this.loading = true;
          this.inventory = resp.json();
          this.movieCount = resp.json().length;
          this.genreEnable = true;
        })
      }
    }, 500)
  }


  getInfo(event) {
    this.showInfo = true;
    let rawTitle = event.target.attributes.rawTitle.nodeValue;
    this.rawTitle = rawTitle;
    this._getMovie.getMovieInfo(rawTitle, this.userId).subscribe((resp) => {
      this.movieId = resp.json()[0]._id;
      this.movieDetails = resp.json()[0];
      this.infoTitle = this.movieDetails.original_title;
      this.infoOverview = this.movieDetails.overview;
      this.infoPosterPath = this.movieDetails.poster_path;
      this.fileName = this.movieDetails.file_name;
    })

    this._rotten.getRating(rawTitle).subscribe((resp) => {
      if (resp.json().status === 200) {
        this.criticScore = resp.json().critic_score.replace("liked it", "");
      }
    })

    this._check.checkMovie(rawTitle, this.userId).subscribe((resp) => {
      this.inQueue = resp.json().response;
    })
  }

  close() {
    this.showInfo = false;
    this.infoTitle = "";
    this.infoOverview = "";
    this.infoPosterPath = "";
    this.criticScore = "";
  }

  addToQueue() {
    this.showInfo = false;
    this._getMovie.getMovieInfo(this.rawTitle, this.userId).subscribe((resp) => {
      let movie = resp.json()[0];
      let movieString = JSON.stringify(movie)
      this._add.insert(movieString).subscribe((resp) => {
      //  console.log(resp.json())
      })
    })
  }

  removeFromQueue() {
        this.showInfo = false;
        this._getMovie.getMovieInfo(this.rawTitle, this.userId).subscribe((resp) => {
          let movie = resp.json()[0];
          let movieString = JSON.stringify(movie)
          this._remove.remove(movieString).subscribe((resp) => {
            //console.log(resp.json())
          })
        })
  }

  addToHistory(rawTitle, userId) {
    this._getMovie.getMovieInfo(this.rawTitle, this.userId).subscribe((resp) => {
      let movie = resp.json()[0];
      let movieString = JSON.stringify(movie)
      this._addHistory.insert(movieString).subscribe((resp) => {
      //  console.log(resp.json())
      })
    })
  }

  filterGenre(event) {
    let genre = event.target.value;
    if (genre !== "9999") {
      this._genre.search(this.userId, genre).subscribe((resp) => {
        this.inventory = resp.json();
        this.movieCount = this.inventory.length;
      })
    } else {
      this._getInventory.getInventory(this.userId).subscribe((resp) => {
        this.loading = true;
        this.inventory = resp.json();
        this.movieCount = resp.json().length;
      })
    }

  }

  playMovie(event) {
    let userId = localStorage.getItem("user_id").toString();
    this._user.getProfile(userId).subscribe((resp) => {
      let filepath = resp.json()[0].file_path;
      let catchNoFile = 0;
      this.showInfo = false;
      let fs = window["fs"];
      let shell = window["shell"];
        let moviePath;
        if (fs.existsSync(`${filepath}/${this.fileName}`)) {
          catchNoFile++;
          moviePath = `${filepath}/${this.fileName}`;
          shell.openItem(moviePath)
          this.addToHistory(this.rawTitle, this.userId)
        }
      if (catchNoFile === 0) {
        alert("Something went wrong")
      }
    })
  }




}
