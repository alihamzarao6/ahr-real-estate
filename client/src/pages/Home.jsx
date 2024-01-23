import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const resp = await fetch(`/api/v1/listing/get?offer=true&limit=4`);
        const data = await resp.json();

        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRentListings = async () => {
      try {
        const resp = await fetch("/api/v1/listing/get?type=rent&limit=4");
        const data = await resp.json();

        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const resp = await fetch("/api/v1/listing/get?type=sale&limit=4");
        const data = await resp.json();

        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top Start*/}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 text-3xl font-bold lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />
          place with ease
        </h1>

        <div className="text-gray-500 text-xs sm:text-sm">
          AHR Estate will help you find your home fast, easy and reliable.
          <br /> We have a wide range of properties for you to choose from.
        </div>

        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let&apos;s get started...
        </Link>
      </div>
      {/* Top Ends */}

      {/* middle(Swiper) Starts*/}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* middle(Swiper) Ends*/}

      {/* Bottom(listing results for offer, sale and rent) starts */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl text-slate-600 font-semibold">Recent offers</h2>

                <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show more offers</Link>
              </div>

              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl text-slate-600 font-semibold">Recent places for rent</h2>

                <Link className="text-sm text-blue-800 hover:underline" to={"/search?type=rent"}>Show more places for rent</Link>
              </div>

              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl text-slate-600 font-semibold">Recent places for sale</h2>

                <Link className="text-sm text-blue-800 hover:underline" to={"/search?type=sale"}>Show more places for sale</Link>
              </div>

              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Home;
