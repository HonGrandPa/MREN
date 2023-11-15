import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
    const [landlord, setLandlor] = useState(null);
    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchLandlord = async () => {

            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    return
                }
                setLandlor(data);
            } catch (error) {
                console.log(error)
            }
        }

        fetchLandlord();
    }, [])
    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landlord.userName} for </span><span>{listing.name.toLowerCase()}</span></p>
                    <textarea
                        name="message"
                        id="message"
                        row='2'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Enter your message here...'
                        className='w-full bordere p-3 rounded-lg'>
                    </textarea>

                    <Link onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`;
                    }} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}

export default Contact
