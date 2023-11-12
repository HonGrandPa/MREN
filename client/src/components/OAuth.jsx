import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handdleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {

                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ userName: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            })
            const data = await res.json();
            dispatch(signInSuccess(data)); // <---set error to null and isloading to false 
            navigate('/');
        } catch (error) {

            console.log('Could not sign in with google', error);
        }
    }

    return (
        <div>
            <button onClick={handdleGoogleClick} type='button' className='bg-red-700 text-white w-full p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
        </div>
    )
}

export default OAuth
