import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api.js";

const blobBaseUrl = import.meta.env.VITE_BLOB_BASE_URL;
const blobSas = import.meta.env.VITE_BLOB_SAS;

const getInitials = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "Luka Hacek");
  const [bio, setBio] = useState(
    user?.description || "Board game collector & trader"
  );
  const [location, setLocation] = useState("Zagreb, Croatia");
  const [locationQuery, setLocationQuery] = useState("Zagreb, Croatia");
  const [locationResults, setLocationResults] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user?.username) setUsername(user.username);
    if (user?.description) setBio(user.description);
    if (user?.avatarUrl) setAvatarUrl(user.avatarUrl);
    if (!user?.avatarUrl) setAvatarUrl("");
    const nextLocation =
      user?.location ||
      (user?.town?.townName
        ? `${user.town.townName}${user?.town?.country?.countryName ? `, ${user.town.country.countryName}` : ""}`
        : null);
    if (nextLocation) {
      setLocation(nextLocation);
      setLocationQuery(nextLocation);
    }
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }
    setAvatarFile(null);
  }, [user]);

  useEffect(() => {
    if (!showPopup) return undefined;
    const timer = setTimeout(() => setShowPopup(false), 2500);
    return () => clearTimeout(timer);
  }, [showPopup]);

  //Reccomend Location
  const searchLocation = async (query) => {
    if (query.length < 3) {
      setLocationResults([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );

    const data = await res.json();

    setLocationResults(
      data.map((item) => ({
        label: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }))
    );
  };


  const initials = useMemo(() => getInitials(username), [username]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);
    setAvatarFile(file);
  };

  const uploadImage = async (file) => {
    if (!blobBaseUrl || !blobSas) {
      throw new Error("Missing blob storage configuration.");
    }

    const safeName = `avatar-${user?.userId || "user"}-${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;
    const uploadUrl = `${blobBaseUrl}/${safeName}?${blobSas}`;

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with ${response.status}`);
    }

    return `${blobBaseUrl}/${safeName}`;
  };

  const clearAvatarPreview = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }
    setAvatarPreviewUrl(null);
    setAvatarFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let nextAvatarUrl = avatarUrl;
      if (avatarFile) {
        nextAvatarUrl = await uploadImage(avatarFile);
      }

      const payload = {
        username,
        description: bio,
        location,
        avatarUrl: nextAvatarUrl || null,
      };
      const updatedUser = await updateProfile(payload);
      if (setUser) {
        setUser(updatedUser);
      }
      setAvatarUrl(updatedUser?.avatarUrl || "");
      clearAvatarPreview();
      setShowPopup(true);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Došlo je do greške pri spremanju profila.");
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    clearAvatarPreview();
  };

  return (
    <div className="bg-vintage-cream text-vintage-brown font-roboto">
      {showPopup ? (
        <div className="fixed top-24 right-6 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[60]">
          Profile updated successfully ✔
        </div>
      ) : null}

      <section className="bg-vintage-brown text-vintage-cream pt-32 pb-28">
        <div className="max-w-5xl mx-auto text-center px-4 translate-y-8">
          <h1 className="text-4xl font-playfair font-bold mb-4">Edit Profile</h1>
          <p className="text-base opacity-80">Update your profile information</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-8"
          >
            <div className="mb-8 text-center">
              <label className="block text-sm font-medium mb-4 text-left">
                Profile Picture
              </label>
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent text-4xl font-bold mb-4 overflow-hidden">
                  {avatarPreviewUrl || avatarUrl ? (
                    <img
                      src={avatarPreviewUrl || avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-vintage-accent text-white p-2 rounded-full shadow-lg hover:bg-amber-700 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>
              {avatarPreviewUrl || avatarUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-red-500 text-sm font-medium hover:text-red-700 mt-2"
                >
                  Remove Picture
                </button>
              ) : null}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent resize-none"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setLocation(e.target.value);
                  searchLocation(e.target.value);
                }}
                type="text"
                className="w-full border rounded-xl px-4 py-3"
                placeholder="Start typing your city..."
              />
              {locationResults.length > 0 && (
                  <ul className="border rounded-xl mt-2 bg-white max-h-48 overflow-y-auto">
                    {locationResults.map((loc, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setLocationQuery(loc.label);
                          setLocation(loc.label);
                          setLocationResults([]);
                        }}
                        className="px-4 py-2 hover:bg-vintage-cream cursor-pointer text-sm"
                      >
                        {loc.label}
                      </li>
                    ))}
                  </ul>
                )}
              <p className="text-xs text-vintage-brown/60 mt-2">
                Your location helps match you with nearby traders
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-vintage-accent text-white py-3 rounded-full hover:bg-amber-700 transition"
              >
                Save Changes
              </button>
              <Link
                to="/profile"
                className="px-8 bg-gray-300 text-vintage-brown py-3 rounded-full hover:bg-gray-400 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProfilePage;
