import { useState } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([null, null, null]);

  const handleChange = (e, index) => {
    const file = e.target.files[0];
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload Response:", data);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload 3 Images</h2>
        <form className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex flex-col">
              <label className="mb-1 font-medium">Image {index + 1}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(e, index)}
                className="border rounded px-3 py-2"
              />
            </div>
          ))}
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            onClick={handleUpload}
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
