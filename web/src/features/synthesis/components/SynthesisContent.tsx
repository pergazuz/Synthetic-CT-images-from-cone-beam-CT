import React, { useState, useEffect, useRef } from "react";
import { FaCaretRight, FaImage, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultContent = () => {
  // State for the selected file (only one allowed)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State for tracking drag events
  const [isDragging, setIsDragging] = useState(false);
  // State for storing the preview URL of the selected file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // State to track loading when arrow is clicked
  const [isLoading, setIsLoading] = useState(false);
  // Reference to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);
  // React Router's navigation hook
  const navigate = useNavigate();

  /**
   * Update the preview URL whenever a new file is selected.
   * Clean up the object URL to prevent memory leaks.
   */
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  /**
   * Handle file drop by selecting the first dropped file.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  /**
   * Allow file drop by preventing default behavior and updating drag state.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Reset the drag state when the dragged item leaves the drop zone.
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handle file input changes from clicking on the area.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  /**
   * Trigger the file input when clicking on the drop zone.
   */
  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle click on the arrow button.
   * If an image is uploaded, display a loading spinner and navigate.
   * Otherwise, alert using Toastify.
   */
  const handleArrowClick = () => {
    if (!selectedFile) {
      toast.error("Please upload an image!");
      return;
    }
    setIsLoading(true);
    // Simulate a delay for loading animation before navigation
    setTimeout(() => {
      navigate("/result");
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Outer flex container to position upload and processing sections */}
      <div className="flex w-3/4 max-w-4xl gap-4">
        {/* Left side: Upload/Preview section inside a white card */}
        <div className="flex-1 bg-white shadow-xl rounded-lg p-6">
          <div className="flex flex-col items-center justify-center">
            {/* Drop zone */}
            <div
              className={`w-full h-96 flex items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
                isDragging ? "border-blue-400" : "border-gray-300"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleZoneClick}
            >
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <FaImage className="text-gray-400 text-6xl" />
              )}
            </div>
            <h2 className="text-md font-semibold mt-4">
              Please upload the CBCT images
            </h2>
          </div>
        </div>

        {/* Right side: Processing status (no background color) */}
        <div className="flex-1 flex flex-col justify-center items-center">
          {isLoading ? (
            <>
              <p className="text-2xl font-medium mb-2">Processing ...</p>
              <p className="text-gray-600 mb-4">
                Please waiting for your CT
              </p>
            </>
          ) : selectedFile ? (
            <>
              <p className="text-2xl font-medium mb-2">
                CT Image Uploaded
              </p>
              <p className="text-gray-600 mb-4">
                Ready to process your CT
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-medium mb-2">
                Awaiting CT Image
              </p>
              <p className="text-gray-600 mb-4">
                Please upload your CT image
              </p>
            </>
          )}
          <button onClick={handleArrowClick} className="focus:outline-none">
            {isLoading ? (
              <FaSpinner className="text-orange-500 text-6xl animate-spin" />
            ) : (
              <FaCaretRight className="text-orange-500 text-6xl" />
            )}
          </button>
        </div>
      </div>
      {/* Toast container with alerts positioned at bottom-right */}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ResultContent;
