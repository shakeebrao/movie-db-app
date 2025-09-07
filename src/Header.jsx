import React, { useState, useEffect } from 'react';
import ActorMovies from './ActorMovies';
import './MovieCard.css';
import './Header.css';
import './SearchMovie.css';
import MovieCard from './MovieCard';
function Header(props) {
  const [selectedActor, setSelectedActor] = useState(null);
  const [movie, setMovieFor] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [selectedKnownFor, setSelectedKnownFor] = useState([]);
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTc3YjRkMDk3NDE5MTgxNjJjZDEwZDk2N2Y0M2U2MyIsIm5iZiI6MTc1NDMzNTYyMS4xMDYsInN1YiI6IjY4OTEwOTg1ZDcxM2E2NTNkNTExZTFiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.06eD7wmjDt581d-y87YWGKBF6mRwc4FSs2nLmJwCIMg';
  const [movieClick, setMovieClick] = useState(false);
  useEffect(() => {
    if (selectedActor) {
      setMovieClick(true);
    }
    else {
      setMovieClick(false);
    }
  }, [selectedActor])
  useEffect(() => {
    if (movieDetails) {
      setMovieFor(true);
    }
    else {
      setMovieFor(false);
    }
  }, [movieDetails])
  const handleActorDetails = (actor) => {
    setSelectedKnownFor(actor.known_for);
    const url = `https://api.themoviedb.org/3/person/${actor.id}`;
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
        setSelectedActor(data);
      }
      catch (e) {
        console.log(e.message);
      }
    }
    fetchDetails();

  };

  const { movies, title, popular, top, tv, actorsDetails } = props;
  if (popular) {
    return (
      <>
        <header className="header">
          <h1 className="header-title">{title}</h1>
        </header>
        <main>
          <div className='search-result-container'>
            {
              movies.map(movie => (
                <MovieCard
                  titleDetails={true}
                  key={movie.id}
                  title={movie.title}
                  posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "/default-profile.png"}
                  year={movie.release_date}
                  votes={movie.vote_average}
                  onClick={() => handleMovie(movie.id)}
                />
              ))
            }
          </div>
        </main>
      </>

    );
  } else if (top) {
    return (
      <>
        <header className="header">
          <h1 className="header-title">{title}</h1>
        </header>

        <main>
          <div className='search-result-container'>
            {
              movies.map(movie => (
                <MovieCard
                  titleDetails={true}
                  key={movie.id}
                  title={movie.title}
                  posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "/default-profile.png"}
                  year={movie.release_date}
                  votes={movie.vote_average}
                  onClick={() => handleMovie(movie.id)}

                />
              ))
            }
          </div>
        </main>
      </>

    );
  } else if (tv) {
    return (
      <>
        <header className="header">
          <h1 className="header-title">{title}</h1>
        </header>
        <main>
          <div className='search-result-container'>
            {

              movies.map(tvShow => (
                <div key={tvShow.id} className='search-result'>
                  <img
                    className='search-result-img'
                    src={tvShow.poster_path ? `https://image.tmdb.org/t/p/w200${tvShow.poster_path}` : "/default-profile.png"}
                    alt={tvShow.name}
                  />
                  <div className='search-result-content'>
                    <h3
                      className='search-result-title'
                    >
                      {tvShow.name}
                    </h3>
                    <p className='search-result-rating'>Popularity: {tvShow.popularity}</p>
                  </div>
                </div>
              ))}
          </div>
        </main>

      </>

    );
  } else if (actorsDetails) {
    if (movieClick && selectedActor) {
      return <ActorMovies actorDetails={selectedActor} knownFor={selectedKnownFor} headerState={movieClick} />;
    }
    else {
      return (
        <>
          <header className="header">
            <h1 className="header-title">{title}</h1>
          </header>
          <main>
            <div className='search-result-container'>
              {
                movies.map(actor => (
                  <div key={actor.id} className='search-result'>
                    <img
                      className='search-result-img'
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/default-profile.png"}
                      alt={actor.name}
                      onClick={() => handleActorDetails(actor)}
                    />
                    <div className='search-result-content'>
                      <h3
                        className='search-result-title'
                        onClick={() => handleActorDetails(actor)}
                      >
                        {actor.name}
                      </h3>
                      <p className='search-result-rating'>Popularity: {actor.popularity}</p>
                    </div>
                  </div>
                ))}
            </div>
          </main>
        </>
      );

    }


  } else {
    return <p>No data found</p>;
  }
}
export default Header;