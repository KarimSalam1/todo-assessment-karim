import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/store/store";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser, logout } from "./redux/slices/authSlice";
import Loader from "./components/Loader";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser(firebaseUser.email));
      } else {
        dispatch(logout());
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);
  if (authLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#23262C] px-40">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/todos"
            element={user ? <Todos /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/todos" : "/login"} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
