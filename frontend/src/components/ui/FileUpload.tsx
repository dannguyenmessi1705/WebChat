import React, { useRef, useState } from "react";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  config,
  isFileTypeAllowed,
  isFileSizeAllowed,
  formatFileSize,
} from "../../config";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const isImage = file.type.startsWith("image/");

  return (
    <div className="relative rounded-lg border border-gray-300 bg-gray-50 p-2">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>

      <div className="flex items-center space-x-2">
        {isImage ? (
          preview ? (
            <img
              src={preview}
              alt={file.name}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <PhotoIcon className="h-10 w-10 text-gray-400" />
          )
        ) : (
          <DocumentIcon className="h-10 w-10 text-gray-400" />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
    </div>
  );
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  multiple = false,
  accept,
  maxSize = config.MAX_FILE_SIZE,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (!isFileSizeAllowed(file.size)) {
      return `File "${file.name}" quá lớn. Kích thước tối đa là ${formatFileSize(maxSize)}.`;
    }

    if (!isFileTypeAllowed(file.type)) {
      return `File "${file.name}" không được hỗ trợ.`;
    }

    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (multiple) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
    }

    setErrors(newErrors);

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
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

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-gray-400"
        } `}
      >
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              {dragOver ? "Thả file vào đây" : "Chọn file hoặc kéo thả"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Hỗ trợ:{" "}
              {config.ALLOWED_FILE_TYPES.map((type) => {
                const extension = type.split("/")[1];
                return extension.toUpperCase();
              }).join(", ")}
            </p>
            <p className="text-xs text-gray-500">
              Kích thước tối đa: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            File đã chọn ({selectedFiles.length}):
          </p>
          <div className="grid gap-2">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => handleRemoveFile(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
