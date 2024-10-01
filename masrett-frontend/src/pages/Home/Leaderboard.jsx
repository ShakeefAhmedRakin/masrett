import axios from "axios";
import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `https://masrett-backend.vercel.app/top-scores`
      );
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  return (
    <div>
      {/* Leaderboard Section */}
      <div className="leaderboard bg-white py-3 rounded max-w-7xl container mx-auto my-10">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>{" "}
                {/* Rank starts from 1 */}
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2 text-right">{user.highestMCQScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
