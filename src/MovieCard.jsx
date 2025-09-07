import React, { useContext } from 'react';
import './MovieCard.css';
import {ApiContext} from './ApiContext';
function MovieCard({ titleDetails,title,posterUrl,  year,votes,awards,Actors,boxOffice,director,genre,language,plot,releaseDate,runtime,writer,metascore }) {
  const{api,apiFetcher}=useContext(ApiContext);
  const yearFinal=year.split('-',1);
  function handleDetails(){
    const movieDetails=api+'t='+title;
    apiFetcher(movieDetails);
  }
   return titleDetails ? (
    <>
      <div className="movie-card">
      <img src={posterUrl} alt={title} className="movie-card-img" onClick={handleDetails}/>
      <div className="movie-card-content">
        <h3 className="movie-card-title" onClick={handleDetails}>{title} </h3>
        <p className="movie-card-rating">Year: {yearFinal}</p>
        <p>Votes: {votes}</p>
      </div>
    </div>
    
    </>
  
  ) : (
    <div className="movie-credits">
      <div className="movie-credits-hero">
        <img
          src={posterUrl}
          alt={title}
          className="movie-credits-img"
        />
        <h3 className="movie-credits-title" >
          {title}
        </h3>
      </div>

      <div className="movie-credits-content">
        <p className="movie-credits-rating">Year: {yearFinal}</p>
        <p className='movie-credits-votes'>IMDB: {votes}</p>
        <p className='movie-credits-awards'>Awards: {awards}</p>
        <p className='movie-credits-actors'>Actors: {Actors}</p>
        <p className='movie-credits-profit'>BoxOffice: {boxOffice}</p>
        <p className='movie-credits-director'>Director: {director}</p>
        <p className='movie-credits-genre'>Genre: {genre}</p>
        <p className='movie-credits-language'>Language: {language}</p>
        <p className='movie-credits-plot'>Description: {plot}</p>
        <p className='movie-credits-date'>Release Date: {releaseDate}</p>
        <p className='movie-credits-time'>Runtime: {runtime}</p>
        <p className='movie-credits-writer'>Writer: {writer}</p>
        <p className='movie-credits-metascore'>Metascore: {metascore}</p>
      </div>
    </div>
  );
}

export default MovieCard;