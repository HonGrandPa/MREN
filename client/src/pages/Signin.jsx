import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux';
import {signInStart, signInFailure, signInSuccess} from '../redux/user/userSlice'
import OAuth from '../components/OAuth';

const Signin = () => {

  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const {isLoading, error} = useSelector((state) => state.user); //inistial 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData, // <-- previos obj
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        // setIsLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      // setIsLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      navigate('/');

    } catch (err) {
      // setIsLoading(false);
      // setError(err);
      dispatch(signInFailure(err.message));
    }
    //recap api/index.js we set up middleware handdle error function so if there is we will geting error object

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='text' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={isLoading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{isLoading ? 'loadiing....' : 'SIGN IN'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to="/signup"><span className='text-blue-700'>Sign up</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signin
