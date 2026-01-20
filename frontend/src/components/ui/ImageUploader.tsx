import { useState, useCallback } from 'react';
import { uploadsApi } from '@/api';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (images.length + files.length > maxImages) {
        setUploadError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const uploadPromises = Array.from(files).map((file) =>
          uploadsApi.upload(file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        onChange([...images, ...uploadedUrls]);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to upload images. Please try again.');
      } finally {
        setIsUploading(false);
        // Reset the input
        e.target.value = '';
      }
    },
    [images, onChange, maxImages]
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            <span className={`btn-outline inline-flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Images
                </>
              )}
            </span>
          </label>
          <span className="text-sm text-muted-foreground">
            {images.length}/{maxImages} images
          </span>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-sm text-danger">{uploadError}</p>
      )}
    </div>
  );
}

export default ImageUploader;
