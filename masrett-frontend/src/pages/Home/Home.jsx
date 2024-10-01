import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="bg-primary relative">
      <div className="container mx-auto md:px-12">
        <div className="text-white text-center py-32 relative">
          <h1 className="font-bold text-5xl">
            Malaysian Sign Language Real Time Tutorial
          </h1>
          <p className="max-w-[90%] mx-auto mt-10">
            MASRETT is an innovative educational platform for learning Malaysian
            Sign Language (MSL) interactively. Using your webcam, you can
            practice signing MSL and reinforce your skills through engaging
            tutorials, exercises, and a sandbox mode for self-practice. Whether
            you're a beginner or looking to improve, MASRETT provides a
            comprehensive and accessible way to master MSL. Start your journey
            with MASRETT today and discover the joy of signing!
          </p>
          {user ? (
            <button
              className="btn bg-secondary hover:bg-secondary text-white border-none rounded mt-10 px-10"
              onClick={() => navigate("/dashboard")}
            >
              Your Dashboard
            </button>
          ) : (
            <button
              className="btn bg-secondary hover:bg-secondary text-white border-none rounded mt-10 px-10"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          )}
          <div className="flex justify-center mt-10 px-1">
            <img src="/home-pic.PNG" className="" />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 z-0 overflow-hidden transform rotate-180">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#00b6f0"
            d="M0,160L48,176C96,192,192,224,288,208C384,192,480,128,576,128C672,128,768,192,864,197.3C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Home;
