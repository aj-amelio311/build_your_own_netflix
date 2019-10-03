import React, {Component} from "react";
import {config} from "../../appconfig.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import {addToQueue, removeFromQueue, addToHistory} from "../Util.js";
const {shell} = window.require('electron');
var remote = window.require('electron').remote;
var fs = remote.require('fs');
import axios from "axios";


class ModalData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      filePath: "",
      queueButton: false
    }
  }

  componentDidMount() {
    const userId = sessionStorage.getItem("uid");
    const filepath = sessionStorage.getItem("filepath");
    const movieId = parseInt(sessionStorage.getItem("movie_id"));
    this.setState({userId: userId});
    this.setState({filePath: filepath});
    let queueUrl = `${config.api}/check_queue/${userId}/${movieId}`;
    axios.get(queueUrl).then((resp) => {
      this.setState({queueButton: resp.data.response});
    })
  }

  playMovie(movieId) {
    const reqUrl = `${config.api}/get_movie/${movieId}/${this.state.userId}`;
    axios.get(reqUrl).then((resp) => {
      let fullPath = `${this.state.filePath}/${resp.data[0].file_name}`
      if (fs.existsSync(fullPath)) {
        shell.openItem(fullPath)
        let movieData = resp.data[0];
        movieData.user_id = this.state.userId;
        addToHistory(movieData);
        this.props.closemodal();
      }
    })
  }

  add(movieId) {
    addToQueue(this.state.userId, movieId);
    this.props.closemodal();
  }

  remove(movieId) {
    removeFromQueue(this.state.userId, movieId);
    if (this.props.rmqueue) {
        this.props.rmqueue(movieId);
    }
    this.props.closemodal();
  }


  render() {
    const data = this.props.info;
    const movieId = this.props.info.movieId
    const rotten = this.props.rtscore;
    let rtLogo;
    if (this.props.rtscore) {
      rtLogo = this.props.rtlogo;
    }
    let genres;
    if (data.genres) {
      genres = data.genres.map(item => <li key={item}>{item}</li>)
    }



    let queueButton;
    if (this.state.queueButton !== true) {
      queueButton = <div><label>Add to Queue</label><br /><span movieid={movieId} onClick={this.add.bind(this, movieId)}><FontAwesomeIcon className="fa-icon" icon={faPlusCircle}  size="3x" /></span></div>
    } else {
      queueButton = <div><label>Remove from Queue</label><br /><span movieid={movieId} onClick={this.remove.bind(this, movieId)}><FontAwesomeIcon className="fa-icon" icon={faMinusCircle}  size="3x" /></span></div>
    }

    return (
        <div>
          <div className="col-md-12">
            <h2 className="modal-title">{data.title}</h2>
          </div>
          <div className="col-md-12 row modal-details">
            <div className="col-md-3">
              <img className="modal-poster" src={data.poster} />
            </div>
            <div className="col-md-9">
              <p className="description">{data.overview}</p>
              <ul>
                {genres}
              </ul>
            </div>
          </div>
          <div className="col-md-12 row modal-details">
            <div className="col-md-3">
              {queueButton}
            </div>
            <div className="col-md-3">
              <label>Play Movie</label>
              <br />
              <span movieid={movieId} onClick={this.playMovie.bind(this, movieId)}><FontAwesomeIcon className="fa-icon" icon={faPlayCircle}  size="3x" /></span>
            </div>
            <div className="col-md-3">
              <img className="rtLogo" src={rtLogo} />
              <span className="rt-rating">{rotten}</span>
            </div>
          </div>
        </div>
    )
  }
}

export default ModalData
