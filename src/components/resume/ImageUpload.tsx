import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | undefined) => void;
  isEditMode: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  isEditMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
  };

  const handleImageClick = () => {
    if (isEditMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isEditMode && !currentImage) {
    return null;
  }

  return (
    <div className="relative group">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Profile"
            className={`w-20 h-20 rounded-full object-cover border-2 ${
              isEditMode ? 'cursor-pointer hover:opacity-80' : ''
            }`}
            onClick={handleImageClick}
          />
          {isEditMode && (
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="destructive"
                className="h-6 w-6 p-0 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        isEditMode && (
          <div
            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            onClick={handleImageClick}
          >
            <Camera className="h-6 w-6 text-gray-400" />
          </div>
        )
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;