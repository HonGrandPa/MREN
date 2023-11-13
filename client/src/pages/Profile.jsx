import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js';

const Profile = () => {

  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(0);
  const [fileUpLoadErr, setFileUpLoadErr] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);
  console.log(image);
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
          ((downloadURL) => setFormData({ ...formData, avatar: downloadURL })
          );
      }
    );

  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} alt='profile-avatar' />
        <p className='self-center text-sm'>{fileUpLoadErr ? (<span className='text-red-700'>Error Image Upload (image must be less than 2MB)</span>)
          : image > 0 && image < 100 ? (<span className='text-slate-600'>Uploading{image}%</span>) 
          : image === 100 ? (<span className='text-green-600'>Upload Complete</span>)
          : ""} </p>
        <input type='text' placeholder='username' id='userName' className='boder p-3 rounded-lg' />
        <input type='email' placeholder='email' id='email' className='boder p-3 rounded-lg' />
        <input type='password' placeholder='password' id='password' className='boder p-3 rounded-lg' />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>UPDATE</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile
