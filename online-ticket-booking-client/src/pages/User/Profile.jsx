import { use } from "react";
import { AuthContext } from "../../providers/AuthContext";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
    <span className="text-xs uppercase tracking-[0.15em] text-gray-500">{label}</span>
    <span className="text-base font-semibold text-gray-900 break-all">{value || "—"}</span>
  </div>
);

const Profile = () => {
  const { user } = use(AuthContext);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#01602a]">User Profile</p>
          <h1 className="text-3xl font-bold text-gray-900">Account overview</h1>
          <p className="text-gray-600 mt-2">Manage your personal details and security preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoRow label="Full name" value={user?.displayName || "Not set"} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Provider" value={user?.providerId || user?.providerData?.[0]?.providerId} />
        <InfoRow label="User ID" value={user?.uid} />
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-emerald-900 mb-2">Security tip</h2>
        <p className="text-emerald-800 text-sm">Use a strong password and enable additional verification options in your authentication provider whenever possible.</p>
      </div>
    </div>
  );
};

export default Profile;
