import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";
import axios from "axios"; // Axios for API requests

const Register = () => {
  const { createUser, addUsernamePhoto, signInUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;

    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const role = "user"; // You can adjust this role as needed

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters or longer");
      return;
    } else if (!/[A-Z]/.test(password)) {
      toast.error("Password must have an upper case letter");
      return;
    } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      toast.error("Password must have a special character");
      return;
    }

    try {
      // Step 1: Create user using Firebase
      await createUser(email, password);
      await addUsernamePhoto(username, "https://i.ibb.co/gTgLjFj/219970.png");

      // Step 2: Register user in MongoDB backend
      await axios.post("https://masrett-backend.vercel.app/register", {
        username: username,
        role: role,
        email: email,
      });

      // Step 3: Sign the user in
      await logOut(); // Log out to refresh session
      await signInUser(email, password);

      toast.success("Successfully registered. Redirecting...");
      form.reset();
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-primary to-[#009bcc] flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-xl">
        <div className="bg-white flex justify-center flex-col p-10 md:p-20 lg:rounded-tl-2xl lg:rounded-bl-2xl lg:rounded-tr-none lg:rounded-br-none rounded-tl-2xl rounded-bl-none rounded-tr-2xl rounded-br-none">
          <h1 className="font-bold text-3xl mb-5 text-center">Sign Up</h1>
          <form className="flex flex-col gap-3" onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Your Username"
              name="username"
              className="input input-bordered w-full bg-gray-50 border-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="input input-bordered w-full bg-gray-50 border-none"
            />
            <input
              type="password"
              placeholder="Your Password"
              name="password"
              className="input input-bordered w-full bg-gray-50 border-none"
            />
            <button
              className="btn bg-primary hover:bg-primary text-white border-none rounded-none"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="bg-primary flex justify-center flex-col p-10 md:p-20 lg:rounded-tr-2xl lg:rounded-br-2xl lg:rounded-bl-none lg:rounded-tl-none rounded-tr-none rounded-br-2xl rounded-bl-2xl rounded-tl-none">
          <h1 className="text-center text-white font-bold text-4xl">
            Welcome!
          </h1>
          <p className="text-center mt-4 mb-5 text-white text-sm">
            Enter your credentials to get started!
          </p>
          <p className="text-center mt-4 mb-5 text-white text-sm">
            Already have an account?
          </p>
          <p
            onClick={() => navigate("/login")}
            className="link text-secondary font-bold text-center text-2xl"
          >
            Sign In!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
