import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

function CreateListing() {
    const [ geolocationEnabled, setGeolocationEnabled ] = useState(true)
    const [ loading, setLoading ] = useState(false)
    const [ formData, setFormData ] = useState({
        type:'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {

        },
        latitude: 0,
        longitude: 0,
    })

    const {type, name, bedrooms,bathrooms, parking, 
            furnished, address, offer, regularPrice,
            discountedPrice, images, latitude, longitude} = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(formData);
    }
    const onMutate = (e) => {
        let bool = null

        if(e.target.value === 'true') { bool = true}
        if(e.target.value === 'false') { bool = false}

        // files
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        } else {
            setFormData((prevState) =>({
                ...prevState,
                [e.target.id] : bool ?? e.target.value
            }))            
        }

    }   


    if(loading) {
        return <Spinner />
    }

    return (
        <div className="profile">
            <header>
                <p className="pageHeader">
                    Create a listing
                </p>
            </header>

            <main>
                <form onSubmit={ onSubmit }>
                    
                    {/* sell/rent label and buttons */}
                    <label className="type">Sell / Rent</label>
                    <button 
                        className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                        id='type' 
                        value='sale' 
                        onClick={ onMutate }
                        >
                        Sell
                    </button>
                    <button 
                        className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                        id='type' 
                        value='rent' 
                        onClick={ onMutate }
                        >
                        Rent
                    </button>
                    
                    {/* name label and input */}
                    <label className="formLabel">Name</label>
                    <input 
                        type="text" 
                        className="formInputName"
                        id="name" 
                        value={ name } 
                        onChange={ onMutate }    
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    {/* bedroom and bathroom container */}
                    <div className="formRooms flex">
                        <div>
                            <label className="formLabel">Bedrooms</label>
                            <input 
                                type="number"
                                id="bedrooms" 
                                value={bedrooms}
                                className="formInputSmall" 
                                onChange={ onMutate }
                                min='1'
                                max='20'
                                required
                            />
                        </div>
                        <div>
                            <label className="formLabel">Bathrooms</label>
                            <input 
                                type="number"
                                id="bathrooms" 
                                value={bathrooms}
                                className="formInputSmall" 
                                onChange={ onMutate }
                                min='1'
                                max='20'
                                required
                            />
                        </div>
                    </div>

                    {/* parking container */}
                    <div className="formButtons">
                        <label className="formLabel">Parking</label>
                        <button 
                            type='button'
                            id='parking'
                            value={ true }
                            onClick={ onMutate }
                            className= {parking ? 'formButtonActive' : 'formButton'}>
                            Yes
                        </button>
                        <button
                            className= {
                                !parking && parking !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='parking'
                            value={ false }
                            onClick={ onMutate } 
                        >
                            No
                        </button>
                    </div>

                    {/* furnished container */}
                    <div className="formButtons">
                        <label className="formLabel">Furnished</label>

                        <button 
                            type='button'
                            id='furnished'
                            value={ true }
                            onClick={ onMutate }
                            className= {furnished ? 'formButtonActive' : 'formButton'}>
                            Yes
                        </button>
                        <button
                            className= {
                                !furnished && furnished !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='furnished'
                            value={ false }
                            onClick={ onMutate } 
                        >
                            No
                        </button>
                    </div>

                    {/* Address  */}
                    <label className="formLabel">Address</label>
                    <textarea
                        className="formInputAddress"
                        type='text'
                        id='address'
                        value={ address }
                        onChange={ onMutate }
                        required
                    />
                    {/* geolocation disabeled */}
                    {!geolocationEnabled && (
                        <div className='formLatLng flex'>
                        <div>
                          <label className='formLabel'>Latitude</label>
                          <input
                            className='formInputSmall'
                            type='number'
                            id='latitude'
                            value={latitude}
                            onChange={onMutate}
                            required
                          />
                        </div>
                        <div>
                          <label className='formLabel'>Longitude</label>
                          <input
                            className='formInputSmall'
                            type='number'
                            id='longitude'
                            value={longitude}
                            onChange={onMutate}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* offer container */}
                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button
                        className={offer ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onMutate}
                        >
                        Yes
                        </button>
                        <button
                        className={
                            !offer && offer !== null ? 'formButtonActive' : 'formButton'
                        }
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onMutate}
                        >
                        No
                        </button>
                    </div>

                    {/* regular / discounted */}
                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                        className='formInputSmall'
                        type='number'
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='50'
                        max='750000000'
                        required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {offer && (
                        <>
                        <label className='formLabel'>Discounted Price</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={offer}
                        />
                        </>
                    )}
                    
                    {/* image upload */}
                    <label className='formLabel'>Images</label>
                        <p className='imagesInfo'>
                            The first image will be the cover (max 6).
                        </p>
                        <input
                            className='formInputFile'
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max='6'
                            accept='.jpg,.png,.jpeg'
                            multiple
                            required
                        />

                        {/* submit */}
                    <button type='submit' className='primaryButton createListingButton'>
                        Create Listing
                    </button>

                </form>
            </main>
        </div>
    )
}

export default CreateListing