import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, } from 'react-redux'
import { useRef } from 'react';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js';
import { updateUserStart, 
         updateUserSuccess, 
         updateUserFailure, 
         deleteUserFaulure, 
         deleteUserSuccess, 
         deleteUserStart,
         signOutUserFaulure,
         signOutUserSuccess, 
         signOutUserStart } from '../redux/user/userSlice.js';


const Profile = () => {

  const fileRef = useRef(null);
  const { currentUser, isLoading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(0);
  const [fileUpLoadErr, setFileUpLoadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
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

    setFormData({...formData, [e.target.id]: e.target.value})

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
        if(data.success === false) {
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
        if(data.success === false) {
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
        <input type='text' placeholder='username' defaultValue={currentUser.userName} id='userName' className='boder p-3 rounded-lg' onChange={handleChange}/>
        <input type='email' placeholder='email' defaultValue={currentUser.email} id='email' className='boder p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' placeholder='password' id='password' className='boder p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={isLoading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{isLoading ? "LOADING..." : "UPDATE"}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut}className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-300 mt-5'>{updateSuccess ? "User is updated": ""}</p>
    </div>
  )
}

export default Profile
