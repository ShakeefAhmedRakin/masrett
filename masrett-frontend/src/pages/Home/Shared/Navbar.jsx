import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useCheckAdminRole from "../../../hooks/useCheckAdminRole";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logOut } = useAuth();

  console.log(useCheckAdminRole());

  const links = (
    <>
      <li>
        <NavLink
          to={"/about"}
          className={`hover:underline duration-300 underline-offset-4 ${
            location.pathname == "/about" ? "underline font-medium" : ""
          }`}
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/leaderboard"}
          className={`hover:underline duration-300 underline-offset-4  ${
            location.pathname == "/leaderboard" ? "underline font-medium" : ""
          }`}
        >
          Leaderboard
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to={"/dashboard"}
            className={`hover:underline duration-300 underline-offset-4  ${
              location.pathname == "/dashboard" ? "underline font-medium" : ""
            }`}
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );
  return (
    <div className="bg-primary">
      <div className="navbar container mx-auto py-6 md:px-12">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <h1 className="font-bold text-2xl">MASRETT</h1>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-4 text-white px-1">{links}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <>
              <a
                className="btn bg-transparent hover:bg-white rounded-none text-white hover:text-black hover:border-white px-8"
                onClick={() => logOut()}
              >
                Log Out
              </a>
            </>
          ) : (
            <>
              <a
                className="btn bg-transparent hover:bg-white rounded-none text-white hover:text-black hover:border-white px-8"
                onClick={() => navigate("/login")}
              >
                Sign In
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
