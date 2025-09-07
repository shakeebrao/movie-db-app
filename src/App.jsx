import React, { useState, useEffect } from 'react';
import MovieList from './MovieList';
import { ApiProvider } from './ApiContext';
import Header from './Header';
import './App.css';
const API_KEY = ' d158fd42';
const API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=d158fd42&`;
const tmdbAPI_URL = 'https://api.themoviedb.org/3/trending/movie/week';
const tmdbPoster = 'https://api.themoviedb.org/3/movie';
const tmdbActors = 'https://api.themoviedb.org/3/person/popular';
const tmdbUpcoming = 'https://api.themoviedb.org/3/movie/upcoming';
function App() {
  const [state, setState] = useState(true);
  const [actors, setActors] = useState([]);
  const [popular, setPopular] = useState(false);
  const [top, setTop] = useState(false);
  const [tv, setTv] = useState(false);
  const [actorsDetails, setActorsDetails] = useState(false);
  const [posterImg, setPosterUrl] = useState('');
  const [movies, setMovies] = useState([]);
  const [header, setHeader] = useState([]);
  const [shuffledActors, setShuffledActors] = useState([]);
  const [headerState, setHeaderState] = useState(false);
  const [actorClick, setActorClick] = useState(false);
  const [details, setDetails] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState();
  const [inputValue, setInputValue] = useState('');
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTc3YjRkMDk3NDE5MTgxNjJjZDEwZDk2N2Y0M2U2MyIsIm5iZiI6MTc1NDMzNTYyMS4xMDYsInN1YiI6IjY4OTEwOTg1ZDcxM2E2NTNkNTExZTFiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.06eD7wmjDt581d-y87YWGKBF6mRwc4FSs2nLmJwCIMg';
  const movieUrl = `${tmdbAPI_URL}`;
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(movieUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results);
        const posters = {};
        for (const movie of data.results) {
          const res = await fetch(`${API_URL}t=${movie.title}`);
          const movieData = await res.json();
          posters[movie.id] = movieData.Poster;
        }
        setPosterUrl(posters);
      }
      catch (e) {
        setError(e.message)
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchMovieData();


  }, []);
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch(tmdbActors, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'

          }
        })
        if (!response.ok) {
          throw new Error('No Actors Found.');
        }
        const data = await response.json();
        setActors(data.results);
      }
      catch (e) {
        setError(e.message);
      }
    }

    fetchActors();
  }, [])


  function apiFetcher(api) {
    const fetchMovie = async () => {
      try {
        const response = await fetch(api);
        if (!response.ok) {
          throw new Error('Network Response is undefined');
        }
        const data = await response.json();
        console.log(data);
        setHeaderState(false);
        setMovies(data);
        setDetails(false);
        setState(true);
        setActorClick(false);
      }
      catch (error) {
        setError(error);
      }
      finally {
        setIsLoading(false);
      }

    }
    fetchMovie();
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }
  function searchData() {
    const SEARCH_API_URL = API_URL + 's=' + inputValue;
    const searchMovies = async () => {
      try {
        const response = await fetch(SEARCH_API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSearch(data.Search);
        setState(false)
      } catch (error) {
        setError(error);
      } finally {
        setInputValue('');
        setIsLoading(false);
      }
    };
    searchMovies();
  };
  function homeScreen() {
    const fetchHome = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(movieUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results);
        setPopular(false);
        setTop(false);
        setHeaderState(false);
        setTv(false);
        setActorsDetails(false);
        setState(true);
        setActorClick(false);
        setDetails(true);
      }
      catch (e) {
        setError(e.message)
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchHome();

  }
  const handlePopularMovie = async () => {
    try {
      setIsLoading(true);

      const pages = Array.from({ length: 30 }, (_, i) => i + 1);
      const batchSize = 5;
      let allMovies = [];
      for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize).map(page => {
          const popularMovieUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
          return fetch(popularMovieUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          }).then(res => {
            if (!res.ok) throw new Error(`HTTP error on page ${page}`);
            return res.json();
          });
        });

        const results = await Promise.all(batch);
        results.forEach(data => {
          if (data.results) {
            allMovies.push(...data.results);
          }
        });
      }
      setPopular(true);
      setHeaderState(true);
      setHeader([...allMovies]);
      setTop(false);
      setTv(false);
      setActorsDetails(false);
    }
    catch (e) {
      setError(e.message);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleTvShows = async () => {
    try {
      setIsLoading(true);

      const pages = Array.from({ length: 30 }, (_, i) => i + 1);

      const batchSize = 5;
      let allShows = [];

      for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize).map(page => {
          const tvShowsUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}`;

          return fetch(tvShowsUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          }).then(res => {
            if (!res.ok) throw new Error(`HTTP error on page ${page}`);
            return res.json();
          });
        });
        const results = await Promise.all(batch);
        results.forEach(data => {
          if (data.results) {
            allShows.push(...data.results);
          }
        });
      }
      setTv(true);
      setPopular(false);
      setTop(false);
      setActorsDetails(false);
      setHeaderState(true);
      setHeader([...allShows]);
    }
    catch (e) {
      setError(e.message)
    }
    finally {
      setIsLoading(false);
    }

  }
  const handleTopMovies = async () => {
    const fetchTopRatedMovies = async () => {
      try {
        setIsLoading(true);

        const pages = Array.from({ length: 30 }, (_, i) => i + 1);

        const batchSize = 5;
        let allTop = [];

        for (let i = 0; i < pages.length; i += batchSize) {
          const batch = pages.slice(i, i + batchSize).map(page => {
            const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;

            return fetch(topRatedUrl, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
              }
            }).then(res => {
              if (!res.ok) throw new Error(`HTTP error on page ${page}`);
              return res.json();
            });
          });
          const results = await Promise.all(batch);
          results.forEach(data => {
            if (data.results) {
              allTop.push(...data.results);
            }
          });
        }
        setHeader([...allTop]);
        setHeaderState(true);
        setTop(true);
        setPopular(false);
        setTv(false);
        setActorsDetails(false);
      }
      catch (e) {
        setError(e.message)
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchTopRatedMovies();

  }
  const handleActors = async () => {
    try {
      setIsLoading(true);
      const pages = Array.from({ length: 30 }, (_, i) => i + 1);
      const batchSize = 5;
      let allActors = [];
      for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize).map(page => {
          const actorsUrl = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`;
          return fetch(actorsUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          }).then(res => {
            if (!res.ok) throw new Error(`HTTP error on page ${page}`);
            return res.json();
          });
        });

        const results = await Promise.all(batch);
        results.forEach(data => {
          if (data.results) {
            allActors.push(...data.results);
          }
        });
      }
      setActorsDetails(true);
      setPopular(false);
      setTop(false);
      setTv(false);
      setHeader(shuffleArray([...allActors]));
      setHeaderState(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  if (isLoading) {
    return (
      <div className="loading" style={{ background: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "16px",
        }}>
          <span className="swipe-text">MVDB</span>
          <div className="spinner" style={{ margin: "32px auto 0 auto" }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <ApiProvider api={API_URL} apiFetcher={apiFetcher} header={setHeaderState}>
      <div className="App">
        <header className="App-header">
          <span className="App-title" onClick={homeScreen}>MVDB</span>
          <div className='tags'>
            <div className="dropdown">
              <span className="tag dropdown-toggle">Movies</span>
              <div className="dropdown-menu">
                <span className="dropdown-item" onClick={handlePopularMovie}>Popular</span>
                <span className="dropdown-item" onClick={handleTopMovies}>Top-Rated</span>
              </div>
            </div>
            <span className='tag' onClick={handleTvShows}>TV Shows</span>
            <span className='tag' onClick={handleActors}>Actors</span>
          </div>
          <span className='search'>
            <input type="text" placeholder="Search..." value={inputValue} onChange={handleChange} />
            <button onClick={searchData}>🔍</button>
          </span>
        </header>
        <hr className='header-line' />
        <main>
          {
            headerState ? (

              popular ? <Header movies={header} title="Popular Movies" popular={popular} actorsDetails={actorsDetails} /> :
                top ? <Header movies={header} title="Top Rated Movies" top={top} actorsDetails={actorsDetails} /> :
                  tv ? <Header movies={header} title="TV Shows" tv={tv} actorsDetails={actorsDetails} /> :
                    actorsDetails ? <Header movies={header} title="Actors" actorsDetails={actorsDetails} /> : null
            )
              : <MovieList movies={state ? movies : search} state={state} details={details} poster={posterImg} actorsDetails={actors} ActorClick={actorClick} setActorClick={setActorClick} className='main-body' />
          }
        </main>
      </div>

    </ApiProvider>

  );
}

export default App;