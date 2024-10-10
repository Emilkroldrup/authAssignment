'use client';

import React, { useState } from 'react';
import api from '../../utils/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('soldier');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/auth/register', {
                username,
                password,
                role,
            });
            setMessage('User registered successfully!');
        } catch {
            setMessage('Error registering user.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-900 text-gray-100 p-6">
            <div className="bg-green-800 p-8 rounded-lg shadow-md max-w-sm w-full">
                <h1 className="text-3xl font-bold mb-4 text-yellow-600">Register</h1>
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
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mb-4 rounded bg-yellow-100 text-gray-900"
                    >
                        <option value="soldier">Soldier</option>
                        <option value="officer">Officer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-yellow-700 hover:bg-yellow-800 rounded-lg"
                    >
                        Register
                    </button>
                </form>
                {message && <p className="mt-4 text-yellow-500">{message}</p>}
            </div>
        </div>
    );
};

export default RegisterPage;
