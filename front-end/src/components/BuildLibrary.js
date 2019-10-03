import React, {Component} from "react";
import axios from "axios";
import {Redirect, Link} from "react-router-dom";
import {config} from "../../appconfig.js";
import {cleanMovie} from "../Util.js";
import Modal from 'react-modal';
var remote = window.require('electron').remote;
var fs = remote.require('fs');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : "80%",
    backgroundColor       : "#48C9B0",
    borderRadius          : "10px"
  }
};

class BuildLibrary extends Component {
  constructor(props) {
      super(props)
      this.state = {
        userId: "",
        filePath: "",
        searches: [],
        movies: [],
        percent: "",
        modalIsOpen: false,
        success: false
      }
      this.getMovieData = this.getMovieData.bind(this);
      this.buildLibrary = this.buildLibrary.bind(this);
      this.openModal = this.openModal.bind(this);
      this.afterOpenModal = this.afterOpenModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement('#loadingModal')
    const userId = sessionStorage.getItem("uid");
    const filePath = sessionStorage.getItem("filepath");
    this.setState({userId: userId});
    this.setState({filePath: filePath});
    this.getMovieData(userId, filePath);
    this.openModal();
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
//    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }


  buildLibrary() {
    const movieBody = {
      inventory: this.state.movies,
      userId: this.state.userId 
    }
    axios.post(`${config.api}/update_inventory`, movieBody).then((resp) => {
      if (resp.data.status === 200) {
          this.setState({success: true})
      }
    })
    this.closeModal();
  }

  getMovieData(userId, filepath) {
        const fileExtensions = ["mp4", "divx", "avi", "mkv", "m4v", "mpg", "mpeg"];
        let inc = 0;
        let counter = 0;
        const files = fs.readdirSync(filepath);
        files.forEach((item) => {
          let stats = fs.statSync(filepath + "/" + item)
          let extension = item.replace(/.*\./, '').toLowerCase();
          if (fileExtensions.includes(extension) && !item.includes("._")) {
            const movieClean = encodeURI(cleanMovie(item).replace(/\.[^/.]+$/, "").replace("&", "and").replace("'", ""));
            const movieRaw = encodeURI(item)
            let searchPath = `https://api.themoviedb.org/3/search/movie?query=${movieClean}&api_key=b6ff109edfbb695e5769846611d26bb7`;
            let search = {
              "searchPath": searchPath,
              "rawTitle": decodeURI(movieRaw.replace(/\.[^/.]+$/, "")),
              "fileName": decodeURI(movieRaw),
              "dateAdded": stats.mtime
            }
            this.state.searches.push(search)
          }
        })
        if (this.state.searches.length > 0) {
          let end = this.state.searches.length;
          const timer = setInterval(()=> {
          if (counter < end) {
          let movieHolder = [];
          let percent;
          movieHolder.push(this.state.searches.slice(inc, inc + 10))
            if (movieHolder.length) {
              movieHolder[0].forEach((movie) => {
                counter++;
                inc++;
                axios.get(movie.searchPath).then((resp) => {
                  let movieData = resp.data.results[0];
                  if (movieData !== undefined) {
                    movieData.user_id = userId;
                    movieData.raw_title = movie.rawTitle;
                    movieData.file_name = movie.fileName;
                    movieData.date_added = movie.dateAdded;
                    this.state.movies.push(movieData)
                  }
                  percent = Math.trunc((inc / end) * 100).toString() + "%";
                  this.setState({percent: percent})
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

  render() {
    const redirectToReferrer = this.state.success;
    if (redirectToReferrer === true) {
        return <Redirect to="/dashboard" />
    }
    return (
      <div>
        <div className="col-md-12">
        </div>
        <div id="loadingModal"></div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h6 className="center-text">Building your Library...</h6>
          <h1 className="center-text">{this.state.percent}</h1>
        </Modal>
      </div>
    )
  }
}


export default BuildLibrary;
