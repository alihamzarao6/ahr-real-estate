import React from "react";

const Search = () => {
    return (
        <div className="flex flex-col md:flex-row">
            {/* left side div starts */}
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form className="flex flex-col gap-8">

                    {/* Search Box */}
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term:</label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border w-full rounded-lg p-3"
                        />
                    </div>

                    {/* Type of search */}
                    <div className="flex gap-3 flex-wrap items-center">
                        <label className="font-semibold">Type:</label>

                        <div className="flex gap-1">
                            <input type="checkbox" id="all" className="w-5" />
                            <span>Rent & Sale</span>
                        </div>

                        <div className="flex gap-1">
                            <input type="checkbox" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-1">
                            <input type="checkbox" id="sale" className="w-5" />
                            <span>Sale</span>
                        </div>

                        <div className="flex gap-1">
                            <input type="checkbox" id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-3 flex-wrap items-center">
                        <label className="font-semibold">Amenities:</label>

                        <div className="flex gap-1">
                            <input type="checkbox" id="parking" className="w-5" />
                            <span>Parking</span>
                        </div>

                        <div className="flex gap-1">
                            <input type="checkbox" id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>
                    </div>

                    {/* Sort options */}
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>

                        <select id="sort_order" className="border p-3 rounded-lg">
                            <option>Price high to low</option>
                            <option>Price low to high</option>
                            <option>Latest</option>
                            <option>Oldest</option>
                        </select>
                    </div>

                    {/* submit button */}
                    <button className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95">Search</button>

                </form>
            </div>
            {/* left side div Ends */}

            {/* Right side div starts */}
            <div>
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results:</h1>
            </div>
            {/* Right side div Ends */}
        </div>
    );
};

export default Search;