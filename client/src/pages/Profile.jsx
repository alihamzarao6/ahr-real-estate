import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase.js";
import {
  updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure,
} from "../redux/user/userSlice.js";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Reference to file input element
  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
  }, [file]);

  const handleUploadFile = (file) => {
    // Get a reference to the Firebase storage
    const storage = getStorage(app);

    // Generate a unique filename using the current timestamp and the original file name
    const fileName = new Date().getTime() + file.name;

    // Create a reference to the file in Firebase storage
    const storageRef = ref(storage, fileName);

    // Initialize the file upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Event listeners for tracking the upload progress
    uploadTask.on("state_changed",
      (snapshot) => {
        // Calculate the upload progress and update the state
        const uploadingProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(uploadingProgress));
      },
      (error) => {
        // Handle errors during the upload
        setFileUploadError(true);
      },
      () => {
        // When the upload is complete, get the download URL and update the form data. 'uploadTask.snapshot.ref' provides a reference to the uploaded file in Firebase Storage.
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadURL }));
        }
        );
      }
    );
    // console.log(file);
    setFile(undefined);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart);

      const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const resp = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });

      const data = resp.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const resp = await fetch("/api/v1/auth/signout");

      const data = resp.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };


  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const resp = await fetch(`/api/v1/user/listings/${currentUser._id}`);
      const data = await resp.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const resp = await fetch(`/api/v1/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = await resp.json();

      if (data.success === false) {
        console.log(data.message);
      }

      setUserListings(prev => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 self-center object-cover cursor-pointer mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error image upload (Image must be less then 2 MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleInputChange}
        />

        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleInputChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleInputChange}
        />

        <button disabled={loading} className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link to={"/create-listing"} className="bg-green-700 rounded-lg p-3 text-white uppercase text-center hover:opacity-95">
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 font-medium cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 font-medium cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "Updated Successfully" : ""}</p>

      <button onClick={handleShowListings} className="text-green-700 w-full">Show listings</button>
      <p className="text-red-700 mt-5">{showListingsError ? 'Error Showing Listings' : ''}</p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>

          {
            userListings.map((listing) => (
              <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">

                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt="listing cover" className="w-16 h-16 object-contain" />
                </Link>

                <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold hover:underline truncate flex-1">
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button className="text-red-700 uppercase" onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-700 uppercase'>Edit</button>
                  </Link>
                </div>
              </div>
            ))
          }

        </div>
      )}
    </div>
  );
};

export default Profile;
