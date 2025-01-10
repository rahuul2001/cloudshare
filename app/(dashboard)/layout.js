import React from "react";
import SideNav from "./_components/SideNav";
import TopHeader from "./_components/TopHeader";


function layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-full md:w-64 flex-col fixed inset-y-0 z-50 text-black">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <TopHeader/>
        {children}
      </div>
    </div>
  );
}

export default layout;

