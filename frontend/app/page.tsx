import React from 'react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-gray-100">
            {/* Hero Section */}
            <div className="max-w-4xl text-center p-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-600">Welcome to Military Task Management</h1>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                    Securely manage users, roles, and tasks with our advanced system designed for scalability and security.
                </p>
                <div className="mt-6">
                    <a href="/register" className="inline-block px-6 py-3 mr-4 text-lg font-semibold text-white bg-yellow-700 hover:bg-yellow-800 rounded-lg">
                        Register
                    </a>
                    <a href="/login" className="inline-block px-6 py-3 text-lg font-semibold text-yellow-600 border border-yellow-600 hover:bg-yellow-700 hover:text-white rounded-lg">
                        Login
                    </a>
                </div>
            </div>

            {/* Feature Section */}
            <div className="mt-16 max-w-6xl px-8 text-center grid gap-8 md:grid-cols-3">
                <div className="bg-green-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-2 text-yellow-500">User Registration</h2>
                    <p className="text-gray-300">
                        Easily onboard new users with secure registration and assign roles.
                    </p>
                </div>
                <div className="bg-green-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-2 text-yellow-500">Role-Based Access</h2>
                    <p className="text-gray-300">
                        Access control based on user roles like Soldier, Officer, or Admin.
                    </p>
                </div>
                <div className="bg-green-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-2 text-yellow-500">Secure Authentication</h2>
                    <p className="text-gray-300">
                        State-of-the-art JWT authentication to ensure secure access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
