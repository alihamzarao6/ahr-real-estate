import React from 'react'

const CreateListing = () => {
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold my-7 text-center'>Create a Listing</h1>

            <form className='flex flex-col sm:flex-row gap-4'>
                {/* Start Left Side div  */}
                <div className='flex flex-col gap-4 flex-1'>
                    {/* Name */}
                    <input type="text" id='name' placeholder='Name' className='border rounded-lg p-3' maxLength="62" minLength="8" required />

                    {/* Description */}
                    <textarea type="text" id='description' placeholder='Description' className='border rounded-lg p-3' required />

                    {/* Address */}
                    <input type="text" id='address' placeholder='Address' className='border rounded-lg p-3' required />

                    {/* CheckBoxes Start */}
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    {/* CheckBoxes Ends */}


                    {/* Number Inputs Starts */}
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' className='p-3 border border-gray-300 rounded-lg' min='1' max='30' required />
                            <span>Beds</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required />
                            <span>Baths</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' className='p-3 border border-gray-300 rounded-lg' min='50' max='10000000' required />
                            <div className='flex flex-col items-center'>
                                <span>Regular Price</span>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' className='p-3 border border-gray-300 rounded-lg' min='0' max='10000000' required />
                            <div className='flex flex-col items-center'>
                                <span>Discounted Price</span>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                    {/* Number Inputs Ends */}

                </div>
                {/* End Left Side div  */}

                {/* Start Right Side div  */}
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images: <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>

                    <div className='flex gap-4'>
                        <input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                    </div>
                    
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>
                {/* End Right Side div  */}
            </form>
        </main>
    )
}

export default CreateListing;