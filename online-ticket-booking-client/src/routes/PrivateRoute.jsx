import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../providers/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();
    
    if (loading) {
        return <p>Loading....</p>
    }

    if(!user){
        return <Navigate state={location.pathname} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;