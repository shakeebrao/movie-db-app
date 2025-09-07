import React, { useState, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';
import SearchMovie from './SearchMovie';
import ActorMovies from './ActorMovies';

const MovieList = ({ movies, state, details, poster, actorsDetails, ActorClick, setActorClick }) => {
  const [actorWork, setActorWork] = useState([]);
  const [knownFor, setKnownFor] = useState([]);
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTc3YjRkMDk3NDE5MTgxNjJjZDEwZDk2N2Y0M2U2MyIsIm5iZiI6MTc1NDMzNTYyMS4xMDYsInN1YiI6IjY4OTEwOTg1ZDcxM2E2NTNkNTExZTFiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.06eD7wmjDt581d-y87YWGKBF6mRwc4FSs2nLmJwCIMg';
  const [movieDetails, setMovieDetails] = useState(true);
  useEffect(() => {
    setMovieDetails(details);
  }, [details]);
  const sliderRef = useRef(null);
  const actorRef = useRef(null);
  const handleActorLeft = () => {
    actorRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  }
  const handleActorRight = () => {
    actorRef.current.scrollBy({ left: 300, behaviour: 'smooth' });
  }
  const handleScrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };
  const Trending = () => {
    return (
      <div className='trending'>
        <h2>Trending This Week</h2>
      </div>
    );
  }
  const handleActorDetails = (id, known_for) => {
    const url = `https://api.themoviedb.org/3/person/${id}`;
    const fetchDetails = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'

          }
        })
        const data = await response.json();
        setActorWork(data);
        setKnownFor(known_for);
        setActorClick(true)
      }
      catch (e) {
        console.log(e.message);
      }
    }
    fetchDetails();

  }

  const Actors = () => {
    return (
      <>
        <div className='actor'>
          <h2>Popular Actors</h2>
        </div>
        <div className='movie-slider'>
          {
            (actorsDetails.length > 1) && (
              <button className="arrow left" onClick={handleActorLeft}>←</button>
            )
          }
          <div className='movie-list' ref={actorRef}>
            {actorsDetails.map(actor => (
              <div key={actor.id} className='movie-card'>

                <img className='movie-card-img' src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/default-profile.png"} alt={actor.name} onClick={() => handleActorDetails(actor.id, actor.known_for)} />
                <h3 className='actor-card-title' onClick={() => handleActorDetails(actor.id, actor.known_for)}>{actor.name}</h3>
                <p className='actor-card-rating'>Popularity: {actor.popularity}</p>
              </div>
            ))}
          </div>
          {
            (actorsDetails.length > 1) && (
              <button className="arrow right" onClick={handleActorRight}>→</button>
            )
          }

        </div>

      </>

    )
  }

  return (
    <>
      {ActorClick ? (
        <>
          {state && <ActorMovies actorDetails={actorWork} knownFor={knownFor} />}
          {
            !state && (<div className='search-result-container'>
              {movies.map(movie => (
                <SearchMovie
                  key={movie.imdbID}
                  title={movie.Title}
                  posterUrl={movie.Poster}
                  year={movie.Year}
                />
              ))}
            </div>)
          }
        </>


      ) : (
        <>
          {(details && state) && <Trending />}

          <div className='movie-slider'>
            {(movies.length > 1 && state) && (
              <button className="arrow left" onClick={handleScrollLeft}>←</button>
            )}

            <div className="movie-list" ref={sliderRef}>
              {details ? (
                state ? (
                  movies.map(movie => (
                    <MovieCard
                      titleDetails={movieDetails}
                      key={movie.id}
                      title={movie.title}
                      posterUrl={poster[movie.id]}
                      year={movie.release_date}
                      votes={movie.vote_average}
                    />
                  ))
                ) : (
                  <div className='search-result-container'>
                    {movies.map(movie => (
                      <SearchMovie
                        key={movie.imdbID}
                        title={movie.Title}
                        posterUrl={movie.Poster}
                        year={movie.Year}
                      />
                    ))}
                  </div>
                )
              ) : (
                <MovieCard
                  titleDetails={movieDetails}
                  key={movies.imdbID}
                  title={movies.Title}
                  posterUrl={movies.Poster}
                  year={movies.Year}
                  votes={movies.imdbRating}
                  awards={movies.Awards}
                  Actors={movies.Actors}
                  boxOffice={movies.BoxOffice}
                  director={movies.Director}
                  genre={movies.Genre}
                  language={movies.Language}
                  plot={movies.Plot}
                  releaseDate={movies.Released}
                  runtime={movies.Runtime}
                  writer={movies.Writer}
                  metascore={movies.Metascore}
                />
              )}
            </div>

            {(movies.length > 1 && state) && (
              <button className="arrow right" onClick={handleScrollRight}>→</button>
            )}
          </div>

          {(details && state) && <Actors />}
          <div className='end'>

            <span>For more Info, Contact me on:</span>
            <a href='https://www.linkedin.com/in/mohammed-shakeeb-a4b7241b3/' target='_blank' rel="noreferrer">
              <img src='/images/linkedin-black-seeklogo.png' alt='LinkedIn' className='linkedin'></img>
            </a>
           
            <a href='https://github.com/shakeebrao' target='_blank' rel="noreferrer">
            <img src='/images/github_PNG40.png' alt='GitHub' className='github'></img>
            </a>
            <a href=' https://x.com/Updates1Top5' target='_blank' rel="noreferrer">
            <div className='icon-wrap'>
            <img src='/images/X.jpg' alt='X' className='twitter'></img>


            </div>
            </a>
          </div>
        </>
      )}
    </>
  );
}

export default MovieList;