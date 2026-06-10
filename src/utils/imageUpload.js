// /**
//  * Utility functions for handling image uploads and clipboard paste operations
//  */

// export const handleImagePaste = (event) => {
//   try {
//     // Prevent default paste behavior
//     event.preventDefault();
//     event.stopPropagation();

//     const items = event.clipboardData?.items;
    
//     if (!items || items.length === 0) {
//       console.warn("Clipboard data not available");
//       return null;
//     }

//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
      
//       // Check if the item is an image
//       if (item.kind === "file" && item.type.indexOf("image") !== -1) {
//         const file = item.getAsFile();
//         if (file) {
//           return validateAndProcessImage(file);
//         }
//       }
//     }

//     return null;
//   } catch (error) {
//     console.debug("Paste handling error:", error.message);
//     return null;
//   }
// };

// export const handleImageDrop = (event) => {
//   try {
//     // Prevent default drag and drop behavior
//     event.preventDefault();
//     event.stopPropagation();

//     const files = event.dataTransfer?.files;

//     if (!files || files.length === 0) {
//       console.warn("No files dropped");
//       return null;
//     }

//     const file = files[0];
    
//     // Check if the dropped item is an image
//     if (file.type.indexOf("image") !== -1) {
//       return validateAndProcessImage(file);
//     }

//     console.warn("Dropped file is not an image");
//     return null;
//   } catch (error) {
//     console.debug("Drop handling error:", error.message);
//     return null;
//   }
// };

// export const validateAndProcessImage = (file) => {
//   try {
//     // Validate file exists
//     if (!file) {
//       console.warn("No file provided");
//       return null;
//     }

//     // Validate file size (max 10MB)
//     const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    
//     if (file.size > maxSize) {
//       console.error("File size exceeds 10MB limit");
//       return null;
//     }

//     // Validate file type
//     const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    
//     if (!allowedTypes.includes(file.type)) {
//       console.error("Invalid image format. Allowed: PNG, JPG, GIF");
//       return null;
//     }

//     // Create a preview URL safely
//     let previewUrl;
//     try {
//       previewUrl = URL.createObjectURL(file);
//     } catch (error) {
//       console.error("Failed to create preview URL:", error.message);
//       return null;
//     }

//     return {
//       file,
//       previewUrl,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     };
//   } catch (error) {
//     console.debug("Validation error:", error.message);
//     return null;
//   }
// };

// export const handleImageFileInput = (event) => {
//   try {
//     const files = event.target?.files;

//     if (!files || files.length === 0) {
//       return null;
//     }

//     const file = files[0];
//     return validateAndProcessImage(file);
//   } catch (error) {
//     console.debug("File input handling error:", error.message);
//     return null;
//   }
// };
