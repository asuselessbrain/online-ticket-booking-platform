import { use } from 'react';
import { AuthContext } from '../providers/AuthContext';
import useRole from '../lib/userRole';
import Loading from '../components/shared/Loading';
import Forbidden from '../pages/Forbidden';

const VendorRoute = ({ children }) => {
    const { loading } = use(AuthContext);
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loading fullPage message="Checking vendor access..." />;
    }

    if (role !== 'vendor') {
        return <Forbidden />;
    }

    return children;
};

export default VendorRoute;