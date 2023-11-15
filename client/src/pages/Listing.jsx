import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import {Swiper, SwiperSlide} from 'swiper/react'
// import SwiperCore from 'swiper'
// 
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';

const Listing = () => {

    const params = useParams();
    const [listing, setListing] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                console.log(data)
                if (data.success === false) {
                    console.log("cannot load the list info");
                    setError(true);
                    setIsLoading(false);
                    return;
                }
                setListing(data);
                setIsLoading(false);
                setError(false);

            } catch (error) {
                setError(true);
                setIsLoading(false);

            }
        }

        fetchListing();
    }, [])

    return (
        <main>
            {isloading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='uppercase'>Something went wrong</p>}
            {listing && !isloading && !error && (
                <>
                <Swiper modules={[Navigation]} navigation>
                    {listing.imageUrls.map(url => (
                        <SwiperSlide key={url}>
                            <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>

                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>
                </>
            )
        }
        </main>
    )
}

export default Listing
