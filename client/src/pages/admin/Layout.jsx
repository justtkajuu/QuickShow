import AdminNavabar from "../../components/admin/AdminNavabar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import Loading from "../../components/Loading";

const Layout = () => {
  const { isAdmin, fetchIsAdmin, adminLoading } = useAppContext();

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  // 👇 Jab tak API check ho raha hai
  if (adminLoading) return <Loading />;

  // 👇 Agar admin nahi hai
  if (!isAdmin) return <h1 className="text-center mt-20 text-xl">Not Authorized</h1>;

  // 👇 Agar admin hai
  return (
    <>
      <AdminNavabar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;