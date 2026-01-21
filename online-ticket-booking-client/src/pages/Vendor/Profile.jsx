import { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { AuthContext } from '../../providers/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['vendorUser', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/users/email/${email}`);
      return res.data?.data || null;
    },
  });

  const { data: roleData } = useQuery({
    queryKey: ['vendorRole', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/users/role/${email}`);
      return res.data?.data?.role || null;
    },
  });

  const { data: totalMeta } = useQuery({
    queryKey: ['vendorTicketsTotal', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/vendor/${email}`, { params: { page: 1, limit: 1 } });
      return res.data?.data?.meta || { total: 0 };
    },
  });

  const { data: approvedMeta } = useQuery({
    queryKey: ['vendorTicketsApproved', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/vendor/${email}`, { params: { verificationStatus: 'approved', page: 1, limit: 1 } });
      return res.data?.data?.meta || { total: 0 };
    },
  });

  const { data: pendingMeta } = useQuery({
    queryKey: ['vendorTicketsPending', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/vendor/${email}`, { params: { verificationStatus: 'pending', page: 1, limit: 1 } });
      return res.data?.data?.meta || { total: 0 };
    },
  });

  const { data: rejectedMeta } = useQuery({
    queryKey: ['vendorTicketsRejected', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/vendor/${email}`, { params: { verificationStatus: 'rejected', page: 1, limit: 1 } });
      return res.data?.data?.meta || { total: 0 };
    },
  });

  const { data: bookingPendingMeta } = useQuery({
    queryKey: ['vendorBookingsPending', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/bookings/vendor/${email}`, { params: { status: 'pending', page: 1, limit: 1 } });
      return res.data?.meta || { total: 0 };
    },
  });

  const { data: bookingApprovedMeta } = useQuery({
    queryKey: ['vendorBookingsApproved', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/bookings/vendor/${email}`, { params: { status: 'approved', page: 1, limit: 1 } });
      return res.data?.meta || { total: 0 };
    },
  });

  const { data: bookingRejectedMeta } = useQuery({
    queryKey: ['vendorBookingsRejected', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await api.get(`/api/v1/bookings/vendor/${email}`, { params: { status: 'cancelled', page: 1, limit: 1 } });
      return res.data?.meta || { total: 0 };
    },
  });

  const name = userData?.name || user?.displayName || 'Vendor';
  const photo = userData?.photoURL || user?.photoURL || 'https://ui-avatars.com/api/?name=Vendor&background=01602a&color=fff';
  const role = roleData || userData?.role || 'vendor';

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData || user) {
      setEditName(userData?.name || user?.displayName || '');
      setEditImageUrl(userData?.imageUrl || user?.photoURL || '');
    }
  }, [userData, user]);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError('');
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const userId = userData?._id;
      if (!userId) throw new Error('User ID not found');
      const res = await api.patch(`/api/v1/users/${userId}`, payload);
      return res.data?.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendorUser', email] });
      setEditing(false);
    },
  });

  const handleSave = async () => {
    if (!editing || updateMutation.isLoading) return;
    try {
      setUploadError('');
      let finalImageUrl = editImageUrl;
      if (selectedFile) {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
          setUploadError('Cloudinary env vars missing');
          return;
        }
        setUploading(true);
        const fd = new FormData();
        fd.append('file', selectedFile);
        fd.append('upload_preset', UPLOAD_PRESET);
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const res = await fetch(url, { method: 'POST', body: fd });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error?.message || 'Image upload failed');
        }
        finalImageUrl = json.secure_url || json.url;
      }
      await updateMutation.mutateAsync({ name: editName, imageUrl: finalImageUrl });
    } catch (err) {
      setUploadError(err.message || 'Failed to save');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-extrabold mb-6">Hello {name}</h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
          <img src={photo} alt={name} className="w-20 h-20 rounded-full object-cover ring-2 ring-[#01602a]" />
          <div>
            <div className="text-xl font-bold text-slate-900">{name}</div>
            <div className="text-slate-600">{email || 'Not logged in'}</div>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center rounded-full bg-[#01602a]/10 text-[#01602a] px-3 py-1 text-xs font-semibold capitalize">
              {role}
            </span>
          </div>
          {userLoading && (
            <div className="ml-auto text-sm text-gray-600">Loading profile...</div>
          )}
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Edit Profile</h2>
            {!editing ? (
              <button
                className="px-4 py-2 rounded border hover:bg-gray-50"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded border hover:bg-gray-50"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${editing ? '' : 'pointer-events-none opacity-60'}`}>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Image URL</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://..."
              />
              <div className="mt-3">
                <label className="block text-sm text-slate-600 mb-1">Or Upload Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewUrl && (
                  <img src={previewUrl} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              disabled={!editing || updateMutation.isLoading || uploading}
              className="px-4 py-2 rounded bg-[#01602a] text-white disabled:opacity-50"
              onClick={handleSave}
            >
              {uploading ? 'Uploading...' : updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            {updateMutation.isError && (
              <span className="ml-3 text-sm text-red-600">Failed to update profile</span>
            )}
            {uploadError && (
              <span className="ml-3 text-sm text-red-600">{uploadError}</span>
            )}
            {updateMutation.isSuccess && (
              <span className="ml-3 text-sm text-green-600">Profile updated</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <StatCard label="Total Tickets" value={totalMeta?.total ?? 0} />
          <StatCard label="Approved" value={approvedMeta?.total ?? 0} />
          <StatCard label="Pending" value={pendingMeta?.total ?? 0} />
          <StatCard label="Rejected" value={rejectedMeta?.total ?? 0} />
          <StatCard label="Pending Bookings" value={bookingPendingMeta?.total ?? 0} />
          <StatCard label="Approved Bookings" value={bookingApprovedMeta?.total ?? 0} />
          <StatCard label="Rejected Bookings" value={bookingRejectedMeta?.total ?? 0} />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-extrabold text-[#01602a]">{value}</div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

export default Profile;
