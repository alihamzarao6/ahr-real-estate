import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";

const UpdateListing = () => {
    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const params = useParams();

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        regularPrice: 0,
        discountPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        offer: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchListing = async () => {
            const listingId = params.listingId;

            const resp = await fetch(`/api/v1/listing/get/${listingId}`);
            const data = await resp.json();

            if(data.success === false) {
                console.log(data.message);
                return;
            }

            setFormData(data);
        }

        fetchListing();
    }, []);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);

            // we have to create multiple promises because we'll be uploading more than 1 image and we will have more than 1 asynchronous behaviours and we have to wait for all of them
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                // we will push each return promise by 'storeImage' in 'promises' array wich will be the downloadUrls of images
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError("Image upload failed (2 mb max per image)");
                    setUploading(false);
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.type === "textarea"
        ) {
            setFormData({ ...formData, [e.target.id]: e.target.value });
        }

        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({ ...formData, type: e.target.id });
        }

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        ) {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.imageUrls.length < 1) {
                return setError("You must upload at least one image");
            }

            if (+formData.regularPrice < +formData.discountPrice) {
                return setError("Discount price must be lower than regular price");
            }

            setLoading(true);
            setError(false);

            const resp = await fetch(`/api/v1/listing/update/${params.listingId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await resp.json();
            setLoading(false);

            if (data.success === false) {
                setError(data.message);
            }

            setFormData({
                imageUrls: [],
                name: "",
                description: "",
                address: "",
                type: "rent",
                regularPrice: 0,
                discountPrice: 0,
                bathrooms: 1,
                bedrooms: 1,
                furnished: false,
                parking: false,
                offer: false,
            });

            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold my-7 text-center">
                Update a Listing
            </h1>

            <form
                onSubmit={handleFormSubmit}
                className="flex flex-col sm:flex-row gap-4"
            >
                {/* Start Left Side div  */}
                <div className="flex flex-col gap-4 flex-1">
                    {/* Name */}
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        className="border rounded-lg p-3"
                        maxLength="62"
                        minLength="8"
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />

                    {/* Description */}
                    <textarea
                        type="text"
                        id="description"
                        placeholder="Description"
                        className="border rounded-lg p-3"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    {/* Address */}
                    <input
                        type="text"
                        id="address"
                        placeholder="Address"
                        className="border rounded-lg p-3"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    {/* CheckBoxes Start */}
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === "sale"}
                            />
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === "rent"}
                            />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking Spot</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    {/* CheckBoxes Ends */}

                    {/* Number Inputs Starts */}
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="bedrooms"
                                className="p-3 border border-gray-300 rounded-lg"
                                min="1"
                                max="30"
                                required
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <span>Beds</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="bathrooms"
                                className="p-3 border border-gray-300 rounded-lg"
                                min="1"
                                max="10"
                                required
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <span>Baths</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="regularPrice"
                                className="p-3 border border-gray-300 rounded-lg"
                                min="20"
                                max="10000000"
                                required
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className="flex flex-col items-center">
                                <span>Regular Price</span>
                                {formData.type === "rent" && (
                                    <span className="text-xs">($ / month)</span>
                                )}
                            </div>
                        </div>

                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="discountPrice"
                                    className="p-3 border border-gray-300 rounded-lg"
                                    min="0"
                                    max="10000000"
                                    required
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <span>Discounted Price</span>
                                    {formData.type === "rent" && (
                                        <span className="text-xs">($ / month)</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Number Inputs Ends */}
                </div>
                {/* End Left Side div  */}

                {/* Start Right Side div  */}
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:{" "}
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover (max 6)
                        </span>
                    </p>

                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    <p className="text-red-700 text-sm">
                        {imageUploadError && imageUploadError}
                    </p>

                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                            <div
                                key={index}
                                className="flex justify-between p-3 border items-center"
                            >
                                <img
                                    src={url}
                                    alt="listing image"
                                    className="w-20 h-20 object-contain rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-3 text-red-700 uppercase rounded-lg hover:opacity-75"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                    <button
                        disabled={loading || uploading}
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        {loading ? "Updating..." : "Update Listing"}
                    </button>

                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
                {/* End Right Side div  */}
            </form>
        </main>
    );
};

export default UpdateListing;
