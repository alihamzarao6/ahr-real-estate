import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // here we have to save the other params or queries if the search term changes
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    };

    // now we also have to change text inside search box if someone changes it in url params
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get('searchTerm');

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to={"/"}>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer'>
                        <span className='text-slate-500'>Hamza</span>
                        <span className=' text-slate-700'>Estate</span>
                    </h1>
                </Link>

                <form onSubmit={handleSearchSubmit} className='bg-slate-100 rounded-lg p-3 flex items-center'>
                    <input
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className="text-slate-600 cursor-pointer" />
                    </button>
                </form>

                <ul className="flex gap-4">
                    <Link to={"/"}>
                        <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
                    </Link>
                    <Link to={"/about"}>
                        <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
                    </Link>
                    <Link to={"/profile"}>
                        {currentUser ? (
                            <img src={currentUser.avatar} alt="profile" className="rounded-full h-7 w-7 object-cover" />
                        ) : (
                            <li className="text-slate-700 hover:underline">Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>

        </header>
    )
}

export default Header;