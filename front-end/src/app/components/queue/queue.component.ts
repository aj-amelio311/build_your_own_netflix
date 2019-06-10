import { Component, OnInit } from '@angular/core';
import { GetqueueService } from '../../services/getqueue.service';
import { MovieinfoService } from '../../services/movieinfo.service';
import { CheckqueueService } from '../../services/checkqueue.service';
import { AddtoqueueService } from '../../services/addtoqueue.service';
import { RemovefromqueueService } from '../../services/removefromqueue.service';
import { AddtohistoryService } from '../../services/addtohistory.service';
import { GetuserinfoService } from '../../services/getuserinfo.service';
import { RottenService } from '../../services/rotten.service';
import { KeywordqueueService } from '../../services/keywordqueue.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  userId:string = "";
  loading:boolean = false;
  inventory:any[];
  movieCount:number;
  movieDetails:any;
  infoTitle:string = "";
  infoOverview:string = "";
  movieId:string = "";
  rawTitle:string = "";
  fileName:string = "";
  showInfo:boolean = false;
  infoPosterPath:string = "";
  inQueue:boolean;
  criticScore:string;
  genreEnable:boolean = true;

  constructor(
    private _get:GetqueueService,
    private _getMovie:MovieinfoService,
    private _check:CheckqueueService,
    private _add:AddtoqueueService,
    private _remove:RemovefromqueueService,
    private _user:GetuserinfoService,
    private _addHistory:AddtohistoryService,
    private _rotten:RottenService,
    private _keyword:KeywordqueueService,
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem("user_id").toString();
    this._get.getQueue(this.userId).subscribe((resp) => {
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
        this._get.getQueue(this.userId).subscribe((resp) => {
          this.loading = true;
          this.inventory = resp.json();
          this.movieCount = resp.json().length;
          this.genreEnable = true;
        })
      }
    }, 500)
  }

  addToQueue() {
    this.showInfo = false;
    this._getMovie.getMovieInfo(this.rawTitle, this.userId).subscribe((resp) => {
      let movie = resp.json()[0];
      let movieString = JSON.stringify(movie)
      this._add.insert(movieString).subscribe((resp) => {
        console.log(resp.json())
      })
    })
  }

  removeFromQueue() {
        this.showInfo = false;
        this._getMovie.getMovieInfo(this.rawTitle, this.userId).subscribe((resp) => {
          let movie = resp.json()[0];
          let movieString = JSON.stringify(movie)
          this._remove.remove(movieString).subscribe((resp) => {
            if (resp.json().status === 200) {
              this.inventory = this.inventory.filter((item) => {
                return item.raw_title !== movie.raw_title
              })
              this.movieCount = this.inventory.length;
            }
          })
        })
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

}
