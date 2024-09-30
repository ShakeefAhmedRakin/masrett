import { useState } from "react";
import axios from "axios";
import useCheckAdminRole from "../../../hooks/useCheckAdminRole";
import { toast } from "sonner";

const AddExercise = () => {
  const { isAdmin, loading } = useCheckAdminRole();
  const [activeTab, setActiveTab] = useState("MCQ");

  // Form state
  const [imageFile, setImageFile] = useState(null);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = [option1, option2, option3, option4];

    if (!imageFile) {
      setMessage("Please upload an image.");
      return;
    }

    try {
      // Step 1: Upload the image to Imgbb
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOSTING_KEY
        }`,
        formData
      );

      const imageUrl = imgbbResponse.data.data.url;

      // Step 2: Save the MCQ exercise to your database
      await axios.post("https://masrett-backend.vercel.app/add-mcq-exercise", {
        imageUrl,
        options,
      });

      toast.success("MCQ exercise added successfully!");
      setImageFile(null);
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
    } catch (error) {
      setMessage("Error adding exercise.");
    }
  };

  if (loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center pt-16">
        <span className="loading loading-bars loading-lg text-black"></span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-[90vh] flex flex-col gap-2 justify-center items-center">
        <h1 className="text-3xl font-bold text-red-500">NOT ALLOWED</h1>
        <p>LACKING CREDENTIALS</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Tabs for navigation */}
      <div className="flex justify-center mb-4 gap-2">
        <button
          onClick={() => setActiveTab("MCQ")}
          className={`btn bg-primary border-none ${
            activeTab === "MCQ" ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          Add MCQ Exercise
        </button>
        <button
          onClick={() => setActiveTab("WIP")}
          className={`btn bg-primary border-none ${
            activeTab === "WIP" ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          Work-In-Progress
        </button>
      </div>

      {/* Content for active tab */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        {activeTab === "MCQ" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add MCQ Exercise</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full bg-gray-50 border-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Option 1 (Correct Answer)
                </label>
                <input
                  type="text"
                  value={option1}
                  placeholder="Correct Option"
                  onChange={(e) => setOption1(e.target.value)}
                  className="input input-bordered w-full bg-green-50 border-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Option 2</label>
                <input
                  type="text"
                  value={option2}
                  placeholder="Other Options"
                  onChange={(e) => setOption2(e.target.value)}
                  className="input input-bordered w-full bg-red-50 border-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Option 3</label>
                <input
                  type="text"
                  value={option3}
                  placeholder="Other Options"
                  onChange={(e) => setOption3(e.target.value)}
                  className="input input-bordered w-full bg-red-50 border-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Option 4</label>
                <input
                  type="text"
                  value={option4}
                  placeholder="Other Options"
                  onChange={(e) => setOption4(e.target.value)}
                  className="input input-bordered w-full bg-red-50 border-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn bg-primary hover:bg-primary border-none rounded-none text-white w-full"
              >
                Add Exercise
              </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        )}

        {activeTab === "WIP" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Work-In-Progress</h2>
            <p>This section is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExercise;
