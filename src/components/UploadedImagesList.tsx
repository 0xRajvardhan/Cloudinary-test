
import React from 'react';
import { Card } from "./ui/card";

interface Image {
  _id: string;
  cloudinaryUrl: string;
  publicId: string;
  imageType: string;
  uploadDate: string;
}

interface UploadedImagesListProps {
  images: Image[];
}

const UploadedImagesList: React.FC<UploadedImagesListProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <Card key={image._id} className="overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="aspect-square relative">
            <img
              src={image.cloudinaryUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <p className="text-sm text-gray-500 truncate">
              {new Date(image.uploadDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 truncate">{image.imageType}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UploadedImagesList;
