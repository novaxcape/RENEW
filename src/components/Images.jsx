// src/components/Images.js
import React, { useState, useRef } from "react";
import { IconUpload } from "./Icon";
import {
  handleImagePaste,
  handleImageDrop,
  handleImageFileInput,
} from "../utils/imageUpload";

const Images = () => {
  const [uploadedImages, setUploadedImages] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputsRef = useRef({});

  const handlePaste = (event, boxId) => {
    try {
      const imageData = handleImagePaste(event);

      if (imageData) {
        setUploadedImages((prev) => ({
          ...prev,
          [boxId]: imageData,
        }));
        setErrors((prev) => ({
          ...prev,
          [boxId]: "",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [boxId]: "Please paste a valid image file (PNG, JPG, GIF)",
        }));
      }
    } catch (error) {
      console.error("Paste error:", error);
      setErrors((prev) => ({
        ...prev,
        [boxId]: "Error processing pasted image",
      }));
    }
  };

  const handleDrop = (event, boxId) => {
    try {
      const imageData = handleImageDrop(event);

      if (imageData) {
        setUploadedImages((prev) => ({
          ...prev,
          [boxId]: imageData,
        }));
        setErrors((prev) => ({
          ...prev,
          [boxId]: "",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [boxId]: "Please drop a valid image file (PNG, JPG, GIF)",
        }));
      }
    } catch (error) {
      console.error("Drop error:", error);
      setErrors((prev) => ({
        ...prev,
        [boxId]: "Error processing dropped image",
      }));
    }
  };

  const handleFileSelect = (event, boxId) => {
    try {
      const imageData = handleImageFileInput(event);

      if (imageData) {
        setUploadedImages((prev) => ({
          ...prev,
          [boxId]: imageData,
        }));
        setErrors((prev) => ({
          ...prev,
          [boxId]: "",
        }));
      }
    } catch (error) {
      console.error("File select error:", error);
      setErrors((prev) => ({
        ...prev,
        [boxId]: "Error processing selected image",
      }));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = (boxId) => {
    setUploadedImages((prev) => {
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

  return (
    <div className="step-content">
      <div className="card-title">Images & Media</div>
      <p className="card-subtitle">
        Upload high-quality images of your tourism centre (minimum 3 images
        recommended)
      </p>

      {[1, 2, 3, 4, 5].map((i) => {
        const imageData = uploadedImages[i];

        return (
          <div
            key={i}
            className="upload-box"
            onPaste={(e) => handlePaste(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragOver={handleDragOver}
            tabIndex="0"
            role="button"
            aria-label={`Upload image ${i}`}
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
                  onClick={() => handleRemoveImage(i)}
                  aria-label={`Remove image ${i}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <IconUpload />
                </div>
                <div className="upload-text">
                  Click to upload or drag and drop
                </div>
                <div className="upload-sub">
                  PNG, JPG, GIF up to 10MB (Recommended: 1920x1080)
                </div>
                <input
                  ref={(el) => (fileInputsRef.current[i] = el)}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={(e) => handleFileSelect(e, i)}
                  style={{ display: "none" }}
                //   aria-hidden="true"
                />
                <button
                  type="button"
                  className="hidden-upload-trigger"
                  onClick={() => fileInputsRef.current[i]?.click()}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                //   aria-hidden="true"
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
