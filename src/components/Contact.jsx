import Layout from './Layout'
const Contact = ()=>{
    return (
        <Layout>
            <div className='bg-white md:w-6/12 shadow-lg border md:my-16 mx-auto'>
                <img src="/images/contact.jpg" />
                <div className='p-8'>
                    <form className="space-y-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg mb-1">Fullname</label>
                            <input
                                required
                                name="fullname"
                                placeholder="Er Saurav"
                                className="p-3 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold text-lg mb-1">Email id</label>
                            <input 
                                required
                                type="email"
                                name="email"
                                placeholder="example@mail.com"
                                className="p-3 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold text-lg mb-1">Message</label>
                            <textarea 
                                required
                                name="message"
                                placeholder="Enter your message here"
                                className="p-3 border border-gray-300 rounded"
                                rows={4}
                            />
                        </div>
                        <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-rose-600">Get Quote</button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Contact