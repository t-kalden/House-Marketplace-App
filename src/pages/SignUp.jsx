import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from "react-toastify"
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
  const [ showPassword, setShowPassword ] = useState(false)
  const [ formData, setFormData ] = useState({
    name:'',
    email: '',
    password: ''
  })

  const { name, email, password } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState)=> ({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try{
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName : name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy) 

      navigate('/')
      toast('Successfully signed up')
    } catch (error) {
      toast.error('Something went wrong with registration.')
    }
  }
  return(
    <>
    <div className="pageContainer">

      <header>
        <p className="pageHeader">Welcome Back</p>
      </header>

      <form onSubmit={onSubmit}>
        <input type="text" name="name" id="name" 
              className="nameInput" 
              placeholder="Name" value={name}
              onChange={onChange}/>

        <input type="email" name="email" id="email" 
            className="emailInput" 
            placeholder="E-mail" value={email}
            onChange={onChange}/>

        <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} 
            className="passwordInput" placeholder="Password"
            id="password" value={password}
            onChange={onChange}/>

            <img src={visibilityIcon} alt="Show Password" 
                className="showPassword" 
                onClick={(prevState) => setShowPassword(prevState, !showPassword)}  
              />
        </div>

        <div className="signUpBar">
          <p className="signUpText">Sign Up</p>
          <button className="signUpButton">
            <ArrowRightIcon fill="#fff" width='34px' height='34px'/>
          </button>
        </div>
      </form>

      {/* Google OAuth */}
      <Link to='/sign-in' className="registerLink">Sign In Instead</Link>
    </div>
    </>
  )
}
  
export default SignUp