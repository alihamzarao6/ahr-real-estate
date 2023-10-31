import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase.js";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Reference to file input element
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
        const uploadingProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    console.log(file);
    setFile(undefined);
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 self-center object-cover cursor-pointer mt-2"
          onClick={() => fileRef.current.click()}
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
          id="username"
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 font-medium cursor-pointer">
          Delete account
        </span>
        <span className="text-red-700 font-medium cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  );
};

export default Profile;
