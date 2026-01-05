import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cn from '../utils/class-names';

/**
 * File upload component with drag and drop support - Isomorphic style
 */
export default function UploadZone({
  name,
  value,
  onChange,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
  },
  maxSize = 5242880, // 5MB
  className,
  disabled = false
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');

    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File is too large. Maximum size is 5MB.');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an image.');
      } else {
        setError(rejection.errors[0].message);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onChange?.(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.(null);
    setError('');
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center w-full min-h-[180px] px-6 py-8',
          'border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500 bg-red-50'
        )}
      >
        <input {...getInputProps()} name={name} />

        {preview ? (
          <div className="relative w-full h-full min-h-[140px] flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-[200px] object-contain rounded"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md text-lg font-semibold"
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            {/* Cloud Upload Icon */}
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
              <svg
                className="w-7 h-7 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <p className="text-base font-medium text-gray-700 mb-1">
              {isDragActive ? (
                'Drop the file here'
              ) : (
                'Drop or select file'
              )}
            </p>

            {!isDragActive && (
              <p className="text-sm text-gray-500">
                Drop files here or click to upload
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {value && typeof value === 'string' && !preview && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Current image:</p>
          <img
            src={value}
            alt="Current"
            className="w-full max-w-[200px] h-auto object-cover rounded border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}
