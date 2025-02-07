import React, { useState,useEffect } from 'react'
import Search from './components/Search'

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = 'https://api.themoviedb.org/3';

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers:{ 
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`

    }
  }
  
  const fetchMovies = async () => {
    setIsLoading(true);
    

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?language=en-US&page=8&sort_by=popularity.desc`;

      const response = await fetch(endpoint,API_OPTIONS);


      //console.log(response);

      const data = await response.json()

      console.log(data)

      if(data.Response == 'false'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || [])
      
    } catch (error) {
      console.log(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movie')
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();

  }, [])
  

  return (
    <main>
    <div className='pattern'/>
    <div className="wrapper">
        <header>
          <h1>
            <img src="./hero.png" alt="hero" />
            <span className='text-gradient'>Movies</span> like you'll never them before
          </h1>
          <Search  searchTerm = {searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        
        
        <section className='all-movies'>
          <h2>All Movies</h2>

          
          { isLoading ? (
            <p className='text-white'>Loading...</p>

          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie) => (
                <p className='text-white'>{movie.title}</p>
              ))}
            </ul>
          )

          }
        </section>
    </div>
    </main>
    
  )
}

export default App