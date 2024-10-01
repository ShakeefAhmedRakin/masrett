import { NavLink, Outlet, useLocation } from "react-router-dom";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import useCheckAdminRole from "../../hooks/useCheckAdminRole";
import useAuth from "../../hooks/useAuth";

const DashboardRoot = () => {
  const closeSidebar = () => {
    const closeBtn = document.getElementById("my-drawer-2");
    if (closeBtn) {
      closeBtn.checked = false;
    }
  };

  const { isAdmin } = useCheckAdminRole();
  const { logOut } = useAuth();

  const location = useLocation();

  return (
    <div className="drawer md:drawer-open h-full">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content overflow-x-auto">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-md text-lg bg-secondary border-none text-white hover:bg-secondary drawer-button md:hidden mb-3 fixed left-2 top-2 rounded-xl z-50"
        >
          <span className="text-xs">Menu</span>
          <TbLayoutSidebarLeftExpandFilled />
        </label>
        <div className="p-2 md:p-4 md:h-full ml-0 md:ml-[225px]">
          <hr className="mt-[54px] block md:hidden" />
          <Outlet />
        </div>
      </div>
      <div className="drawer-side h-full z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu h-full p-4 w-82 bg-primary text-base-content fixed">
          {/* Sidebar content here */}
          <div className="flex justify-between items-center gap-2">
            <div className="text-secondary flex items-center gap-4">
              <h1 className="font-heading text-xl md:text-2xl font-bold px-10 py-5 text-black">
                MASRETT
              </h1>
            </div>
            <label
              onClick={closeSidebar}
              className="btn text-xl bg-secondary text-white hover:bg-secondary drawer-button md:hidden"
            >
              <TbLayoutSidebarLeftCollapseFilled />
            </label>
          </div>
          <div className="flex flex-col text-lg font-heading font-medium gap-4">
            {/* SHARED ROUTE */}
            <NavLink
              to={"/dashboard"}
              onClick={closeSidebar}
              className={`p-2 w-full border-2 text-white hover:border-white border-transparent rounded-xl ${
                location.pathname === "/dashboard"
                  ? "text-white font-bold border-white"
                  : ""
              }`}
            >
              <li className="">Home</li>
            </NavLink>
            <NavLink
              to={"/dashboard/tutorials"}
              onClick={closeSidebar}
              className={`p-2 w-full border-2 text-white hover:border-white border-transparent rounded-xl ${
                location.pathname === "/dashboard/tutorials"
                  ? "text-white font-bold border-white"
                  : ""
              } `}
            >
              <li className="">Tutorial</li>
            </NavLink>
            <NavLink
              to={"/dashboard/mcq"}
              onClick={closeSidebar}
              className={`p-2 w-full border-2 text-white hover:border-white border-transparent rounded-xl ${
                location.pathname === "/dashboard/mcq"
                  ? "text-white font-bold border-white"
                  : ""
              } `}
            >
              <li className="">MCQ</li>
            </NavLink>
            <NavLink
              to={"/dashboard/sandbox"}
              onClick={closeSidebar}
              className={`p-2 w-full border-2 text-white hover:border-white border-transparent rounded-xl ${
                location.pathname === "/dashboard/sandbox"
                  ? "text-white font-bold border-white"
                  : ""
              } `}
            >
              <li className="">Sandbox</li>
            </NavLink>

            {isAdmin && (
              <>
                <hr className="my-2" />
                <NavLink
                  to={"/dashboard/add-tutorial"}
                  onClick={closeSidebar}
                  className={`p-2 w-full border-2 text-white hover:border-white border-transparent rounded-xl ${
                    location.pathname === "/dashboard/add-tutorial"
                      ? "text-white font-bold border-white"
                      : ""
                  } `}
                >
                  <li className="">Add Tutorial</li>
                </NavLink>
                <NavLink
                  to={"/dashboard/add-exercise"}
                  onClick={closeSidebar}
                  className={`p-2 w-full border-2 text-white hover:border-white border-transparent rounded-xl ${
                    location.pathname === "/dashboard/add-exercise"
                      ? "text-white font-bold border-white"
                      : ""
                  } `}
                >
                  <li className="">Add Exercise</li>
                </NavLink>
              </>
            )}
            <button
              className="btn bg-red-500 text-white border-none rounded-none hover:bg-red-600"
              onClick={() => logOut()}
            >
              Logout
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DashboardRoot;
