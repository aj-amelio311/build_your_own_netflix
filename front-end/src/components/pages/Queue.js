import React, { Component } from 'react';
import {config} from "../../../appconfig.js";
import {filter, getGenres} from "../../Util.js";
import Sidebar from "../Sidebar";
import Movie from "../Movie";
import Genres from "../Genres";
import ModalData from "../ModalData";
import axios from "axios";
import Modal from 'react-modal';

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

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      filePath: "",
      library: [],
      entireLibrary: [],
      modalIsOpen: false,
      rotten: "",
      rtLogo: "",
      pageTitle: "Queue",
      queueButton: false,
      loading: true,
      modalData: []

    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getFilter= this.getFilter.bind(this);
    this.removeFromQueueLive = this.removeFromQueueLive.bind(this)
  }

  componentDidMount() {
    Modal.setAppElement('#modalId')
    const userId = sessionStorage.getItem("uid");
    const filepath = sessionStorage.getItem("filepath");
    this.setState({userId: userId});
    this.setState({filePath: filepath});
    axios.get(`${config.api}/get_queue/${userId}`).then((resp) => {
      this.setState({library: resp.data});
      this.setState({entireLibrary: resp.data});
      this.setState({loading: false});
    })
  }

  getFilter(term) {
      this.setState({loading: false})
      let searchTerm = term.searchbar.value;
      const movies = filter(searchTerm, this.state.entireLibrary);
      this.setState({library: movies});
  }

  openModal(movieId, title) {
    sessionStorage.setItem("movie_id", movieId);
    let modalData = [];
    const reqUrl = `${config.api}/get_movie/${movieId}}/${this.state.userId}`;
    axios.get(reqUrl).then((resp) => {
      modalData.genres =  getGenres(resp.data[0]);
      modalData.title = resp.data[0].title;
      modalData.movieId = resp.data[0].id;
      modalData.overview = resp.data[0].overview;
      modalData.poster = `http://image.tmdb.org/t/p/w185/${resp.data[0].poster_path}`;
      this.setState({modalData: modalData})
    })
    const rottenUrl = `${config.rotten}/movie/${title}`;
    axios.get(rottenUrl).then((resp) => {
      if (resp.data.status === 200) {
        this.setState({rotten: resp.data.critic_score});
        this.setState({rtLogo: "https://aj-website-file-storage.s3.us-east-2.amazonaws.com/other/rtlogo.png"})
      }
    })
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
//    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    sessionStorage.setItem("movie_id", "");
    const modalData = [];
    this.setState({modalIsOpen: false});
    this.setState({modalData: modalData});
    this.setState({rotten: ""});
    this.setState({rtLogo: ""});
    this.setState({queueButton: false});
  }

  removeFromQueueLive(movieId) {
    let queue = this.state.library;
    queue = queue.filter(function( obj ) {
      return obj.id !== movieId;
    });
    this.setState({library: queue})
  }

  render() {
    let library;
    if (this.state.library.length !== 0) {
      library = this.state.library.map(item => <span key={item._id} onClick={this.openModal.bind(this, item.id, item.title)}> <Movie key={item.id} item={item}/> </span>)
    }

    if (this.state.library.length === 0 && this.state.loading === false) {
      library = <h1 className="emptyset">No Results Found</h1>
    }

    return (
      <div>
        <div className="container">
          <div className="col-md-12">
            <Sidebar passRefUpward={this.getFilter}  />
            <h1 className="center-text">{this.state.pageTitle}</h1>
            <div className="col-md-10 offset-md-3">
            <div className="row">
              <div className="col-md-4">
                Movies: {this.state.library.length}
              </div>
            </div>
            {library}
            </div>
          </div>
        </div>
        <div id="modalId"></div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button type="button" className="close" onClick={this.closeModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          <ModalData rmqueue={this.removeFromQueueLive} closemodal={this.closeModal} info={this.state.modalData} rtscore={this.state.rotten} rtlogo={this.state.rtLogo}/>
        </Modal>
      </div>
    )
  }
}

export default Queue;
