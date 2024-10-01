import { useEffect, useState, useRef } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { MdOutlineLeaderboard } from "react-icons/md";
import { IoCameraReverseSharp } from "react-icons/io5";
import { toast } from "sonner";

const DashboardHome = () => {
  const [tutorialsInfo, setTutorialsInfo] = useState({ viewed: 0, total: 0 });
  const [highestMcqScore, setHighestMcqScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user, updateProfilePicture } = useAuth();
  const fileInputRef = useRef(null);

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

  // Handle profile picture update
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        toast.info("Updating profile picture..");
        const formData = new FormData();
        formData.append("image", file);

        // Upload image to Imgbb
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGE_HOSTING_KEY
          }`,
          formData
        );

        // Get image URL and update profile picture
        const imageUrl = response.data.data.url;
        await updateProfilePicture(imageUrl);
        toast.success("Profile picture updated successfully!");

        // Hard reload the page after successful update
        window.location.reload();
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  // Trigger file input on icon click
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTutorialsViewed();
    fetchHighestMcqScore();
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
                    <td
                      className={`px-4 py-2 ${
                        index == 0 && "text-yellow-500"
                      } ${index == 1 && "text-red-500"} ${
                        index == 2 && "text-blue-500"
                      } font-bold`}
                    >
                      {index + 1}
                    </td>{" "}
                    {/* Rank starts from 1 */}
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2 text-right">
                      {user.highestMCQScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="relative bg-base-200 flex flex-col justify-start items-center p-10 rounded gap-1 h-fit">
          <div className="relative">
            <img
              src={user.photoURL}
              className="w-64 aspect-square object-cover rounded-xl"
              alt="Profile"
            />
            <button
              className="absolute bottom-4 right-4 bg-gray-200 rounded-full shadow-md btn btn-circle"
              onClick={handleIconClick}
            >
              <IoCameraReverseSharp className="text-3xl text-yellow-500" />
            </button>
          </div>
          <h1 className="font-bold text-4xl">{user.displayName}</h1>
          <p className="text-lg">{user.email}</p>

          {/* Icon for changing profile picture */}

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfilePictureChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
