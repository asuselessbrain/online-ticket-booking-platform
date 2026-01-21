import { use } from 'react';
import { AuthContext } from '../providers/AuthContext';
import useRole from '../lib/userRole';
import Loading from '../components/shared/Loading';
import Forbidden from '../pages/Forbidden';

const UserRoute = ({ children }) => {
    const { loading } = use(AuthContext);
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loading fullPage message="Checking user access..." />;
    }

    if (role !== 'user') {
        return <Forbidden />;
    }

    return children;
};

export default UserRoute;