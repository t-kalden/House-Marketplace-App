import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SignIn() {
  const [ showPassword, setShowPassword ] = useState(false)
  const [ formData, setFormData ] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState)=> ({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if(userCredential.user) {
        navigate('/')
      }
      toast('Successfully signed in')
    } catch (error) {
      toast.error('Username or password incorrect')
    }
  }

  return(
    <>
    <div className="pageContainer">

      <header>
        <p className="pageHeader">Welcome Back</p>
      </header>

      <form onSubmit={ onSubmit }>
        <input type="text" name="email" id="email" 
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
        <Link to='/forgot-password' className="forgotPasswordLink">Forgot Password</Link>
        <div className="signInBar">
          <p className="signInText">Sign In</p>
          <button className="signInButton">
            <ArrowRightIcon fill="#fff" width='34px' height='34px'/>
          </button>
        </div>
      </form>

      {/* Google OAuth */}
      <Link to='/sign-up' className="registerLink">Sign Up Instead</Link>
    </div>
    </>
  )
}
  
export default SignIn