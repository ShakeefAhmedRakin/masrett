import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState({ viewedTutorialIDs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `https://masrett-backend.vercel.app/users/${user.email}`
      );
      setUserInfo(response.data);
    } catch (err) {
      setError(err.message || "Error fetching user info");
    } finally {
      setLoading(false);
    }
  };

  const refetchUserInfo = () => {
    setLoading(true);
    fetchUserInfo();
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info on mount
  }, [user]);

  return { userInfo, loading, error, refetchUserInfo };
};

export default useGetUserInfo;
