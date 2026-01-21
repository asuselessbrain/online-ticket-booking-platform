import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../providers/AuthContext';
import Loading from '../components/shared/Loading';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();
    
    if (loading) {
        return <Loading fullPage message="Checking your session..." />;
    }

    if(!user){
        return <Navigate state={location.pathname} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;