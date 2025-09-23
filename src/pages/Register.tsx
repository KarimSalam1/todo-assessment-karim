import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const Register = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/todos" replace />;
  }

  const handleSubmit = async () => {
    const validationErrors: typeof error = {};

    if (!email) validationErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      validationErrors.email = "Invalid email format";

    if (!password) validationErrors.password = "Password is required";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Please confirm your password";
    else if (password && password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(setUser(userCredential.user.email));
      navigate("/todos");
    } catch (err: unknown) {
      setLoading(false);

      if (err instanceof Error) {
        let message = err.message;
        if (message.includes("auth/email-already-in-use"))
          message = "Email is already in use";
        else if (message.includes("auth/invalid-email"))
          message = "Invalid email address";
        else if (message.includes("auth/weak-password"))
          message =
            "Password is short, please make sure its between 6 and 4096 characters.";
        else message = "Something went wrong. Please try again.";
        setError({ general: message });
      } else {
        setError({ general: "Something went wrong. Please try again." });
      }
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#23262C] flex items-start justify-center py-10">
      <div className="rounded-[32px] flex flex-col items-center justify-center gap-16 w-full max-w-md">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-[40px] font-Poppins font-normal text-white/50">
            Register
          </h1>
        </div>

        <form
          className="flex flex-col gap-12 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col gap-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2E3239] rounded-[10px] p-6 border-none text-white placeholder-white/50 font-Poppins focus:outline-none"
                placeholder="Email"
              />
              {error.email && (
                <p className="text-red-500 text-sm">{error.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2E3239] rounded-[10px] p-6 border-none text-white placeholder-white/50 font-Poppins focus:outline-none"
                placeholder="Password"
              />
              {error.password && (
                <p className="text-red-500 text-sm">{error.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#2E3239] rounded-[10px] p-6 border-none text-white placeholder-white/50 font-Poppins focus:outline-none"
                placeholder="Confirm Password"
              />
              {error.confirmPassword && (
                <p className="text-red-500 text-sm">{error.confirmPassword}</p>
              )}
            </div>

            {error.general && (
              <p className="text-red-500 text-sm text-center">
                {error.general}
              </p>
            )}

            <p className="text-white/50 text-[16px] text-start">
              Already have an account?{" "}
              <span
                className="text-blue-400 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="h-[50px] bg-[#F4F6FA] text-[#2E3239] rounded-[9px] font-Poppins font-normal text-[16px] mx-auto flex items-center justify-center hover:bg-gray-200 transition w-full cursor-pointer"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            {loading && <Loader />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
