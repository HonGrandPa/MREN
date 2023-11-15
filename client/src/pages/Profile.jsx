import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, } from 'react-redux'
import { useRef } from 'react';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFaulure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFaulure,
  signOutUserSuccess,
  signOutUserStart
} from '../redux/user/userSlice.js';
import { Link } from "react-router-dom"


const Profile = () => {

  const fileRef = useRef(null);
  const { currentUser, isLoading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(0);
  const [fileUpLoadErr, setFileUpLoadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingError] = useState(false);
  const [showListings, setShowListing] = useState(true);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();
  //console.log(formData);
  //console.log(image);
  // console.log(fileUpLoadErr);
  // console.log(file);

  // firebase sotrage :
  // service firebase.storage 
  // allow read, 
  // write: if request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {

    if (file) {

      handleFileUpload(file);
    }

  }, [file]);

  const handleFileUpload = (file) => {

    // Create a root ref
    const storage = getStorage(app);
    // Get store file name from the user 
    const fileName = new Date().getTime() + file.name; //<--make it unique
    // Create a ref to the images 
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //to track the state change
    uploadTask.on(
      'state_change',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress} % dones`);
        setImage(Math.round(progress));
      },
      (err) => {
        setFileUpLoadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => setFormData({ ...formData, avatar: downloadURL }) //if getDownloadURL success -> store url in formdata
          );
      }
    );

  };

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.id]: e.target.value })

  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      //set isloading to true
      dispatch(updateUserStart());
      //set proxy 'api' and target to localhost 300 
      const response = await fetch(`api/user/update/${currentUser._id}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) //this is when data sending to backend
      });
      //converting data (success component only exit when error hepen other wihe defaue is undefined)
      const data = await response.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      //if success => return the data 
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));

    }
  }

  const handleDelete = async () => {

    try {
      dispatch(deleteUserStart());
      const response = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = response.json();
      if (data.success === false) {
        dispatch(deleteUserFaulure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (err) {
      dispatch(deleteUserFaulure(err.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await fetch('/api/auth/signout');
      const data = await response.json();
      if (data.success === false) {
        dispatch(signOutUserFaulure(data.message));
        return
      }
      dispatch(signOutUserSuccess(data));
    } catch (err) {
      dispatch(signOutUserFaulure(err.message))
    }
  }

  const handleShowListings = async () => {

    try {
      setShowListingError(false);
      const response = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await response.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data)
      setShowListing(false)
      
    } catch (err) {
      setShowListingError(true);
    }
  }

  const handleHideListings = () => {
    setShowListing(true)
  }

const handleListingDelete = async (listingId) => {
  
  try {
    const response = await fetch(`/api/listing/delete/${listingId}`, 
    {
      method: "DELETE"
    })

    const data = await response.json();
    if (data.success === false) {
      console.log(data.message);
      return;
    } 
    //setUserListings((prev) => prev.filter((list) => list._id !== listingId ));
    setUserListings(userListings.filter((list) => list._id !== listingId ));

  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} alt='profile-avatar' />
        <p className='self-center text-sm'>{fileUpLoadErr ? (<span className='text-red-700'>Error Image Upload (image must be less than 2MB)</span>)
          : image > 0 && image < 100 ? (<span className='text-slate-600'>Uploading{image}%</span>)
            : image === 100 ? (<span className='text-green-600'>Upload Complete</span>)
              : ""} </p>
        <input type='text' placeholder='username' defaultValue={currentUser.userName} id='userName' className='boder p-3 rounded-lg' onChange={handleChange} />
        <input type='email' placeholder='email' defaultValue={currentUser.email} id='email' className='boder p-3 rounded-lg' onChange={handleChange} />
        <input type='password' placeholder='password' id='password' className='boder p-3 rounded-lg' onChange={handleChange} />
        <button disabled={isLoading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{isLoading ? "LOADING..." : "UPDATE"}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <div className='flex flex-col justify-center items-center gap-5 mb-5'>
        <p className='text-red-700 mt-5'>{error ? error : ""}</p>
        <p className='text-green-500 mt-5'>{updateSuccess ? "User is updated" : ""}</p>
        {showListings && <button onClick={handleShowListings} className='text-green-700 w-32'>Show Listings</button>}
        {!showListings && <button onClick={handleHideListings} className='text-green-700 w-32'>Hide Listings</button>}
        <p className='text-red-700 mt-5'>{showListingsError ? "Error showing listing" : ""}</p>
      </div>


      {!showListings && userListings && userListings.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listing</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className='border rounded-xl p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
                <img className='h-16 w-16 object-contain' src={listing.imageUrls[0]} alt='listing-img' />
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
               <Link to={`/update-listing/${listing._id}`}><button className='text-green-700 uppercase'>Edit</button></Link> 
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}

export default Profile
