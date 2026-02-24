// LoginForm.js
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../provider/AuthProvider";

const LoginForm = ({ onClose, onSwitchToSignup }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useContext(AuthContext);

  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      onClose();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed", err);
      const msg = err.message || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  };

  // 👇 also add email/password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>


      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black border-2 text-white py-2 rounded-lg hover:bg-white hover:border-2 hover:text-black transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        Don’t have an account?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={onSwitchToSignup}
        >
          Sign Up
        </button>
      </div>

      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
};

export default LoginForm;
