/**
 * Clipboard API Error Handler
 * Prevents service worker registration errors during clipboard operations
 */

export const initClipboardHandler = () => {
  // Prevent any service worker registration attempts
  if ("serviceWorker" in navigator) {
    // Override the register method to prevent errors
    const originalRegister = navigator.serviceWorker.register;
    navigator.serviceWorker.register = function () {
      return Promise.reject(new Error("Service workers disabled"));
    };

    // Get existing registrations
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // Silently ignore unregister errors
          });
        });
      })
      .catch(() => {
        // Silently ignore errors
      });
  }

  // Handle clipboard API errors gracefully
  const handlePasteEvent = (event) => {
    try {
      const clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData) {
        console.warn("Clipboard data not available");
      }
    } catch (error) {
      console.debug("Clipboard access:", error.message);
    }
  };

  document.addEventListener("paste", handlePasteEvent, true);

  // Suppress all unhandled promise rejections related to service workers
  const handleUnhandledRejection = (event) => {
    const errorMsg = event.reason?.message || String(event.reason || "");
    if (
      errorMsg.includes("serviceWorker") ||
      errorMsg.includes("InvalidStateError") ||
      errorMsg.includes("Failed to register")
    ) {
      event.preventDefault();
    }
  };

  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  // Clean up listeners if needed
  return () => {
    document.removeEventListener("paste", handlePasteEvent);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
};

export default initClipboardHandler;

