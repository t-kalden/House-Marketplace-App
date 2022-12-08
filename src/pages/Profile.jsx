import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
function Profile() {
  const auth = getAuth()

  const [ formData, setFormData ] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const navigate = useNavigate()

  const onLogOut = () => {
    auth.signOut()
    navigate('/')
  }

  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button className="logOut" onClick={onLogOut}>Log Out</button>
    </header>
  </div>
}
  
  export default Profile