'use client';

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
    const [message, setMessage] = useState('');
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
    }, [router]);

    return (
        <div>
            <h1>Admin Page</h1>
            <p>{message}</p>
        </div>
    );
};

export default AdminPage;
