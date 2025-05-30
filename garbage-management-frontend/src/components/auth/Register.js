import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import authService from "../../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "citizen",
    location: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const { username, email, password, role, location, contactNumber } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const contactNumberValid =
      contactNumber.trim() === "" || /^\d{7,15}$/.test(contactNumber.trim());
    if (!contactNumberValid) {
      setMessage({
        type: "error",
        text: "Please enter a valid contact number (7-15 digits).",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await authService.register({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
        location: location.trim(),
        contactNumber: contactNumber.trim(),
      });
      register(response.token);
      setMessage({
        type: "success",
        text: "Registration successful! Redirecting...",
      });
      toast.success("Registration successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed";
      setMessage({ type: "error", text: errMsg });
      toast.error(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            login to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message.text && (
            <div
              className={`mb-4 text-sm px-4 py-2 rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={onChange}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                disabled={loading}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md sm:text-sm"
              >
                <option value="citizen">Citizen</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={onChange}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={onChange}
                disabled={loading}
                placeholder="Optional: 7-15 digits"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
