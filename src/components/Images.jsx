// src/components/Images.js
import { useRef, useState } from "react";
import { IconUpload } from "./Icon";
import {
  handleImageDrop,
  handleImageFileInput,
  handleImagePaste,
} from "../utils/imageUpload";

const Images = ({ uploadedImages, onImagesChange }) => {
  const [localImages, setLocalImages] = useState(uploadedImages || {});
  const [errors, setErrors] = useState({});
  const fileInputsRef = useRef({});

  const updateImages = (updater) => {
    setLocalImages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      onImagesChange(next);
      return next;
    });
  };

  const setImage = (boxId, imageData) => {
    updateImages((prev) => ({
      ...prev,
      [boxId]: imageData,
    }));
    setErrors((prev) => ({
      ...prev,
      [boxId]: "",
    }));
  };

  const setImageError = (boxId, message) => {
    setErrors((prev) => ({
      ...prev,
      [boxId]: message,
    }));
  };

  const handlePaste = (event, boxId) => {
    try {
      const imageData = handleImagePaste(event);

      if (imageData) {
        setImage(boxId, imageData);
      } else {
        setImageError(boxId, "Please paste a valid image file (PNG, JPG, GIF)");
      }
    } catch (error) {
      console.error("Paste error:", error);
      setImageError(boxId, "Error processing pasted image");
    }
  };

  const handleDrop = (event, boxId) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const imageData = handleImageDrop(event);

      if (imageData) {
        setImage(boxId, imageData);
      } else {
        setImageError(boxId, "Please drop a valid image file (PNG, JPG, GIF)");
      }
    } catch (error) {
      console.error("Drop error:", error);
      setImageError(boxId, "Error processing dropped image");
    }
  };

  const handleFileSelect = (event, boxId) => {
    try {
      const imageData = handleImageFileInput(event);

      if (imageData) {
        setImage(boxId, imageData);
      }
    } catch (error) {
      console.error("File select error:", error);
      setImageError(boxId, "Error processing selected image");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = (boxId) => {
    updateImages((prev) => {
      const updated = { ...prev };
      if (updated[boxId]?.previewUrl) {
        URL.revokeObjectURL(updated[boxId].previewUrl);
      }
      delete updated[boxId];
      return updated;
    });
    setErrors((prev) => ({
      ...prev,
      [boxId]: "",
    }));
  };

  const triggerFileInput = (boxId) => {
    if (fileInputsRef.current[boxId]) {
      fileInputsRef.current[boxId].click();
    }
  };

  return (
    <div className="step-content">
      {[1, 2, 3, 4, 5].map((i) => {
        const imageData = localImages[i];

        return (
          <div
            key={i}
            className="upload-box"
            onPaste={(e) => handlePaste(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragOver={handleDragOver}
            onClick={() => triggerFileInput(i)}
            tabIndex="0"
            role="button"
            aria-label={`Upload image ${i}`}
            style={{ cursor: "pointer" }}
          >
            {imageData ? (
              <div className="upload-preview">
                <img
                  src={imageData.previewUrl}
                  alt={`Upload preview ${i}`}
                  className="preview-image"
                />
                <div className="image-info">
                  <p className="image-name">{imageData.name}</p>
                  <p className="image-size">
                    {(imageData.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(i);
                  }}
                  aria-label={`Remove image ${i}`}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <IconUpload />
                </div>
                <div className="upload-text">Click to upload or drag and drop</div>
                <div className="upload-sub">
                  PNG, JPG, GIF up to 10MB (Recommended: 1920x1080)
                </div>
                <input
                  ref={(el) => (fileInputsRef.current[i] = el)}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={(e) => handleFileSelect(e, i)}
                  style={{ display: "none" }}
                />
              </>
            )}
            {errors[i] && <div className="upload-error">{errors[i]}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Images;