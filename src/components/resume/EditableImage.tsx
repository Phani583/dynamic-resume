import React, { useState, useRef } from 'react';
import { Camera, Edit, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLiveEditing } from './LiveEditingProvider';
import { ImageEditor } from './ImageEditor';
import { cn } from '@/lib/utils';

interface EditableImageProps {
  value: string;
  path: string[];
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  shape?: 'square' | 'circle';
}

export const EditableImage: React.FC<EditableImageProps> = ({
  value,
  path,
  className,
  style,
  width = 80,
  height = 80,
  shape = 'circle'
}) => {
  const { isEditMode, updateData } = useLiveEditing();
  const [showEditor, setShowEditor] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateData(path, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditClick = () => {
    if (value) {
      setShowEditor(true);
    }
  };

  const handleRemoveImage = () => {
    updateData(path, '');
  };

  const handleSaveEdited = (editedImageUrl: string) => {
    updateData(path, editedImageUrl);
  };

  const containerClasses = cn(
    'relative inline-block border-2 border-dashed border-gray-300 transition-all duration-200',
    shape === 'circle' ? 'rounded-full' : 'rounded-lg',
    isEditMode && 'hover:border-blue-400 hover:bg-blue-50/50',
    className
  );

  const imageClasses = cn(
    'object-cover',
    shape === 'circle' ? 'rounded-full' : 'rounded-lg'
  );

  return (
    <>
      <div
        className={containerClasses}
        style={{ width, height, ...style }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Profile"
              className={imageClasses}
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Edit Overlay */}
            {isEditMode && isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-1 rounded-full">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={handleUploadClick}
                  title="Replace Image"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={handleEditClick}
                  title="Edit Image"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={handleRemoveImage}
                  title="Remove Image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          isEditMode && (
            <div
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
              onClick={handleUploadClick}
            >
              <Camera className="h-6 w-6 mb-1" />
              <span className="text-xs">Add Photo</span>
            </div>
          )
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Editor */}
      {showEditor && value && (
        <ImageEditor
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          imageUrl={value}
          onSave={handleSaveEdited}
        />
      )}
    </>
  );
};