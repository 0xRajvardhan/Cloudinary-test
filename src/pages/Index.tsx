
import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "../components/ImageUploader";
import UploadedImagesList from "../components/UploadedImagesList";
import { toast } from "../components/ui/use-toast";

const Index = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch already uploaded images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        setUploadedImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Error",
          description: "Failed to fetch uploaded images",
          variant: "destructive",
        });
      }
    };

    fetchImages();
  }, []);

  // Handler for when images are successfully uploaded
  const handleImagesUploaded = (newImages) => {
    setUploadedImages((prev) => [...newImages, ...prev]);
    toast({
      title: "Success",
      description: `${newImages.length} image(s) uploaded successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Image Vault Express</h1>
          <p className="text-xl text-gray-600">Upload and store your images securely</p>
        </header>
        
        <main>
          <ImageUploader 
            onImagesUploaded={handleImagesUploaded} 
            setIsLoading={setIsLoading} 
          />
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Uploaded Images</h2>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <UploadedImagesList images={uploadedImages} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
