import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const Login = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{
    email?: string;
    password?: string;
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
    if (!password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
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
        if (message.includes("auth/user-not-found")) message = "User not found";
        else if (message.includes("auth/invalid-credential"))
          message = "Incorrect Email/Password Combination";
        else message = "Something went wrong. Please try again.";

        setError({ general: message });
      } else {
        setError({ general: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#23262C] flex items-start justify-center py-8">
      <div className="rounded-[32px] flex flex-col items-center justify-center gap-16 w-full max-w-md">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-[40px] font-Poppins font-normal text-white/50">
            Login
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
            <div className="flex flex-col gap-2 bg-[#2E3239] rounded-[10px] p-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-white/50 font-Poppins focus:outline-none p-2"
                placeholder="Email"
              />
              {error.email && (
                <p className="text-red-500 font-Poppins text-sm">
                  {error.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 bg-[#2E3239] rounded-[10px] p-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-white/50 focus:outline-none font-Poppins p-2"
                placeholder="Password"
              />
              {error.password && (
                <p className="text-red-500 font-Poppins text-sm">
                  {error.password}
                </p>
              )}
            </div>

            {error.general && (
              <p className="text-red-500 font-Poppins text-sm text-center">
                {error.general}
              </p>
            )}

            <p className="text-white/50 font-Poppins text-[16px] text-start">
              Don’t have an account yet?{" "}
              <span
                className="text-white/50 font-Poppins underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Signup
              </span>
            </p>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="h-[50px] bg-[#F4F6FA] text-[#2E3239] rounded-[9px] font-Poppins font-normal text-[16px] mx-auto flex items-center justify-center hover:bg-gray-200 transition w-[70%] cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {loading && <Loader />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
