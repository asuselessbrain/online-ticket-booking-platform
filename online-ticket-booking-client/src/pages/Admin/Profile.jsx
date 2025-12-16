import { use, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = use(AuthContext);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch user data from backend
  const { data: backendUser, isLoading } = useQuery({
    queryKey: ["adminProfile", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await api.get(`/api/v1/users/email/${user.email}`);
      return res.data?.data;
    },
    enabled: !!user?.email,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          imageUrl: data.imageUrl || "",
        });
      }
    },
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      if (!backendUser?._id) {
        throw new Error("User ID not found");
      }
      const res = await api.patch(`/api/v1/users/${backendUser._id}`, updatedData);
      return res.data;
    },
    onSuccess: async (response, variables) => {
      // Update Firebase profile - only use actual uploaded URL, not base64 preview
      try {
        const updates = {};
        if (variables.name && variables.name !== user?.displayName) {
          updates.displayName = variables.name;
        }
        // Only update photoURL if we have a valid Cloudinary URL (not base64)
        if (variables.imageUrl && !variables.imageUrl.startsWith('data:') && variables.imageUrl !== user?.photoURL) {
          updates.photoURL = variables.imageUrl;
        }
        
        if (Object.keys(updates).length > 0) {
          await updateUser(updates);
        }
      } catch (firebaseError) {
        console.error("Firebase update failed:", firebaseError);
        // Don't fail the whole operation if Firebase update fails
      }
      
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setImageFile(null);
      setPreviewUrl("");
    },
    onError: (err) => {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update profile");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image to Cloudinary if new file selected
      if (imageFile) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", imageFile);
        cloudinaryFormData.append("upload_preset", "my_preset");

        const imgRes = await fetch(
          "https://api.cloudinary.com/v1_1/dwduymu1l/image/upload",
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );
        const imgData = await imgRes.json();
        imageUrl = imgData.secure_url;
      }

      // Update backend
      updateMutation.mutate({
        name: formData.name,
        imageUrl: imageUrl,
      });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: backendUser?.name || "",
      email: backendUser?.email || "",
      imageUrl: backendUser?.imageUrl || "",
    });
    setImageFile(null);
    setPreviewUrl("");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="inline-block w-5 h-5 border-2 border-[#01602a] border-r-transparent rounded-full animate-spin" />
          Loading profile...
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-start min-h-screen py-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#01602a] text-white rounded hover:bg-[#014d21] transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div>
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#01602a] to-[#028a3d] h-32"></div>

          <div className="px-6 pb-6">
            {/* Profile Image */}
            <div className="flex items-end -mt-16 mb-4">
              <div className="relative">
                <img
                  src={previewUrl || formData.imageUrl || user?.photoURL || "https://via.placeholder.com/150"}
                  alt={formData.name || "Profile"}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[#01602a] text-white p-2 rounded-full cursor-pointer hover:bg-[#014d21]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Form/Display */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={backendUser?.role || "admin"}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed capitalize"
                    disabled
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading || updateMutation.isPending}
                    className="px-6 py-2 bg-[#01602a] text-white rounded-lg hover:bg-[#014d21] transition disabled:opacity-50"
                  >
                    {uploading || updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p className="text-lg font-semibold">
                    {backendUser?.name || user?.displayName || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-lg">{backendUser?.email || user?.email || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <span className="inline-block px-3 py-1 bg-[#01602a] text-white rounded-full text-sm capitalize">
                    {backendUser?.role || "admin"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Account Created
                  </label>
                  <p className="text-lg">
                    {backendUser?.createdAt
                      ? new Date(backendUser.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Firebase Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Firebase Authentication</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <span className="font-medium">UID:</span> {user?.uid || "N/A"}
            </p>
            <p>
              <span className="font-medium">Email Verified:</span>{" "}
              {user?.emailVerified ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Last Sign In:</span>{" "}
              {user?.metadata?.lastSignInTime || "N/A"}
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Profile;
