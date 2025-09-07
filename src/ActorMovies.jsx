import React, { useState, useContext, useEffect } from "react";
import { ApiContext } from "./ApiContext";
import MovieCard from "./MovieCard";
import './ActorMovies.css';
function ActorMovies({ actorDetails, knownFor, headerState }) {
    const [headerMovie, setHeaderMovie] = useState(null);
    const [movieClick, setMovieClick] = useState(false);
    useEffect(() => {
        if (headerMovie) {
            setMovieClick(true);
        }
        else {
            setMovieClick(false);
        }
    }, [headerMovie])

    const { api, apiFetcher } = useContext(ApiContext);
    async function handleDetails(title) {
        const movieDetails = api + 't=' + title;
        if (headerState) {
            const response = await fetch(movieDetails);
            const data = await response.json();
            setHeaderMovie(data);
            return;
        }
        else {
            apiFetcher(movieDetails);
            return;
        }
    }
    if (movieClick && headerMovie) {
        return (
            <MovieCard
                titleDetails={false}
                key={headerMovie.imdbID}
                title={headerMovie.Title}
                posterUrl={headerMovie.Poster}
                year={headerMovie.Year}
                votes={headerMovie.imdbRating}
                awards={headerMovie.Awards}
                Actors={headerMovie.Actors}
                boxOffice={headerMovie.BoxOffice}
                director={headerMovie.Director}
                genre={headerMovie.Genre}
                language={headerMovie.Language}
                plot={headerMovie.Plot}
                releaseDate={headerMovie.Released}
                runtime={headerMovie.Runtime}
                writer={headerMovie.Writer}
                metascore={headerMovie.Metascore}
            />
        )
    }
    else {
        return (
            <>

                <div className="actor-movies">
                    <div className="id-card">
                        <img src={actorDetails.profile_path ? `https://image.tmdb.org/t/p/w200${actorDetails.profile_path}` : "Default Profile Picture"} alt={actorDetails.name} className="actor-picture" />
                        <h3 className="actor-name">{actorDetails.name}</h3>
                        <p className="actor-birthyear">Birth-Year : {actorDetails.birthday.split('-', 1)}</p>
                        <p className="actor-birthplace">Birth-Place : {actorDetails.place_of_birth}</p>
                        {
                            actorDetails.deathday && (<p >Death : {actorDetails.deathday.split('-', 1)}</p>)
                        }
                    </div>

                    <div className="Description">
                        <p className="actor-biography"><strong>Biography</strong> : {actorDetails.biography}</p>
                        <strong className="contribution">Contributions: </strong>
                        <div className="work-container">

                            <br></br>
                            {knownFor.map(work => (
                                <div className="work" key={work.id}>
                                    <img src={work.backdrop_path ? `https://image.tmdb.org/t/p/w200${work.backdrop_path}` : "/default-profile.png"} alt={work.title} onClick={() => handleDetails(work.title)} />
                                    <p onClick={() => handleDetails(work.title || work.name)}>{work.title || work.name} </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </>
        )
    }

}
export default ActorMovies;