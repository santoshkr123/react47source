import { useState ,useEffect} from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../../util/firebase-config"
import { getFirestore,getDocs,collection,query,getDoc,updateDoc,where,doc } from "firebase/firestore"
import Swal from "sweetalert2"

const db=getFirestore()

const Orders = ()=>{
    const [orders, setOrders] = useState([])
    useEffect(()=>{
        const req=async()=>{
            const tmp=[]
            const snapshot=await getDocs(collection(db,'orders'))
            snapshot.forEach((docs)=>{
               const order= doc.data()
               order.orderId=doc.id
               tmp.push(order)
            })
            setOrders(tmp)
            
        }
        req()
    },[])
    
    const orderUpdateStatus = async(e , orderId)=>{
        try
        {
        
   const status= e.target.value
   const ref=doc(db,"orders",orderId)   
   await updateDoc(ref,{status:status})
   new Swal({
    icon :'Success' ,
    title :'Order Status Updated!'

   })
}
catch(err)
{
    console.log(err)
}
}
       
    return (
        <Layout>
            <div>
                <h1 className="text-xl font-semibold">Orders</h1>
                <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-rose-600 text-white">
                                <th className="py-4">Order Id</th>
                                <th>Customer`s Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                orders.map((item, index)=>(
                                    <tr className="text-center" key={index} style={{
                                        background: (index+1)%2 === 0 ? '#f1f5f9' : 'white'
                                    }}>
                                        <td className="py-4">{item.orderId}</td>
                                        <td className="capitalize">{item.customerName}</td>
                                        <td>{item.email}</td>
                                        <td>{item.mobile}</td>
                                        <td className="capitalize">{item.product}</td>
                                        <td>₹{item.amount.toLocaleString()}</td>
                                        <td>{item.date}</td>
                                        <td className="capitalize">
                                            <select className="border p-1 border-gray-200" onChange={(e)=>orderUpdateStatus(e,item.orderId)}>
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="dispatched">Dispatched</option>
                                                <option value="returned">Returned</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}

export default Orders