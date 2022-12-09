import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() { 
  const [ email, setEmail ] = useState('')

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email) 
      toast.success('Reset link was sent to your email! ')
    } catch (error) {
      toast.error('Unable to send reset link to email.')
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={ onSubmit }>
          <input type="email" name="email" id="email" placeholder="email" 
            className="emailInput" value={ email } 
            onChange={ onChange } 
          />
          <Link className="forgotPasswordLink" to='/sign-in'>Sign In</Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
  
export default ForgotPassword