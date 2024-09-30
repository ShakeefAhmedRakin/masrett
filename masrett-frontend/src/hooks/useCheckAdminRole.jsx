import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const useCheckAdminRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: firebaseLoading } = useAuth();

  useEffect(() => {
    if (firebaseLoading || !user?.email) return; // Check if loading or email is not available

    const checkRole = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://masrett-backend.vercel.app/role?email=${user.email}`
        );
        const { role } = response.data;

        // Check if the role is 'admin'
        setIsAdmin(role === "admin");
      } catch (err) {
        setError(err.message || "Error fetching user role");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();

    // Optional: Cleanup function to avoid setting state on an unmounted component
    return () => {
      setIsAdmin(false);
      setLoading(true);
      setError(null);
    };
  }, [firebaseLoading, user?.email]); // Depend on firebaseLoading and user.email

  return { isAdmin, loading, error };
};

export default useCheckAdminRole;
