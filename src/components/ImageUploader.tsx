
import React, { useState } from "react";
import axios from "axios";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface ImageUploaderProps {
  onImagesUploaded: (images: any[]) => void;
  setIsLoading: (loading: boolean) => void;
}

interface UploadState {
  file: File | null;
  preview: string;
  progress: number;
  error: string;
  uploading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded, setIsLoading }) => {
  const initialState: UploadState = { file: null, preview: "", progress: 0, error: "", uploading: false };
  
  const [uploadStates, setUploadStates] = useState<UploadState[]>([
    { ...initialState },
    { ...initialState },
    { ...initialState }
  ]);

  // Handle file selection for each upload slot
  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setUploadStates(prev => {
          const updated = [...prev];
          updated[index] = { 
            ...prev[index], 
            error: "Please select an image file",
            file: null,
            preview: ""
          };
          return updated;
        });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadStates(prev => {
          const updated = [...prev];
          updated[index] = { 
            ...prev[index], 
            file: file,
            preview: e.target?.result as string,
            error: "",
            progress: 0
          };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload all images that have files
  const handleUpload = async () => {
    const filesToUpload = uploadStates.filter(state => state.file);
    
    if (filesToUpload.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Mark all files with content as uploading
    setUploadStates(prev => 
      prev.map(state => state.file ? { ...state, uploading: true, progress: 0 } : state)
    );

    try {
      const uploadedImages = [];

      // Upload each file one by one
      for (let i = 0; i < uploadStates.length; i++) {
        const state = uploadStates[i];
        if (!state.file) continue;

        try {
          // Step 1: Get upload URL from our server
          const urlResponse = await axios.post('http://localhost:5000/api/images/upload-url', {
            imageType: state.file.type
          });

          const { signature, timestamp, cloudName, apiKey, folder } = urlResponse.data;

          // Step 2: Create form data for Cloudinary
          const formData = new FormData();
          formData.append('file', state.file);
          formData.append('signature', signature);
          formData.append('timestamp', timestamp);
          formData.append('api_key', apiKey);
          formData.append('folder', folder);

          // Step 3: Upload directly to Cloudinary
          const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 100);
                setUploadStates(prev => {
                  const updated = [...prev];
                  updated[i] = { ...prev[i], progress };
                  return updated;
                });
              }
            }
          );

          // Step 4: Save the image reference to our database
          const cloudinaryUrl = uploadResponse.data.secure_url;
          const publicId = uploadResponse.data.public_id;

          const saveResponse = await axios.post('http://localhost:5000/api/images/save', {
            cloudinaryUrl,
            publicId,
            imageType: state.file.type
          });

          // Add to uploaded images
          uploadedImages.push(saveResponse.data.image);

          // Update state to show success
          setUploadStates(prev => {
            const updated = [...prev];
            updated[i] = { 
              ...prev[i], 
              uploading: false,
              progress: 100
            };
            return updated;
          });
        } catch (error) {
          console.error(`Error uploading image ${i}:`, error);
          
          // Update state to show error
          setUploadStates(prev => {
            const updated = [...prev];
            updated[i] = { 
              ...prev[i], 
              error: "Failed to upload image",
              uploading: false
            };
            return updated;
          });
        }
      }

      // Notify parent component of the newly uploaded images
      if (uploadedImages.length > 0) {
        onImagesUploaded(uploadedImages);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Something went wrong during the upload process",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset a specific upload slot
  const resetUpload = (index: number) => {
    setUploadStates(prev => {
      const updated = [...prev];
      updated[index] = { ...initialState };
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uploadStates.map((state, index) => (
          <Card key={index} className="p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center space-y-4">
              {state.preview ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={state.preview} 
                    alt={`Upload preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {state.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-center text-white">
                        <div className="mb-2">{state.progress}%</div>
                        <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${state.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      className="w-12 h-12 mx-auto mb-2"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
                      />
                    </svg>
                    <p>Image {index + 1}</p>
                  </div>
                </div>
              )}
              
              <div className="w-full">
                {state.error && (
                  <p className="text-red-500 text-sm mb-2">{state.error}</p>
                )}

                {state.progress === 100 ? (
                  <div className="text-green-500 text-center flex items-center justify-center space-x-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span>Uploaded!</span>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <label className={`flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600 transition-colors ${state.uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {state.file ? 'Change Image' : 'Select Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(index, e)}
                        disabled={state.uploading}
                      />
                    </label>
                    {state.file && !state.uploading && (
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => resetUpload(index)}
                        className="bg-white hover:bg-gray-100"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleUpload}
          disabled={uploadStates.every(state => !state.file || state.uploading || state.progress === 100)}
          className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          {uploadStates.some(state => state.uploading) ? (
            <span className="flex items-center">
              <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Images'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
