import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store/store";
import { logout } from "../redux/slices/authSlice";
import { auth } from "../firebase";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(logout());
  };

  return (
    <nav className="w-full bg-[#23262C] py-12">
      <div className="py-3 flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-white font-poppins font-bold text-2xl tracking-wide">
            TO DO APP
          </h1>
          <p className="text-gray-400 font-poppins text-sm mt-1">
            Stop Procrastinating, Start Organizing
          </p>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-[#23262C] px-4 py-2 rounded-md hover:bg-gray-200 transition font-poppins font-medium cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>
      <div className="border-b border-gray-600 px-20" />
    </nav>
  );
};

export default Navbar;
