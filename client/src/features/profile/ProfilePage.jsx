import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../auth/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      console.log("User object in useEffect:", user);
      setName(user.name);
      setBio(user.bio || "");
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let avatarUrl = user.avatar;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const token = localStorage.getItem("token");
        const uploadConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        const uploadRes = await axios.post(
          "/api/v1/upload/avatar",
          formData,
          uploadConfig
        );
        avatarUrl = uploadRes.data.url;
      }

      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        "/api/v1/user/profile",
        { name, bio, avatar: avatarUrl },
        config
      );

      updateUser(data);

      setAvatarPreview(data.avatar);

      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to update profile", error);
      const errorText =
        error.response?.data?.message || "Error updating profile.";
      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center p-8">Loading profile...</div>;

  return (
    <div className="flex items-center justify-center w-full h-full p-4 md:p-8">
      <motion.div
        className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="mb-6 text-center">
            <img
              src={avatarPreview || `https://i.pravatar.cc/150?u=${user.email}`}
              alt="Avatar"
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-gray-600"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-gray-200"
            >
              Change Photo
            </label>
            <input
              id="avatar-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Bio Textarea */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-1 font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {/* Success/Error Message */}
          <AnimatePresence>
            {message.text && (
              <motion.p
                className={`text-center mt-4 text-sm font-medium ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
