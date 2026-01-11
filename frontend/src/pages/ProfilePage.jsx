import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getInitials = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const ProfilePage = () => {
  const { user } = useAuth();
  const displayName = user?.username || "Luka Hacek";
  const bio = user?.description || "Board game collector & trader";
  const initials = getInitials(displayName);

  return (
    <div className="bg-vintage-cream text-vintage-brown font-roboto pt-24">
      <section className="bg-vintage-brown text-vintage-cream py-28 relative -mt-16">
        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent text-4xl font-bold mb-6">
            {initials}
          </div>
          <h1 className="text-3xl font-playfair font-bold mt-4">
            {displayName}
          </h1>
          <p className="text-base opacity-80 mt-3 mb-4">{bio}</p>
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 bg-vintage-accent/20 text-vintage-cream border border-vintage-accent/40 px-6 py-2 rounded-full hover:bg-vintage-accent/30 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-playfair font-bold text-center mb-12">
            My Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            <Link
              to="/my-games"
              className="bg-white py-6 px-6 rounded-2xl shadow-md border border-vintage-brown/10 transition-transform transform hover:-translate-y-2 hover:shadow-lg cursor-pointer text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vintage-accent/20 flex items-center justify-center">
                <span className="text-2xl">🎲</span>
              </div>
              <h3 className="text-xl font-medium mb-1">My Games</h3>
              <p className="text-base opacity-80">View your listed games</p>
            </Link>

            <Link
              to="/my-trades"
              className="bg-white py-6 px-6 rounded-2xl shadow-md border border-vintage-brown/10 transition-transform transform hover:-translate-y-2 hover:shadow-lg cursor-pointer text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent text-3xl">
                🔄
              </div>
              <h3 className="text-xl font-medium mb-1">My Trades</h3>
              <p className="text-base opacity-80">
                Current and past trade offers
              </p>
            </Link>

            <Link
              to="/add-edit"
              className="bg-white py-6 px-6 rounded-2xl shadow-md border border-vintage-brown/10 transition-transform transform hover:-translate-y-2 hover:shadow-lg cursor-pointer text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent text-3xl">
                ✏️
              </div>
              <h3 className="text-xl font-medium mb-1">Add / Edit Game</h3>
              <p className="text-base opacity-80">Manage your listings</p>
            </Link>

            <Link
              to="/wishlist"
              className="bg-white py-6 px-6 rounded-2xl shadow-md border border-vintage-brown/10 transition-transform transform hover:-translate-y-2 hover:shadow-lg cursor-pointer text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent text-3xl">
                ❤️
              </div>
              <h3 className="text-xl font-medium mb-1">Wishlist</h3>
              <p className="text-base opacity-80">
                Games you want to trade for
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
