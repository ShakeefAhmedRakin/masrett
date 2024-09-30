import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { MdOutlineLeaderboard } from "react-icons/md";

const DashboardHome = () => {
  const [tutorialsInfo, setTutorialsInfo] = useState({ viewed: 0, total: 0 });
  const [highestMcqScore, setHighestMcqScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user } = useAuth();

  // Fetch tutorials viewed for the specific user
  const fetchTutorialsViewed = async () => {
    try {
      const response = await axios.get(
        `https://masrett-backend.vercel.app/viewed`,
        {
          params: { email: user.email },
        }
      );
      setTutorialsInfo(response.data);
    } catch (error) {
      console.error("Error fetching viewed tutorials:", error);
    }
  };

  // Fetch highest MCQ score for the specific user
  const fetchHighestMcqScore = async () => {
    try {
      const response = await axios.get(
        `https://masrett-backend.vercel.app/highest-score`,
        {
          params: { email: user.email },
        }
      );
      setHighestMcqScore(response.data.highestScore);
    } catch (error) {
      console.error("Error fetching highest MCQ score:", error);
    }
  };

  // Fetch top 10 leaderboard scores
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
    fetchTutorialsViewed();
    fetchHighestMcqScore();
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Card for Tutorials Viewed */}
        <div className="card bg-base-200 flex justify-center items-center p-10 rounded">
          <div
            className="radial-progress progress-success text-center font-bold text-lg text-green-600"
            style={{
              "--value": `${
                (tutorialsInfo.viewed / tutorialsInfo.total) * 100
              }`,
              "--size": "12rem",
              "--thickness": "2rem",
            }}
            role="progressbar"
          >
            {tutorialsInfo.viewed}/{tutorialsInfo.total}
            <br></br>
            Tutorials
          </div>
        </div>

        {/* Card for Highest MCQ Score */}
        <div className="card bg-base-200 flex justify-center items-center p-10 rounded">
          <div
            className="radial-progress progress-success text-center font-bold text-lg text-[#ffbf49]"
            style={{
              "--value": `100`,
              "--size": "12rem",
              "--thickness": "2rem",
            }}
            role="progressbar"
          >
            {highestMcqScore}
            <br></br>
            Score
          </div>
        </div>
      </div>
      <h1 className="flex gap-2 items-center text-3xl text-gray-700 font-bold">
        <MdOutlineLeaderboard></MdOutlineLeaderboard>Leaderboard
      </h1>
      {/* Leaderboard Section */}
      <div className="leaderboard bg-white py-3 rounded max-w-7xl">
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

export default DashboardHome;
