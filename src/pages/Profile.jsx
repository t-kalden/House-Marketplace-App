import { useState, useEffect } from "react"
import { getAuth,  updateProfile } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import ListingItem from "../components/ListingItem"
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


function Profile() {
  const auth = getAuth()
  const [ changeDetails, setChangeDetails ] = useState(false)
  const [listings, setListings ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [ formData, setFormData ] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [ auth.currentUser.uid ])

  const onLogOut = () => {
    auth.signOut()
    navigate('/')
    toast.success('Successfully signed out! See you soon!')
  }

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        //update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName : name
        })
      }

      //update in firestore 
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name
      })

      toast('Successfully updated name!')
    } catch (error) {
      toast.error('Could not update profile details.')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]:e.target.value
    }))
  }

  const onDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this listing?')) {
      await deleteDoc(doc(db, 'listings', id))
      const updatedListings = listings.filter((listing) => listing.id !== id)

      setListings(updatedListings)
      toast.success('Listing has been deleted!')
    }
  }

  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button className="logOut" onClick={onLogOut}>Log Out</button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails" 
          onClick={ () => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          } }>
          { changeDetails ? 'Done' : 'Change'} 
        </p>
      </div>

      <div className="profileCard">
        <form>
          <input type="text" name="name" id="name" 
          className={ !changeDetails ? 'profileName' : 'profileNameActive' }
          disabled={ !changeDetails } value={ name }
          onChange={onChange}
          />
          <input type="email" name="email" id="email" 
          className={ !changeDetails ? 'profileEmail' : 'profileEmailActive' }
          disabled={ !changeDetails } value={ email }
          onChange={onChange}
          />
        </form>
      </div>

      <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt="home"/>
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt="arrow right"  />
      </Link>

      {!loading && listings?.length > 0 && (
        <>
          <p className="listingText">Your Listings</p>
          <ul className="listingsList">
            {
              listings.map((listing) => (
                <ListingItem 
                  key={listing.id} 
                  listing={listing.data}
                  id={listing.id}
                  onDelete={()=> onDelete(listing.id)}
                />
              ))
            }
          </ul>
        </>
      )}

    </main>
  </div>
}
  
  export default Profile