import { useEffect, useState } from "react"
import firebaseAppConfig from "../../util/firebase-config" 
import { getAuth,onAuthStateChanged } from "firebase/auth" 
import { useNavigate,Outlet } from "react-router-dom"
import { getFirestore,where,query,collection,getDocs } from "firebase/firestore"

const auth = getAuth(firebaseAppConfig)
const AdminGuard = ()=>{
    const navigate = useNavigate()
    const [session,setSession] = useState(null)
    const db=getFirestore(firebaseAppConfig)
    const [loader ,setLoader] = useState(true)
    const [isAdmin , setIsAdmin] = useState(false)

    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user)
                {
                    setSession(user)
                }
                else
                {
                    navigate('/')
                    return false 
                }
        })
    },[])

    useEffect(()=>{
        const req = async()=>{
            if(session)
                {
                    const col= collection(db,"customers")
                    const q=query(col,where("userId","==",session.uid))
                    const snapshot = await getDocs(q)
                    let role =null
                    snapshot.forEach((doc)=>{
                        const customer =doc.data()
                        role =customer.role 
                    })
                    if(role === "user")
                        {
                            navigate("/profile") 
                            return false
                        }
                        else 
                        {
                           setIsAdmin(true)
                        }

                }

        }
        req()
    },[session])
    if(isAdmin)return <Outlet/>
    return(
        <div className="h-screen flex items-center justify-center">
                    <span class="relative flex h-16 w-16">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-16 w-16 bg-sky-500"></span>
        </span>

        </div>
    )
}
export default AdminGuard