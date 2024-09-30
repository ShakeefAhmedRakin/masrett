import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const { signInUser } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then(() => {
        toast.success("Successfully logged in. Redirecting...");
        e.target.reset();
        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-primary to-[#009bcc] flex justify-center items-center p-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-xl">
        <div className="bg-white flex justify-center flex-col p-10 md:p-20 lg:rounded-tr-none lg:rounded-br-none rounded-tl-2xl rounded-bl-none rounded-tr-2xl rounded-br-none">
          <h1 className="font-bold text-3xl mb-5 text-center">Sign In</h1>
          <form className="flex flex-col gap-3" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="input input-bordered w-full bg-gray-50 border-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              className="input input-bordered w-full bg-gray-50 border-none"
            />
            <p className="text-secondary link text-center font-bold">
              Forgot Password?
            </p>
            <button
              className="btn bg-primary hover:bg-primary text-white border-none rounded-none"
              type="submit"
            >
              Sign In
            </button>
          </form>
        </div>
        <div className="bg-primary flex justify-center flex-col p-10 md:p-20 lg:rounded-tr-2xl lg:rounded-br-2xl lg:rounded-bl-none lg:rounded-tl-none rounded-tr-none rounded-br-2xl rounded-bl-2xl rounded-tl-none">
          <h1 className="text-center text-white font-bold text-4xl">
            Welcome Back!
          </h1>
          <p className="text-center mt-4 mb-5 text-white text-sm">
            Enter your credentials to sign in!
          </p>
          <p className="text-center mt-4 mb-5 text-white text-sm">
            Don't have an account?
          </p>
          <p
            className="link text-secondary font-bold text-center text-2xl"
            onClick={() => navigate("/register")}
          >
            Sign Up!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
