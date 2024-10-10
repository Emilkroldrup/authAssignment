'use client';

import React, { useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/auth/login', {
                username,
                password,
            });
            setMessage('Logged in successfully!');
            router.push('/admin');
        } catch {
            setMessage('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-900 text-gray-100 p-6">
            <div className="bg-green-800 p-8 rounded-lg shadow-md max-w-sm w-full">
                <h1 className="text-3xl font-bold mb-4 text-yellow-600">Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full p-2 mb-4 rounded bg-yellow-100 text-gray-900"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 mb-4 rounded bg-yellow-100 text-gray-900"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-yellow-700 hover:bg-yellow-800 rounded-lg"
                    >
                        Login
                    </button>
                </form>
                {message && <p className="mt-4 text-yellow-500">{message}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
