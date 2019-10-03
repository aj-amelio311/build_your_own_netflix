import {config} from "../appconfig.js";
import axios from "axios";

export const addToQueue = (userId, id) => {
  const reqUrl = `${config.api}/get_movie/${id}/${userId}`;
  axios.get(reqUrl).then((resp) => {
    if (resp.data) {
      const movieBody = resp.data[0];
      axios.post(`${config.api}/add_to_queue`, movieBody).then((resp) => {
        console.log(resp)
      })
    }
  })
}

export const removeFromQueue = (userId, id) => {
  const reqUrl = `${config.api}/get_movie/${id}/${userId}`;
  axios.get(reqUrl).then((resp) => {
    if (resp.data) {
      const movieBody = resp.data[0];
      axios.post(`${config.api}/remove_from_queue`, movieBody).then((resp) => {
        console.log(resp)
      })
    }
  })
}

export const addToHistory = (movieData) => {
    axios.post(`${config.api}/add_to_history`, movieData).then((resp) => {
      console.log(resp)
    })
}

export const clearHistoryDB = (userId) => {
  axios.get(`${config.api}/clear_history/${userId}`).then((resp) => {
    console.log(resp)
  })
}

export const getGenres = (movie) => {
  const result = [];
  const genreIds = movie.genre_ids;
  let newString = "";
  const resultString = genreIds.join(",")
  newString = resultString.replace(/28/gi, "Action")
  .replace(/80/gi, "Crime")
  .replace(/53/gi, "Thriller")
  .replace(/12/gi, "Adventure")
  .replace(/16/gi, "Animation")
  .replace(/35/gi, "Comedy")
  .replace(/99/gi, "Documentary")
  .replace(/18/gi, "Drama")
  .replace(/10751/gi, "Family")
  .replace(/14/gi, "Fantasy")
  .replace(/36/gi, "History")
  .replace(/27/gi, "Horror")
  .replace(/10402/gi, "Music")
  .replace(/9648/gi, "Mystery")
  .replace(/10749/gi, "Romance")
  .replace(/878/gi, "Sci-Fi")
  .replace(/53/gi, "Thriller")
  .replace(/10770/gi, "TV Movie")
  .replace(/10752/gi, "War")
  .replace(/10749/gi, "Western");
  return newString.split(",")
}

export const shuffle = (arr) => {
  var length = arr.length;
  while (length) {
    length--;
        var j = Math.floor(Math.random() * length);
        var temp = arr[length];
        arr[length] = arr[j];
        arr[j] = temp;
  }
  return arr
}
/*
export const filter = (term, arr) => {
  var results = arr.filter((item) => {
    return item.title.toLowerCase().includes(term.toLowerCase())
  })
  return results
}
*/

export const cleanMovie = (movieTitle) => {
  /*
  movieTitle = movieTitle.replace(" II ", " 2 ");
  movieTitle = movieTitle.replace(" III ", " 3 ");
  movieTitle = movieTitle.replace(" IV ", " 4 ");
  movieTitle = movieTitle.replace(" V ", " 5 ");
  movieTitle = movieTitle.replace(" VI ", " 6 ");
  movieTitle = movieTitle.replace(" VII ", " 7 ");
  movieTitle = movieTitle.replace(" VIII ", " 8 ");
  */
  movieTitle = movieTitle.replace("-", " ");
  movieTitle = movieTitle.replace(",", " ");
  movieTitle = movieTitle.replace("'", "");
  movieTitle = movieTitle.replace("é", "e");
  movieTitle = movieTitle.replace("à", "a");
  movieTitle = movieTitle.replace("ñ", "n");
  movieTitle = movieTitle.replace("ó", "o");
  movieTitle = movieTitle.replace(/  +/g, ' ');
  return movieTitle;
}

export const filter = (searchTerm, movies) => {
  let lib;
  if (searchTerm.length > 0) {
      lib = movies.filter((movie) => {
        let movieTitle = movie.title.toLowerCase();
        searchTerm = searchTerm.toLowerCase();
      return movieTitle.includes(searchTerm);
    });
  } else {
    lib = movies
  }
  return lib;
}

export const genres = (genre, movies) => {
  let lib;
  if (genre !== "9999") {
      lib = movies.filter((movie) => {
        return movie.genre_ids.includes(parseInt(genre))
    });
  } else {
    lib = movies
  }
  return lib;
}

export const recentlyAdded = (movies) => {
  const lib = movies.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
  return lib
}
