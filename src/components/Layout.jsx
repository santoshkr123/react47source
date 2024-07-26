import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import firebaseAppConfig from '../util/firebase-config'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore"
const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)

const Layout = ({children, update})=>{
    const [open, setOpen] = useState(false)
    const [accountMenu, setAccountMenu] = useState(false)
    const [session, setSession] = useState(null)
    const [cartCount, setCartCount] = useState(0)
    const [role, setRole] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user)
            {
                setSession(user)
            }
            else {
                setSession(false)
            }
        })
    },[])

    useEffect(()=>{
        if(session)
        {
            const req = async ()=>{
                const col = collection(db, "carts")
                const q = query(col, where("userId", "==", session.uid))
                const snapshop = await getDocs(q)
                setCartCount(snapshop.size)
            }
            req()
        }
    }, [session, update])

    useEffect(()=>{
        if(session)
        {
            const req = async ()=>{
                const col = collection(db, "customers")
                const q = query(col, where("userId", "==", session.uid))
                const snapshop = await getDocs(q)
                snapshop.forEach((doc)=>{
                    const customer = doc.data()
                    setRole(customer.role)
                })
            }
            req()
        }
    }, [session])

    const menus = [
        {
            label: "Home",
            href: '/'
        },
        {
            label: "Products",
            href: '/products'
        },
        {
            label: "Category",
            href: '/category'
        },
        {
            label: "Contact us",
            href: '/contact-us'
        }
    ]

    const mobileLink = (href)=>{
        navigate(href)
        setOpen(false)
    }

    if(session === null)
    return (
        <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
            <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
            </span>
        </div>
    )

    return (
        <div>
            <nav className="sticky top-0 left-0 shadow-lg bg-white z-50">
                <div className="w-10/12 mx-auto flex items-center justify-between">
                    <img 
                        src="/images/logo.png"
                        className="w-[100px]"
                    />
                    
                    <button className="md:hidden" onClick={()=>setOpen(!open)}>
                        <i className="ri-menu-3-fill text-3xl"></i>
                    </button>

                    <ul className="md:flex gap-6 items-center hidden">
                        {
                            menus.map((item, index)=>(
                                <li key={index}>
                                    <Link 
                                        to={item.href}
                                        className="block py-8 text-center hover:bg-blue-600 w-[100px] hover:text-white"
                                    >{item.label}</Link>
                                </li>
                            ))
                        }
                        {
                            (session && cartCount > 0) && 
                            <Link to="/cart" className="relative">
                                <i className="ri-shopping-cart-line text-xl"></i>
                                <div className="absolute -top-4 -right-4 font-bold text-white text-xs bg-rose-600 rounded-full w-6 h-6 flex justify-center items-center">{cartCount}</div>
                            </Link>
                        }
                        {
                            !session && 
                            <>
                                <Link 
                                    className="block py-8 text-center hover:bg-blue-600 w-[100px] hover:text-white"
                                    to="/login"
                                >Login</Link>

                                <Link 
                                    className="bg-blue-600 py-3 px-10 text-md font-semibold text-white block text-center hover:bg-rose-600 hover:text-white"
                                    to="/signup"
                                >Signup</Link>
                            </>
                        }

                        {
                            session && 
                            <button className="relative" onClick={()=>setAccountMenu(!accountMenu)}>
                                <img src={session.photoURL ? session.photoURL : "/images/avt.avif"} className="w-10 h-10 rounded-full" />
                                {
                                    accountMenu && 
                                    <div className="flex flex-col items-start animate__animated animate__fadeIn w-[150px] py-3 bg-white absolute top-12 right-0 shadow-xl">
                                        {
                                            (role && role === "admin") &&
                                            <Link to="/admin/dashboard" className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                                <i className="ri-file-shield-2-line mr-2"></i>
                                                Admin Panel
                                            </Link>
                                        }
                                        
                                        <Link to="/profile" className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                            <i className="ri-user-line mr-2"></i>
                                            My Profile
                                        </Link>

                                        <Link to="/cart" className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                            <i className="ri-shopping-cart-line mr-2"></i>
                                            Cart
                                        </Link>

                                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>signOut(auth)}> 
                                            <i className="ri-logout-circle-r-line mr-2"></i>
                                            Logout
                                        </button>
                                    </div>
                                }
                            </button>
                        }
                    </ul>
                </div>
            </nav>
            <div>
                {children}
            </div>
            <footer className="bg-orange-600 py-16">
                <div className="w-10/12 mx-auto grid md:grid-cols-4 md:gap-0 gap-8">
                    <div>
                        <h1 className="text-white font-semibold text-2xl mb-3">Website Links</h1>
                        <ul className="space-y-2 text-slate-50">
                            {
                                menus.map((item, index)=>(
                                    <li key={index}>
                                        <Link to={item.href}>{item.label}</Link>
                                    </li>
                                ))
                            }
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h1 className="text-white font-semibold text-2xl mb-3">Follow us</h1>
                        <ul className="space-y-2 text-slate-50">
                            <li><Link to="/">Facebook</Link></li>
                            <li><Link to="/">Youtube</Link></li>
                            <li><Link to="/">Twitter</Link></li>
                            <li><Link to="/">Linkedin</Link></li>
                            <li><Link to="/">Instagram</Link></li>
                        </ul>
                    </div>
                    <div className="pr-8">
                        <h1 className="text-white font-semibold text-2xl mb-3">Brand Details</h1>
                        <p className="text-slate-50 mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad saepe cupidium est velit excepturi sit corrupti tempora officia recusandae!</p>
                        <img 
                            src="/images/logo.png"
                            className="w-[100px]"
                        />
                    </div>
                    <div>
                        <h1 className="text-white font-semibold text-2xl mb-3">Contact us</h1>
                        <form className="space-y-4">
                            <input 
                                required
                                name="fullname"
                                className="bg-white w-full rounded p-3"
                                placeholder="Your name"
                            />

                            <input 
                                required
                                type="email"
                                name="email"
                                className="bg-white w-full rounded p-3"
                                placeholder="Enter email id"
                            />

                            <textarea 
                                required
                                name="message"
                                className="bg-white w-full rounded p-3"
                                placeholder="Message"
                                rows={3}
                            />

                            <button className="bg-black text-white py-3 px-6 rounded">Submit</button>
                        </form>
                    </div>
                </div>
            </footer>

           
            <aside 
                className="overflow-hidden md:hidden bg-slate-900 shadow-lg fixed top-0 left-0 h-full z-50"
                style={{
                    width: open ? 250 : 0,
                    transition: '0.3s'
                }}
            >
                <div className="flex flex-col p-8 gap-6">
                {
                    session && 
                    <button className="relative" onClick={()=>setAccountMenu(!accountMenu)}>
                        <div className="flex items-center gap-3">
                            <img src={session.photoURL ? session.photoURL : "/images/avt.avif"} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="text-white capitalize text-left">{session.displayName}</p>
                                <p className="text-white">{session.email}</p>
                            </div>
                        </div>
                        {
                            accountMenu && 
                            <div className="flex flex-col items-start animate__animated animate__fadeIn w-[150px] py-3 bg-white absolute top-12 right-0 shadow-xl">
                                <Link to="/profile" className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                    <i className="ri-user-line mr-2"></i>
                                    My Profile
                                </Link>

                                <Link to="/cart" className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                    <i className="ri-shopping-cart-line mr-2"></i>
                                    Cart
                                </Link>

                                <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>signOut(auth)}> 
                                    <i className="ri-logout-circle-r-line mr-2"></i>
                                    Logout
                                </button>
                            </div>
                        }
                    </button>
                }
                    {
                        menus.map((item, index)=>(
                            <button onClick={()=>mobileLink(item.href)} key={index} className="text-white">
                                {item.label}
                            </button>
                        ))
                    }
                </div>
            </aside>
        </div>
    )
}

export default Layout