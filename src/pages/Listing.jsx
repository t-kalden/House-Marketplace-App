import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import { getAuth } from "firebase/auth"
import Spinner from "../components/Spinner"
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing() {
    const [ listing, setListing ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ shareLinkCopied, setShareLinkCopied ] = useState(null)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId) 
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                console.log(docSnap.data());
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [navigate, params.listingId])


    return (loading) ? <Spinner/> : (
        <main>
            {/* SLIDESHOW */}

            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(()=> {
                    setShareLinkCopied(false)
                }, 2000)
            }}>
                <img src={shareIcon} alt="share" />
            </div>
            
            { shareLinkCopied && <p className="linkCopied">Copied to your clipboard</p> }

            <div className="listingDetails">
                <p className="listingName">{ listing.name } - $
                {
                    listing.offer 
                        ? listing.discountedPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                        : listing.regularPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                {
                    listing.offer && (
                        <p className="discountPrice">
                            ${ listing.regularPrice - listing.discountedPrice } discount
                        </p>
                    )
                }
                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>
                        {listing.parking && 'Parking spot available'}
                    </li>
                    <li>
                        {listing.furnished && 'Fully furnished'}
                    </li>
                </ul>

                <p className="listingLocationTitle">Location</p>
                {/* Map */}

                {auth.currentUser?.uid !== listing.userRef &&(
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton' >
                        Contact Owner
                    </Link>
                )}
            </div>
        </main>
    )
}

export default Listing