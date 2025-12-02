import Header from "../components/header";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../lib/axiosInstance";
import { useEffect } from "react";
import { setCredentials } from "../store/userSlice";
import { Toaster } from "react-hot-toast";

const BaseLayout = ({ children }) => {
  const { user, token, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const res = await axiosInstance("/api/auth/meta");
    dispatch(
      setCredentials({
        user: res.data.data?.user || null,
      })
    );

  };
  useEffect(() => {
      fetchUserData();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full">{children}</main>
      <Toaster position="bottom-right" reverseOrder={false}/>
    </div>
  );
};

export default BaseLayout;
