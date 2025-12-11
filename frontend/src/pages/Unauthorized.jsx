import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Unauthorized Access</h2>
                <p className="text-sm text-gray-600 mb-6">
                    You do not have permission to view this page.
                </p>
                <button
                    onClick={handleLogout}
                    className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
