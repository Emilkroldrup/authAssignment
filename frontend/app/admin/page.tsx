'use client';

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

type User = {
    _id: string;
    username: string;
    role: string;
};

const AdminPage = () => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('soldier');
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const response = await api.get('/api/auth/admin');
                setMessage(response.data.message);
            } catch {
                setMessage('Access denied.');
                router.push('/login');
            }
        };

        checkAdminAccess();
        fetchUsers();
    }, [router]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users');
            setUsers(response.data);
        } catch {
            setMessage('Failed to fetch users.');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/users', {
                username,
                password,
                role,
            });
            setMessage('User added successfully!');
            fetchUsers(); // Refresh user list after any change to the list.
            setUsername('');
            setPassword('');
            setRole('soldier');
        } catch {
            setMessage('Error adding user.');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await api.delete(`/api/users/${userId}`);
            setMessage('User deleted successfully!');
            fetchUsers(); // Refresh user list after any change to the list.
        } catch {
            setMessage('Error deleting user.');
        }
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setUsername(user.username);
        setPassword('');
        setRole(user.role);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;

        try {
            await api.put(`/api/users/${editUser._id}`, {
                username,
                password,
                role,
            });
            setMessage('User updated successfully!');
            fetchUsers(); // Refresh user list after any change to the list.
            setIsEditModalOpen(false);
            setEditUser(null);
        } catch {
            setMessage('Error updating user.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-gray-100 p-6">
            <div className="bg-green-800 p-8 rounded-lg shadow-md max-w-4xl w-full">
                <h1 className="text-4xl font-bold mb-4 text-yellow-600">Admin Dashboard</h1>
                <p className="text-lg text-gray-300 mb-6">{message}</p>

                {/* Add User Form */}
                <form onSubmit={handleAddUser} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-500">Add New User</h2>
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
                        Add User
                    </button>
                </form>

                {/* Search Users */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by username"
                        className="w-full p-2 mb-4 rounded bg-yellow-100 text-gray-900"
                    />
                </div>

                {/* User List */}
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">User List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-green-800 rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-yellow-500">Username</th>
                                <th className="px-4 py-2 text-left text-yellow-500">Role</th>
                                <th className="px-4 py-2 text-yellow-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="bg-green-700">
                                    <td className="px-4 py-2">{user.username}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="px-4 py-1 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="px-4 py-1 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-green-800 p-8 rounded-lg shadow-md max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Edit User</h2>
                        <form onSubmit={handleUpdateUser}>
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
                                placeholder="Password (leave empty to keep current)"
                                className="w-full p-2 mb-4 rounded bg-yellow-100 text-gray-900"
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
                                Update User
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-full px-4 py-2 mt-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
