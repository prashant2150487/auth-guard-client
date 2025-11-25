import { Outlet } from "react-router-dom";
import Header from "../components/header";

const BaseLayout = ({children}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;
