import { useState } from "react";
import useCheckAdminRole from "../../../hooks/useCheckAdminRole";
import axios from "axios";
import { toast } from "sonner";

const AddTutorial = () => {
  const { isAdmin, loading } = useCheckAdminRole();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) {
      setError("Please provide a label and an image.");
      return;
    }

    setUploading(true);
    setError("");

    // Upload image to ImgBB
    const formData = new FormData();
    formData.append("image", image);

    try {
      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOSTING_KEY
        }`, // Replace with your ImgBB API key
        formData
      );

      const imageUrl = imgbbResponse.data.data.url; // Get the uploaded image URL

      // Send the tutorial data to your API
      const tutorialResponse = await axios.post(
        "https://masrett-backend.vercel.app/tutorials",
        {
          image: imageUrl,
          title,
        }
      );

      console.log(tutorialResponse.data);
      setTitle("");
      setImage(null);
      toast.success("Tutorial added successfully!");
    } catch (err) {
      setError("Failed to upload image or add tutorial. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
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
    <div className="h-[90vh]">
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Add Sign Language Tutorial</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Sign Language Label
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full bg-gray-50 border-none"
            placeholder="Enter Label"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image Representing The Sign
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full bg-gray-50 border-none"
            accept="image/*"
            required
          />
        </div>
        {uploading ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <button
            type="submit"
            className="btn bg-primary hover:bg-primary text-white border-none rounded-none w-full"
          >
            Add Tutorial
          </button>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddTutorial;
