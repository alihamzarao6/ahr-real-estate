import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If user is created successfully, show success message in green for 2 seconds
    if (success) {
      const timeoutId = setTimeout(() => {
        setSuccess(false);
        navigate('/sign-in');
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // sending data to the server and get the response of this specific request
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      // this data.success or data.message will be in case of error and coming from error middleware from index.js
      if (data.success === false) {
        if (data.message.includes('duplicate key error')) {
          const errorMessage = data.message.includes('username') ? 'Username is already taken. Please choose a different one.' :
            data.message.includes('email') ? 'Email is already taken. Please choose a different one.' :
              'Duplicate key error.';

          setError(errorMessage);
        } else {
          setError(data.message);
        }

        setLoading(false);
        return;
      }

      // User created successfully
      setSuccess(true);
      setLoading(false);
      setError(null);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }

  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
      {success && <p className="text-green-500 mt-5">User created successfully. Redirecting...</p>}
    </div>
  );
};

export default SignUp;
