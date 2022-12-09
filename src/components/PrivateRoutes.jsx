import { Navigate, Outlet } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Spinner from "./Spinner"
const PrivateRoutes = () => {
    const { loggedIn, checkingStatus } = useAuthStatus()


    return checkingStatus ? <Spinner/> : (loggedIn ? <Outlet /> : <Navigate to='/sign-in'/>)
}

export default PrivateRoutes