import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [search, setSearch] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    urlParams.set('searchTerm', search); //set seartTerm=....
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    console.log(urlParams)
    if (searchTermFromUrl) {
      setSearch(searchTermFromUrl);
    }
  }, [window.location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500 mr-1'>Home</span>
            
            <span className='text-slate-700'>Harbor</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input type='text' placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'><li className='hidden sm:inline text-salte-700 hover:underline'>Home</li></Link>
          <Link to='/about'><li className='hidden sm:inline text-salte-700 hover:underline'>About</li></Link>
          <Link to='/Profile'>{currentUser ? <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='user-profile-pic' /> : <li className='text-salte-700 hover:underline'>Sign in</li>}</Link>
        </ul>
      </div>
    </header>

  )
}

export default Header
