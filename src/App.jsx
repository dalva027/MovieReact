import React, { useState,useEffect } from 'react'
import Search from './components/Search'
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite';

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbSearchTerm, setDbSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])

  const API_BASE_URL = 'https://api.themoviedb.org/3';

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers:{ 
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`

    }
  }

  useDebounce( () => setDbSearchTerm(searchTerm), 1500, [searchTerm])
  
  const fetchMovies = async (query = '') => {
    setIsLoading(true);    

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

      if(query && data.results.length > 0 ){
        await updateSearchCount(query,data.results[0])
      }
      
    } catch (error) {
      console.log(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movie')
    }finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
     try {
        const movies = await getTrendingMovies();
        
        setTrendingMovies(movies);

     } catch (error) {
        console.log(error);
     }
  }

  useEffect(() => {
    fetchMovies(dbSearchTerm);
  }, [dbSearchTerm])

  useEffect(()=> {
    loadTrendingMovies();
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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title}/> 

                </li>
              ))}

            </ul>

          </section>
        )}
        
        
        <section className='all-movies'>
          <h2 className='mt-10'>All Movies</h2>

          
          { isLoading ? (
            <p className='text-white'>Loading...</p>

          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
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