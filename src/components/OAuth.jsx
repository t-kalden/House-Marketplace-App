import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc,serverTimestamp } from 'firebase/firestore'
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            //checking for user in db
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            //if doesnt exist create user
            if(!docSnap.exists()) {
                await setDoc(doc(db,'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
            
            toast.success(`Successfully signed ${location.pathname === '/sign-up' ? 'up' : 'in'} with Google`)
        } catch (error) {
            console.log(error);
            toast.error(`Error signing ${location.pathname === '/sign-up' ? 'up' : 'in'} with Google.`)
        }
    }

  return (
    <div className="socialLogin">
        <p>Sign { location.pathname === '/sign-up' ? 'up' : 'in' } with</p>
        <button className="socialIconDiv" 
            onClick={onGoogleClick}>
            <img src={googleIcon} alt="Google" className="socialIconImg"/>
        </button>
    </div>
    
  )
}

export default OAuth