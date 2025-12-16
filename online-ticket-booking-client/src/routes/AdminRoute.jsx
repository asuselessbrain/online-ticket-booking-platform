import React, { use } from 'react';
import { AuthContext } from '../providers/AuthContext';
import useRole from '../lib/userRole';

const AdminRoute = ({ children }) => {
    const { loading } = use(AuthContext);
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <p>Loading....</p>
    }

    if (role !== 'admin') {
        return <p>Forbidden access</p>
    }

    return children;
};

export default AdminRoute;