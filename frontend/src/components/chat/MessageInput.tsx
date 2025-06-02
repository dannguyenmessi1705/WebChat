import React, { useState, useRef, useCallback } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import apiService from "../../services/api";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    adjustTextareaHeight(); // Handle typing indicator
    if (onTypingStart) {
      onTypingStart();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingStop) {
          onTypingStop();
        }
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage && !attachedFile) return;
    try {
      let finalContent = trimmedMessage;

      // Handle file upload
      if (attachedFile) {
        setIsUploading(true);
        try {
          const uploadResponse = await apiService.uploadFile(attachedFile);
          finalContent = uploadResponse.url;
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          alert("Không thể tải lên tệp. Vui lòng thử lại.");
          return;
        } finally {
          setIsUploading(false);
        }
      } // Send message
      await onSendMessage(finalContent);

      // Reset form
      setMessage("");
      setAttachedFile(null);
      setPreviewUrl(null);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Stop typing indicator
      if (onTypingStop) {
        onTypingStop();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Kích thước tệp không được vượt quá 10MB");
      return;
    }

    setAttachedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setPreviewUrl(null);
  };

  const isDisabled =
    disabled || isUploading || (!message.trim() && !attachedFile);
  return (
    <div className="border-t border-gray-200 bg-white">
      {/* File Preview */}
      {(attachedFile || previewUrl) && (
        <div className="border-b border-gray-100 px-3 py-2 sm:px-4">
          <div className="flex items-start space-x-2 rounded-lg bg-gray-50 p-2 sm:space-x-3 sm:p-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
              />
            ) : (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 sm:h-16 sm:w-16">
                <PaperClipIcon className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {attachedFile?.name}
              </p>
              <p className="text-xs text-gray-500">
                {attachedFile && (attachedFile.size / 1024 / 1024).toFixed(2)}{" "}
                MB
              </p>
            </div>
            <button
              onClick={removeAttachment}
              className="flex-shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
              aria-label="Xóa tệp đính kèm"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        <div className="flex items-end space-x-2 sm:space-x-3">
          {/* File Attachment Button */}
          <div className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
              aria-label="Đính kèm tệp"
            >
              <PaperClipIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Message Input */}
          <div className="relative min-w-0 flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              disabled={isUploading}
              className="max-h-30 w-full resize-none rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-base"
              rows={1}
              style={{ minHeight: "40px", fontSize: "16px" }} // 16px prevents zoom on iOS
            />
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-shrink-0 items-center space-x-1 sm:space-x-2">
            {/* Image Attachment Button - Hide on very small screens */}
            <div className="xs:block hidden">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 sm:p-2"
                aria-label="Đính kèm hình ảnh"
              >
                <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </label>
            </div>
            {/* Emoji Button - Hide on small screens */}
            <div className="hidden sm:block">
              <button
                type="button"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 sm:p-2"
                title="Emoji (sẽ được thêm sau)"
                aria-label="Chọn emoji"
              >
                <FaceSmileIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>{" "}
            {/* Send Button */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg p-1.5 transition-colors sm:p-2 ${
                isDisabled
                  ? "cursor-not-allowed text-gray-400"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
              }`}
              aria-label="Gửi tin nhắn"
            >
              {isUploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-5 sm:w-5" />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span>Đang tải lên...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
