import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import firebaseAppConfig from "../util/firebase-config"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getFirestore,addDoc,collection ,serverTimestamp} from "firebase/firestore"

const db=getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)

const Signup = ()=>{
    const navigate = useNavigate()
    const [passwordType, setPasswordType] = useState("password")
    const [error, setError] = useState(null)
    const [loader, setLoader] = useState(false)

    const [formValue, setFormValue] = useState({
        fullname: '',
        email: '',
        mobile:'' ,
        password: ''
    })

    const signup = async (e)=>{
        try {
            e.preventDefault()
            setLoader(true)
          const userCre=  await createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
            await updateProfile(auth.currentUser, {displayName: formValue.fullname})
           await addDoc(collection(db,"customers"),{
                email :formValue.email ,
                customerName : formValue.fullname,
                userId:userCre.user.uid ,
                mobile :formValue.mobile,
                role:'user' ,
                createAt:serverTimestamp()
            })

            navigate('/')
        }
        catch(err)
        {
            setError(err.message)
        }
        finally {
            setLoader(false)
        }
    }

    const handleOnChange = (e)=>{
        const input = e.target
        const name = input.name
        const value = input.value
        setFormValue({
            ...formValue,
           [name]: value 
        })
        setError(null)
    }

    return (
        <div className="grid md:grid-cols-2 md:h-screen md:overflow-hidden animate__animated animate__fadeIn">
            <img src="/images/signup.jpg" className="w-full md:h-full h-24 object-cover" />
            <div className="flex flex-col md:p-16 p-8">
                <h1 className="text-4xl font-bold">New User</h1>
                <p className="text-lg text-gray-600">Create your account to start shopping</p>
                <form className="mt-8 space-y-6" onSubmit={signup}>
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Fullname</label>
                        <input
                            onChange={handleOnChange}
                            required
                            name="fullname"
                            placeholder="Er Saurav"
                            className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Email id</label>
                        <input 
                            onChange={handleOnChange}
                            required
                            type="email"
                            name="email"
                            placeholder="example@mail.com"
                            className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                     <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Mobile</label>
                        <input 
                            onChange={handleOnChange}
                            required
                            type="number"
                            name="mobile"
                            placeholder="0123456789"
                            className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col relative">
                        <label className="font-semibold text-lg mb-1">Password</label>
                        <input 
                            onChange={handleOnChange}
                            required
                            type={passwordType}
                            name="password"
                            placeholder="********"
                            className="p-3 border border-gray-300 rounded"
                        />
                        <button onClick={()=>setPasswordType(passwordType === "password" ? "text" : "password")} type="button" className="absolute top-11 right-4 w-8 h-8 rounded-full hover:bg-blue-200 hover:text-blue-600">
                            {
                                passwordType === "password" ? 
                                <i className="ri-eye-line"></i> 
                                : 
                                <i className="ri-eye-off-line"></i>
                            }
                        </button>
                    </div>
                    {
                        loader ? 
                        <h1 className="text-lg font-semibold text-gray-600">Loading...</h1>
                        :
                        <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-rose-600">Signup</button>
                    }
                </form>

                <div className="mt-2">
                    Already have an account ? <Link to="/login" className="text-blue-600 font-semibold">Signin</Link>
                </div>
            
                {
                    error && 
                    <div className="flex justify-between items-center mt-2 bg-rose-600 p-3 rounded shadow text-white font-semibold animate__animated animate__pulse">
                        <p>{error}</p>
                        <button onClick={()=>setError(null)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Signup