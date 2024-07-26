import { useEffect, useState } from "react"
import firebaseAppConfig from "../../util/firebase-config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate, Outlet, Navigate } from "react-router-dom"
import { getFirestore, getDocs, where, query, collection, getDoc } from "firebase/firestore"
import { useLocation } from "react-router-dom"

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)

const AdminGuard = ()=>{
    const navigate = useNavigate()
    const [session, setSession] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const location = useLocation()

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user)
            {
                setSession(user)
            }
            else {
                navigate('/')
                return false
            }
        })
    }, [])

    useEffect(()=>{
        const req = async ()=>{
            if(session)
            {
                const col = collection(db, "customers")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                let role = null
                snapshot.forEach((doc)=>{
                    const customer = doc.data()
                    role = customer.role
                })

                if(role === "user")
                {
                    navigate("/profile")
                    return false
                }
                else {
                    setIsAdmin(true)
                }
            }
        }
        req()
    } ,[session])

    if(location.pathname === "/admin")
        return <Navigate to="/admin/dashboard" />

    if(isAdmin) 
        return <Outlet />

    return (
        <div className="h-screen flex items-center justify-center">
            <span className="relative flex h-16 w-16">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-16 w-16 bg-sky-500"></span>
            </span>
        </div>
    )
}

export default AdminGuard