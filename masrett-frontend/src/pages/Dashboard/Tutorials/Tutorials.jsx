import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useGetUserInfo from "../../../hooks/useGetUserInfo";
import { TiTick } from "react-icons/ti";
import { TiTickOutline } from "react-icons/ti";

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageLoading, setImageLoading] = useState(false); // New state for image loading
  const { user } = useAuth();
  const { userInfo, refetchUserInfo } = useGetUserInfo();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get(
          "https://masrett-backend.vercel.app/tutorials"
        );
        setTutorials(response.data);
        if (response.data.length > 0) {
          setSelectedTutorial(response.data[0]); // Set first tutorial by default
        }
      } catch (err) {
        setError(err.message || "Error fetching tutorials");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const handleTutorialClick = async (tutorial) => {
    setImageLoading(true); // Start loading the image
    setSelectedTutorial(tutorial);
    try {
      await axios.post(
        "https://masrett-backend.vercel.app/add-viewed-tutorial",
        {
          email: user.email,
          tutorialId: tutorial._id,
        }
      );
      await refetchUserInfo();
    } catch (error) {
      console.error("Error adding viewed tutorial:", error.message);
    } finally {
      setImageLoading(false); // Stop loading the image
    }
  };

  const handleNext = () => {
    const currentIndex = tutorials.findIndex(
      (t) => t._id === selectedTutorial?._id
    );
    const nextIndex = (currentIndex + 1) % tutorials.length; // Loop to start
    handleTutorialClick(tutorials[nextIndex]); // Set next tutorial
    setSearchTerm(""); // Reset search term
  };

  const handlePrevious = () => {
    const currentIndex = tutorials.findIndex(
      (t) => t._id === selectedTutorial?._id
    );
    const prevIndex = (currentIndex - 1 + tutorials.length) % tutorials.length; // Loop to end
    handleTutorialClick(tutorials[prevIndex]); // Set previous tutorial
    setSearchTerm(""); // Reset search term
  };

  const filteredTutorials = tutorials.filter((tutorial) =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-black"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto py-5 px-1 md:px-5">
      <div className="flex flex-col-reverse xl:flex-row gap-2">
        <div className="xl:max-w-sm mt-5 xl:mt-0 w-full bg-base-200 rounded-xl py-4 px-1 h-fit">
          <h1 className="font-bold text-2xl text-center max-w-[70%] mx-auto mb-5">
            Pick any MSL pose that you wish to learn!
          </h1>
          <div className="w-full mb-4">
            <input
              type="text"
              placeholder="Search tutorials by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          {filteredTutorials.map((tutorial) => (
            <div
              key={tutorial._id}
              className={`p-4 ${
                selectedTutorial && selectedTutorial._id === tutorial._id
                  ? "bg-primary text-white"
                  : "hover:bg-primary"
              } rounded-xl mb-2 cursor-pointer hover:shadow-lg transition`}
              onClick={() => handleTutorialClick(tutorial)}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {userInfo?.viewedTutorialIDs?.includes(tutorial._id) ? (
                  <TiTick className="text-green-400" />
                ) : (
                  <TiTickOutline />
                )}
                {tutorial.title}
              </h2>
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-xl flex items-center justify-center">
          {selectedTutorial && (
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-center font-bold text-4xl mb-8 px-20 py-2 uppercase mx-auto rounded-3xl bg-base-200">
                {selectedTutorial.title}
              </h1>
              {imageLoading ? ( // Show loading spinner or placeholder while the image loads
                <div className="flex justify-center items-center max-w-[90%] w-full aspect-[16/9] mx-auto">
                  <div className="loader flex items-center justify-center w-full h-full">
                    <span className="loading loading-bars loading-lg text-black"></span>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedTutorial.image}
                  alt={selectedTutorial.title}
                  className="max-w-[90%] mx-auto"
                  onLoad={() => setImageLoading(false)} // Stop loading when image is loaded
                  onError={() => setImageLoading(false)} // Stop loading on error
                />
              )}
              <div className="flex justify-center gap-10 mt-4">
                <button
                  onClick={handlePrevious}
                  disabled={
                    !tutorials.find((t) => t._id === selectedTutorial?._id) ||
                    tutorials.length === 1
                  }
                  className="btn bg-primary text-white w-24 lg:w-48 border-none hover:bg-primary hover:text-white rounded-none"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    !tutorials.find((t) => t._id === selectedTutorial?._id) ||
                    tutorials.length === 1
                  }
                  className="btn bg-primary text-white w-24 lg:w-48 border-none hover:bg-primary hover:text-white rounded-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
