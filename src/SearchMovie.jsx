import React, { useContext } from 'react'
import {ApiContext} from './ApiContext';
import './SearchMovie.css';
function SearchMovie({ posterUrl, title, year }) {
    const {api,apiFetcher}=useContext(ApiContext);
    function handleDetails(){
          const movieDetails=api+'t='+title;
            apiFetcher(movieDetails);
    }
  return (
 

      <div className="search-result">
      <img src={posterUrl} alt={title} className="search-result-img" onClick={handleDetails}/>
      <div className="search-result-content">
        <h3 className="search-result-title">{title}</h3>
        <p className="search-result-rating">Year: {year}</p>
      </div>
    </div>
    
      
  );
}
export default SearchMovie;
