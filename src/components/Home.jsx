import { useState, useEffect } from "react";
import Layout from "./Layout"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import firebaseAppConfig from "../util/firebase-config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swal from "sweetalert2";

const db = getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)

const Home = ()=>{
    const [products, setProducts] = useState([])
    const [session, setSession] = useState(null)

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user)
            {
                setSession(user)
            }
            else {
                setSession(null)
            }
        })
    },[])

    useEffect(()=>{
        const req = async ()=>{
            const snapshot = await getDocs(collection(db, "products"))
            const tmp = []
            snapshot.forEach((doc)=>{
                const allProducts = doc.data()
                allProducts.id = doc.id
                tmp.push(allProducts)
            })
            setProducts(tmp)
        }
        req()
    }, [])

    
    const addToCart = async (item)=>{
        try {
            item.userId = session.uid
            await addDoc(collection(db, "carts"), item)
            new Swal({
                icon: 'success',
                title: 'Product Added !'
            })
        }
        catch(err)
        {
            new Swal({
                icon: 'error',
                title: 'Failed !',
                text: err.message
            })
        }
    }

    return (
        <Layout>
            <div>
                <header>
                    <Swiper
                        className="z-[-1]"
                        pagination={true}
                        navigation={true}
                        modules={[Navigation, Pagination]}
                        slidesPerView={1}
                    >
                        <SwiperSlide>
                            <img src="/images/p1.jpg" />
                        </SwiperSlide>

                        <SwiperSlide>
                            <img src="/images/p2.jpg" />
                        </SwiperSlide>

                        <SwiperSlide>
                            <img src="/images/p3.jpg" />
                        </SwiperSlide>

                        <SwiperSlide>
                            <img src="/images/p4.jpg" />
                        </SwiperSlide>

                        <SwiperSlide>
                            <img src="/images/p5.jpg" />
                        </SwiperSlide>
                    </Swiper>
                </header>

                <div className="md:p-16 p-8">
                    <h1 className="text-3xl font-bold text-center">Latest Products</h1>
                    <p className="text-center mx-auto text-gray-600 md:w-7/12 mt-2 mb-16">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod accusantium iusto, consequatur, officiis sapiente iure nisi aspernatur est corporis dolor ratione adipisci</p>
                    <div className="md:w-10/12 mx-auto grid md:grid-cols-4 gap-12">
                        {
                            products.map((item, index)=>(
                                <div key={index} className="bg-white shadow-lg border">
                                    <img src={item.image ? item.image : '/images/pt.jpg'} />
                                    <div className="p-4">
                                        <h1 className="text-lg font-semibold capitalize">{item.title}</h1>
                                        <div className="space-x-2">
                                            <label className="font-bold text-lg">₹{item.price-(item.price*item.discount)/100}</label>
                                            <del>₹{item.price}</del>
                                            <label className="text-gray-600">({item.discount}%)</label>
                                        </div>
                                        <button className="bg-green-500 py-2 w-full rounded text-white font-semibold mt-4">Buy Now</button>
                                        <button onClick={()=>addToCart(item)} className="bg-rose-500 py-2 w-full rounded text-white font-semibold mt-2">
                                            <i className="ri-shopping-cart-line mr-2"></i>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home