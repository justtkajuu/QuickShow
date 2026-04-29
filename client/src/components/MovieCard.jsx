import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import TimeFormat from '../lib/TimeFormat'
import { useAppContext } from '../context/AppContext'

const MovieCard = ({ movie }) => {
  const { image_base_url } = useAppContext()
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/movies/${movie._id}`)
    window.scrollTo(0, 0)
  }

  return (
    <div
      onClick={handleNavigate}
      className='flex flex-col justify-between p-4 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full cursor-pointer'
    >
      <img
        src={image_base_url + movie.backdrop_path}
        alt=""
        className='rounded-lg h-52 w-full object-cover object-right-bottom'
      />

      <p className='font-semibold mt-2 truncate'>{movie.title}</p>

      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres?.slice(0, 2).map(g => g.name).join(" | ")} •{" "}
        {TimeFormat(movie.runtime)}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          onClick={(e) => {
            e.stopPropagation() // 🔥 important (card click double trigger na ho)
            handleNavigate()
          }}
          className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
        >
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className='w-4 h-4 text-primary fill-primary' />
          {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </div>
  )
}

export default MovieCard