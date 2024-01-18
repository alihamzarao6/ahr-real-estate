import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {
    SwiperCore.use([Navigation]);

    const params = useParams();

    const { currentUser } = useSelector((state) => state.user)

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);

                const resp = await fetch(`/api/v1/listing/get/${params.listingId}`);
                const data = await resp.json();

                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(data);
                setLoading(false);
                setError(false);

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }

        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}

            {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}

            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing?.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[450px]'
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}

            
        </main>
    )
}

export default Listing