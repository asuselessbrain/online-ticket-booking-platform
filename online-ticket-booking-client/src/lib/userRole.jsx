import { useQuery } from '@tanstack/react-query';
import api from './axios';
import { use } from 'react';
import { AuthContext } from '../providers/AuthContext';

const useRole = () => {
    const { user } = use(AuthContext);

    const { data: role, isLoading: roleLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await api.get(`/api/v1/users/role/${user.email}`);

            
            return res?.data?.data?.role || 'user';
        }
    })

    return { role, roleLoading };
};

export default useRole;