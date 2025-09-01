import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadImageToImgBB, uploadMultipleImages } from '../../lib/imgbb';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  className = ''
}) => {
  const { language } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    
    if (fileArray.length > remainingSlots) {
      toast.error(
        language === 'en' 
          ? `You can only upload ${remainingSlots} more image(s)`
          : `Vous ne pouvez télécharger que ${remainingSlots} image(s) de plus`
      );
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error(
        language === 'en' 
          ? 'Please select only JPG, PNG, or WebP images'
          : 'Veuillez sélectionner uniquement des images JPG, PNG ou WebP'
      );
      return;
    }

    // Validate file sizes (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(
        language === 'en' 
          ? 'Each image must be smaller than 5MB'
          : 'Chaque image doit faire moins de 5MB'
      );
      return;
    }

    setUploading(true);

    try {
      let uploadedUrls: string[];
      
      if (fileArray.length === 1) {
        const url = await uploadImageToImgBB(fileArray[0]);
        uploadedUrls = [url];
      } else {
        uploadedUrls = await uploadMultipleImages(fileArray);
      }

      onImagesChange([...images, ...uploadedUrls]);
      
      toast.success(
        language === 'en' 
          ? `${uploadedUrls.length} image(s) uploaded successfully!`
          : `${uploadedUrls.length} image(s) téléchargée(s) avec succès !`
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to upload images. Please try again.'
          : 'Échec du téléchargement des images. Veuillez réessayer.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {language === 'en' ? 'Property Images' : 'Images de la Propriété'} ({images.length}/{maxImages})
      </label>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? 'border-geocasa-blue bg-blue-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-geocasa-blue hover:bg-gray-50'
        } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader className="h-12 w-12 text-geocasa-blue animate-spin mb-4" />
            <p className="text-gray-600">
              {language === 'en' ? 'Uploading images...' : 'Téléchargement des images...'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              {language === 'en' 
                ? 'Drag and drop images here, or click to select'
                : 'Glissez-déposez les images ici, ou cliquez pour sélectionner'
              }
            </p>
            <p className="text-sm text-gray-500">
              {language === 'en' 
                ? 'JPG, PNG, WebP up to 5MB each'
                : 'JPG, PNG, WebP jusqu\'à 5MB chacune'
              }
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Property image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-geocasa-blue text-white text-xs px-2 py-1 rounded">
                  {language === 'en' ? 'Main' : 'Principal'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Instructions */}
      <div className="mt-2 text-xs text-gray-500">
        {language === 'en' 
          ? 'The first image will be used as the main property image. You can reorder by removing and re-uploading.'
          : 'La première image sera utilisée comme image principale. Vous pouvez réorganiser en supprimant et re-téléchargeant.'
        }
      </div>
    </div>
  );
};

export default ImageUploader;