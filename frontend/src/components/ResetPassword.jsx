import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reset-password/${token}`,
        {
          password,
        }
      );

      if (data.success) {
        toast.success("Password updated! Redirecting to login...");
        setResetSuccess(true);
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {resetSuccess ? (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Password Reset</h2>
          <p className="text-gray-700">
            Your password has been reset successfully. You can now{" "}
            <a href="/" className="text-blue-500 underline">
              return to the site
            </a>{" "}
            or close this tab.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />

          {password !== confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={!password || password !== confirmPassword}
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
