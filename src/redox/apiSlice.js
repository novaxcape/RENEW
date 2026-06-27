  // apiSlice.js - FULLY EDITED VERSION

  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import axios from "axios";

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

  export const googleAuthUrl = `${API_BASE_URL}/client/auth/google`;

  // ========== HELPER FUNCTIONS ==========
  const getToken = (state) =>
    state?.auth?.userToken ||
    localStorage.getItem("vendorToken") ||
    localStorage.getItem("userToken");

  const authConfig = (state, config = {}) => {
    const token = getToken(state);
    console.log("auth token:", token);

    return {
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  };

  const getErrorMessage = (error) =>
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data ||
    error.message ||
    "Something went wrong";

  const appendFormField = (formData, key, value) => {
    if (value === undefined || value === null) return;

    const isFile = typeof File !== "undefined" && value instanceof File;
    const isBlob = typeof Blob !== "undefined" && value instanceof Blob;

    if (Array.isArray(value)) {
      value.forEach((item) => appendFormField(formData, key, item));
    } else if (isFile || isBlob || typeof value !== "object") {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  };

  const toFormData = (payload) => {
    if (payload instanceof FormData) return payload;

    const formData = new FormData();
    Object.entries(payload || {}).forEach(([key, value]) => {
      appendFormField(formData, key, value);
    });
    return formData;
  };

  // Updated: createThunk with better logging and error handling
  const createThunk = (type, request) =>
    createAsyncThunk(type, async (payload, thunkApi) => {
      try {
        const response = await request(payload, thunkApi);
        console.log(`✅ ${type} - Response:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`❌ ${type} - Error:`, error);
        console.error(`❌ ${type} - Error response:`, error.response?.data);
        return thunkApi.rejectWithValue(getErrorMessage(error));
      }
    });

  // ========== CLIENT API THUNKS ==========
  // Client Profile
  export const updateClientProfile = createThunk(
    "api/client/updateProfile",
    (payload, { getState }) =>
      axios.put(
        `${API_BASE_URL}/client/update-profile`,
        toFormData(payload),
        authConfig(getState()),
      ),
  );

  // Client Password Management
  export const forgotClientPassword = createThunk(
    "api/client/forgotPassword",
    (payload) => axios.post(`${API_BASE_URL}/client/forget-password`, payload),
  );

  export const resetClientPassword = createThunk(
    "api/client/resetPassword",
    (payload) => axios.post(`${API_BASE_URL}/client/reset-password`, payload),
  );

  export const changeClientPassword = createThunk(
    "api/client/changePassword",
    (payload, { getState }) =>
      axios.post(
        `${API_BASE_URL}/client/change-password`,
        payload,
        authConfig(getState()),
      ),
  );

  // Google Auth
  export const getGoogleCallback = createThunk(
    "api/client/googleCallback",
    (params) =>
      axios.get(`${API_BASE_URL}/client/auth/google/callback`, { params }),
  );

  // ========== VENDOR API THUNKS ==========
  // Vendor Profile Management
  export const updateVendorProfile = createThunk(
    "api/vendor/updateProfile",
    async (payload, { getState, rejectWithValue }) => {
      try {
        console.log("📤 Updating vendor profile...");

        const response = await axios.put(
          `${API_BASE_URL}/vendor/profile`,
          toFormData(payload),
          authConfig(getState()),
        );

        console.log("✅ Vendor profile updated:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Update vendor profile error:", error);

        if (error.response?.status === 404) {
          try {
            console.log("🔄 Trying fallback endpoint: /vendor/update");
            const response = await axios.put(
              `${API_BASE_URL}/vendor/update`,
              toFormData(payload),
              authConfig(getState()),
            );
            return response.data;
          } catch (fallbackError) {
            console.error("❌ Fallback also failed:", fallbackError);
            return rejectWithValue(getErrorMessage(fallbackError));
          }
        }

        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getVendorDetails = createThunk(
    "api/vendor/getDetails",
    (_, { getState }) =>
      axios.get(`${API_BASE_URL}/vendor/profile`, authConfig(getState())),
  );

  // Vendor Password Management
  export const forgotVendorPassword = createThunk(
    "api/vendor/forgotPassword",
    (payload) => axios.post(`${API_BASE_URL}/vendor/forget-password`, payload),
  );

  export const resetVendorPassword = createThunk(
    "api/vendor/resetPassword",
    (payload) => axios.post(`${API_BASE_URL}/vendor/reset-password`, payload),
  );

  export const changeVendorPassword = createThunk(
    "api/vendor/changePassword",
    async (payload, { getState, rejectWithValue }) => {
      try {
        console.log("🔑 Changing vendor password...");

        const response = await axios.post(
          `${API_BASE_URL}/vendor/change-password`,
          payload,
          authConfig(getState()),
        );

        console.log("✅ Password changed successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Change password error:", error);

        if (error.response) {
          console.error("❌ Error response:", error.response.data);
          console.error("❌ Error status:", error.response.status);

          if (error.response.status === 400) {
            return rejectWithValue("Old password is invalid");
          } else if (error.response.status === 404) {
            return rejectWithValue("Vendor not found");
          }
        }

        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  // ========== PACKAGE API THUNKS ==========
  export const createPackage = createThunk(
    "api/package/create",
    async ({ touristId, packageData }, { getState, rejectWithValue }) => {
      try {
        console.log("📦 Creating package for tourist:", touristId);
        console.log("📦 Package data:", packageData);

        const response = await axios.post(
          `${API_BASE_URL}/package/${touristId}`,
          packageData,
          authConfig(getState()),
        );

        console.log("✅ Package created:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Create package error:", error);
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getAllPackages = createThunk(
    "api/package/getAll",
    async (touristId, { getState, rejectWithValue }) => {
      try {
        console.log("📦 Fetching packages for touristId:", touristId);

        const response = await axios.get(
          `${API_BASE_URL}/package/all/${touristId}`,
          authConfig(getState()),
        );

        console.log("✅ Packages fetched:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Get all packages error:", error);
        console.error(
          "❌ Request URL:",
          `${API_BASE_URL}/package/all/${touristId}`,
        );
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getPackageById = createThunk(
    "api/package/getById",
    async (id, { getState, rejectWithValue }) => {
      try {
        console.log(`📦 Fetching package ${id}...`);
        const response = await axios.get(
          `${API_BASE_URL}/package/${id}`,
          authConfig(getState()),
        );
        console.log(`✅ Package ${id}:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`❌ Get package ${id} error:`, error);
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const updatePackage = createThunk(
    "api/package/update",
    async ({ id, packageData }, { getState, rejectWithValue }) => {
      try {
        console.log(`📦 Updating package ${id}:`, packageData);
        const response = await axios.put(
          `${API_BASE_URL}/package/${id}`,
          packageData,
          authConfig(getState()),
        );
        console.log(`✅ Package ${id} updated:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`❌ Update package ${id} error:`, error);
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const deletePackage = createThunk(
    "api/package/delete",
    async (id, { getState, rejectWithValue }) => {
      try {
        console.log(`📦 Deleting package ${id}...`);
        const response = await axios.delete(
          `${API_BASE_URL}/package/${id}`,
          authConfig(getState()),
        );
        console.log(`✅ Package ${id} deleted:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`❌ Delete package ${id} error:`, error);
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  // ========== TOURIST CENTRE API THUNKS ==========
  export const registerTouristCenter = createAsyncThunk(
    "api/touristCentre/register",
    async ({ vendorId, centreData }, { getState, rejectWithValue }) => {
      try {
        const isFormData = centreData instanceof FormData;
        const token = getToken(getState());

        console.log("📄 Registering tourist center with vendorId:", vendorId);
        console.log("📄 Is FormData:", isFormData);
        console.log("📄 Token present:", !!token);

        const headers = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        if (!isFormData) {
          headers["Content-Type"] = "application/json";
        }

        const response = await axios.post(
          `${API_BASE_URL}/tourist/register/${vendorId}`,
          centreData,
          { headers },
        );

        console.log("✅ Tourist centre registration response:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Tourist centre registration error:", error);

        if (error.response) {
          console.error(
            "❌ Full error response:",
            JSON.stringify(error.response.data, null, 2),
          );
          console.error("❌ Error status:", error.response.status);
          console.error("❌ Error headers:", error.response.headers);

          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            JSON.stringify(error.response.data) ||
            "Something went wrong";

          return rejectWithValue(errorMessage);
        }

        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getTouristCentersByState = createAsyncThunk(
    "api/touristCentre/getByState",
    async (state, { rejectWithValue }) => {
      try {
        console.log("📄 Fetching tourist centers for state:", state);

        const response = await axios.get(
          `${API_BASE_URL}/tourist/get-all-state/${encodeURIComponent(state)}`,
        );

        console.log("✅ API Response for", state, ":", response.data);

        const centres = response.data?.data || [];
        const count = response.data?.count || centres.length;
        const message = response.data?.message || "Centers found";

        console.log(`📄 Found ${centres.length} centres in ${state}`);
        console.log("📄 First centre sample:", centres[0]);

        const validCentres = centres.filter(
          (centre) =>
            centre &&
            typeof centre === "object" &&
            Object.keys(centre).length > 0 &&
            (centre.centreName || centre.name || centre.id || centre._id),
        );

        console.log(`📄 Valid centres after filtering: ${validCentres.length}`);

        return {
          data: validCentres,
          count: validCentres.length,
          originalCount: centres.length,
          message: message,
        };
      } catch (error) {
        console.error("❌ Error fetching centres:", error);

        if (error.response) {
          console.error("❌ Error status:", error.response.status);
          console.error("❌ Error data:", error.response.data);

          if (error.response.status === 404) {
            return {
              data: [],
              count: 0,
              message:
                error.response.data?.message || "No centers found in this state",
            };
          }
        }

        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getTouristCenterById = createThunk(
    "api/touristCentre/getById",
    (id) => axios.get(`${API_BASE_URL}/tourist/get-one/${id}`),
  );

  export const getVendorTouristCenters = createThunk(
    "api/touristCentre/getVendorCentres",
    (vendorId, { getState }) =>
      axios.get(
        `${API_BASE_URL}/tourist/vendor/${vendorId}`,
        authConfig(getState()),
      ),
  );

  export const updateTouristCenter = createThunk(
    "api/touristCentre/update",
    ({ centreId, centreData }, { getState }) =>
      axios.put(
        `${API_BASE_URL}/tourist/update/${centreId}`,
        toFormData(centreData),
        authConfig(getState()),
      ),
  );

  export const deleteTouristCenter = createThunk(
    "api/touristCentre/delete",
    (centreId, { getState }) =>
      axios.delete(
        `${API_BASE_URL}/tourist/delete/${centreId}`,
        authConfig(getState()),
      ),
  );

  export const getTouristCentersByOpeningHours = createThunk(
    "api/touristCentre/getByOpeningHours",
    (openingHours) =>
      axios.get(
        `${API_BASE_URL}/tourist/get-all-opening-hours/${encodeURIComponent(openingHours)}`,
      ),
  );

  // ========== KYC API THUNKS ==========
  export const createKyc = createThunk(
    "api/kyc/create",
    ({ touristId, kycData }, { getState }) =>
      axios.post(
        `${API_BASE_URL}/kyc/${touristId}`,
        kycData,
        authConfig(getState()),
      ),
  );

  export const getKycStatus = createThunk(
    "api/kyc/getStatus",
    (touristId, { getState }) =>
      axios.get(`${API_BASE_URL}/kyc/${touristId}`, authConfig(getState())),
  );

  // ========== PAYMENT PLAN API THUNKS ==========
  export const createPaymentPlan = createThunk(
    "api/paymentPlan/create",
    async ({ packageId, planData }, { getState, rejectWithValue }) => {
      try {
        console.log("📋 Creating payment plan for package:", packageId);
        console.log("📋 Plan data:", planData);

        const response = await axios.post(
          `${API_BASE_URL}/plan/create-plan/${packageId}`,
          planData,
          authConfig(getState()),
        );

        console.log("✅ Payment plan created:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Create payment plan error:", error);
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getPaymentPlans = createThunk(
    "api/paymentPlan/getAll",
    async (packageId, { getState, rejectWithValue }) => {
      try {
        console.log(`📋 Fetching payment plans for package ${packageId}...`);

        const response = await axios.get(
          `${API_BASE_URL}/plan/get-all/${packageId}`,
          authConfig(getState()),
        );

        console.log(`✅ Payment plans fetched:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`❌ Get payment plans error:`, error);
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  // ========== BOOKING API THUNKS ==========
  export const createBooking = createAsyncThunk(
    "api/booking/create",
    async (
      { touristId, packageId, bookingData },
      { getState, rejectWithValue },
    ) => {
      try {
        const state = getState();
        const token = getToken(state);

        console.log("📦 Creating booking with:");
        console.log("📦 Tourist ID:", touristId);
        console.log("📦 Package ID:", packageId);
        console.log("📦 Booking Data:", bookingData);
        console.log("📦 Token:", token ? "Present" : "Missing");

        const payload = {
          visitDate: bookingData.visitDate,
        };

        console.log("📦 Final payload:", JSON.stringify(payload, null, 2));

        const response = await axios.post(
          `${API_BASE_URL}/booking/create/${touristId}/${packageId}`,
          payload,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "Content-Type": "application/json",
            },
          },
        );

        console.log("✅ Booking API Response:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Booking creation error:", error);

        if (error.response) {
          console.error("❌ Error response:", error.response.data);
          return rejectWithValue(
            error.response.data?.message || "Failed to create booking",
          );
        }

        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getAllClientBookings = createThunk(
    "api/booking/getAllClient",
    (_, { getState }) =>
      axios.get(`${API_BASE_URL}/booking/get-all`, authConfig(getState())),
  );

  export const getUserBookings = createThunk(
    "api/booking/getUserBookings",
    (userId, { getState }) =>
      axios.get(`${API_BASE_URL}/booking/user/${userId}`, authConfig(getState())),
  );

  export const getVendorBookings = createThunk(
    "api/booking/getVendorBookings",
    ({ touristId, packageId }, { getState }) =>
      axios.get(
        `${API_BASE_URL}/booking/get-all/${touristId}`,
        authConfig(getState()),
      ),
  );

  export const getBookingById = createThunk(
    "api/booking/getById",
    (bookingId, { getState }) =>
      axios.get(`${API_BASE_URL}/booking/${bookingId}`, authConfig(getState())),
  );

  export const cancelBooking = createThunk(
    "api/booking/cancel",
    (bookingId, { getState }) =>
      axios.put(
        `${API_BASE_URL}/booking/cancel/${bookingId}`,
        {},
        authConfig(getState()),
      ),
  );

  // ========== PASSCODE VERIFICATION ==========
  export const verifyPasscode = createThunk(
    "api/booking/verifyPasscode",
    async ({ passcode }, { getState, rejectWithValue }) => {
      try {
        console.log(`🔑 Verifying passcode: ${passcode}`);
        
        const response = await axios.post(
          `${API_BASE_URL}/tourist/verify-client-passcode`,
          { passcode },
          authConfig(getState()),
        );
        
        console.log("✅ Passcode verification response:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Passcode verification error:", error);
        
        if (error.response) {
          console.error("❌ Error response:", error.response.data);
          console.error("❌ Error status:", error.response.status);
          
          if (error.response.status === 404) {
            return rejectWithValue("Invalid passcode");
          } else if (error.response.status === 400) {
            return rejectWithValue("Passcode is required");
          } else if (error.response.status === 403) {
            return rejectWithValue("Vendor access required");
          } else if (error.response.status === 401) {
            return rejectWithValue("Unauthorized. Please login again.");
          }
          
          const errorMessage = error.response.data?.message || getErrorMessage(error);
          return rejectWithValue(errorMessage);
        }
        
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  // ========== PAYMENT API THUNKS - FULLY CORRECTED VERSION ==========
  export const initializePayment = createAsyncThunk(
    "api/payment/initialize",
    async ({ bookingId, paymentData }, { getState, rejectWithValue }) => {
      try {
        console.log(`💳 Initializing payment for booking ${bookingId}...`);
        console.log(`💳 Payment data:`, JSON.stringify(paymentData, null, 2));

        const response = await axios.post(
          `${API_BASE_URL}/payment/make-payment/${bookingId}`,
          paymentData,
          authConfig(getState()),
        );

        console.log(`✅ Payment initialized - Response Data:`, response.data);
        
        return response.data;
      } catch (error) {
        console.error("❌ Initialize payment error:", error);
        
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data ||
          error.message ||
          "Payment initialization failed";
        
        return rejectWithValue(errorMessage);
      }
    }
  );

  // FULLY CORRECTED: verifyPayment thunk
  export const verifyPayment = createAsyncThunk(
    "api/payment/verify",
    async ({ reference, bookingId }, { getState, rejectWithValue }) => {
      try {
        console.log(`🔍 Verifying payment with reference: ${reference}`);
        console.log(`🔍 Booking ID: ${bookingId}`);

        // CORRECTED: The API expects the reference as a query parameter
        // The URL should be: /payment/verify-payment?reference=REFERENCE
        const token = getToken(getState());
        
        const response = await axios.get(
          `${API_BASE_URL}/payment/verify-payment`,
          {
            params: { 
              reference: reference 
            },
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        console.log(`✅ Payment verification response:`, response.data);
        
        // Return the full response data with the correct structure
        return {
          success: true,
          data: response.data,
          message: response.data?.message || "Payment verified successfully"
        };
      } catch (error) {
        console.error(`❌ Verify payment error:`, error);
        console.error(`❌ Error response:`, error.response?.data);
        console.error(`❌ Error status:`, error.response?.status);
        console.error(`❌ Error config:`, error.config);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
          return rejectWithValue("Payment reference not found");
        }
        
        if (error.response?.status === 400) {
          return rejectWithValue("Invalid payment reference");
        }
        
        if (error.response?.status === 401) {
          return rejectWithValue("Unauthorized. Please login again.");
        }
        
        // Return the error message from the response if available
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data ||
          error.message ||
          "Payment verification failed";
        
        return rejectWithValue(errorMessage);
      }
    },
  );

  export const getPaymentStatus = createThunk(
    "api/payment/status",
    (bookingId, { getState }) =>
      axios.get(
        `${API_BASE_URL}/payment/status/${bookingId}`,
        authConfig(getState()),
      ),
  );

  // ========== REVIEW API THUNKS - CORRECTED VERSION ==========
  export const createReview = createThunk(
    "api/review/create",
    async ({ touristCentreId, reviewData }, { getState, rejectWithValue }) => {
      try {
        console.log(`⭐ Creating review for tourist centre: ${touristCentreId}`);
        console.log("⭐ Review data:", reviewData);

        // Prepare the payload exactly as the API expects
        const payload = {
          ratings: String(reviewData.ratings || reviewData.rating), // Support both field names
          fullName: reviewData.fullName,
          email: reviewData.email,
          addYourReview: reviewData.addYourReview || reviewData.review, // Support both field names
        };

        console.log("⭐ Final payload:", payload);

        const response = await axios.post(
          `${API_BASE_URL}/review/${touristCentreId}`,
          payload,
          authConfig(getState()),
        );

        console.log("✅ Review created successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Create review error:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
          return rejectWithValue("Tourist centre not found");
        }
        
        if (error.response?.status === 400) {
          return rejectWithValue("Invalid review data. Please check your input.");
        }
        
        if (error.response?.status === 401) {
          return rejectWithValue("Please login to submit a review");
        }
        
        return rejectWithValue(getErrorMessage(error));
      }
    },
  );

  export const getAllReviews = createThunk(
    "api/review/getAll",
    (_, { getState }) =>
      axios.get(`${API_BASE_URL}/review/get-all-review`, authConfig(getState())),
  );

  export const getReviewById = createThunk(
    "api/review/getById",
    (id, { getState }) =>
      axios.get(
        `${API_BASE_URL}/review/get-one-review/${id}`,
        authConfig(getState()),
      ),
  );

  export const getReviewsByRating = createThunk(
    "api/review/getByRating",
    (ratings, { getState }) =>
      axios.get(
        `${API_BASE_URL}/review/get-rating-count/${ratings}`,
        authConfig(getState()),
      ),
  );

  export const getRatingStatistics = createThunk(
    "api/review/getStatistics",
    (_, { getState }) =>
      axios.get(
        `${API_BASE_URL}/review/get-rating-statistics`,
        authConfig(getState()),
      ),
  );

  // ========== INITIAL STATE ==========
  const initialState = {
    clientLoading: false,
    clientError: null,
    clientProfile: null,
    clientSuccessMessage: null,
    clientResetLoading: false,
    clientResetError: null,

    vendorLoading: false,
    vendorError: null,
    vendorProfile: null,
    vendorSuccessMessage: null,
    vendorCentres: [],
    vendorResetLoading: false,
    vendorResetError: null,

    packagesLoading: false,
    packagesError: null,
    packages: [],
    selectedPackage: null,

    touristCentresLoading: false,
    touristCentresError: null,
    touristCentres: [],
    selectedTouristCenter: null,
    createdTouristCenter: null,

    kycLoading: false,
    kycError: null,
    kyc: null,

    paymentPlanLoading: false,
    paymentPlanError: null,
    paymentPlan: null,
    paymentPlans: [],

    bookingLoading: false,
    bookingError: null,
    booking: null,
    userBookings: [],
    vendorBookings: [],
    clientBookings: [],

    paymentLoading: false,
    paymentError: null,
    paymentReference: null,
    paymentVerified: false,
    paymentData: null,

    reviewsLoading: false,
    reviewsError: null,
    reviews: [],
    reviewStatistics: null,

    googleCallback: null,

    loading: false,
    error: null,
    successMessage: null,
  };

  // ========== SLICE ==========
  const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {
      clearClientError: (state) => {
        state.clientError = null;
      },
      clearClientSuccess: (state) => {
        state.clientSuccessMessage = null;
      },
      clearVendorError: (state) => {
        state.vendorError = null;
      },
      clearVendorSuccess: (state) => {
        state.vendorSuccessMessage = null;
      },
      clearApiError: (state) => {
        state.error = null;
        state.clientError = null;
        state.vendorError = null;
        state.packagesError = null;
        state.touristCentresError = null;
        state.kycError = null;
        state.paymentPlanError = null;
        state.bookingError = null;
        state.paymentError = null;
        state.reviewsError = null;
        state.clientResetError = null;
        state.vendorResetError = null;
      },
      clearApiSuccess: (state) => {
        state.successMessage = null;
        state.clientSuccessMessage = null;
        state.vendorSuccessMessage = null;
      },
      resetApiState: () => initialState,
      clearPaymentData: (state) => {
        state.paymentData = null;
        state.paymentReference = null;
        state.paymentVerified = false;
        state.paymentError = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(updateClientProfile.fulfilled, (state, action) => {
          state.clientProfile =
            action.payload?.data || action.payload?.user || action.payload;
          state.clientSuccessMessage = "Profile updated successfully";
        })
        .addCase(updateClientProfile.rejected, (state, action) => {
          state.clientError = action.payload;
        })

        .addCase(forgotClientPassword.fulfilled, (state, action) => {
          state.clientSuccessMessage =
            action.payload?.message || "Password reset OTP sent";
        })
        .addCase(forgotClientPassword.rejected, (state, action) => {
          state.clientError = action.payload;
        })

        .addCase(resetClientPassword.pending, (state) => {
          state.clientResetLoading = true;
        })
        .addCase(resetClientPassword.fulfilled, (state, action) => {
          state.clientResetLoading = false;
          state.clientSuccessMessage =
            action.payload?.message || "Password reset successfully";
        })
        .addCase(resetClientPassword.rejected, (state, action) => {
          state.clientResetLoading = false;
          state.clientResetError = action.payload;
        })

        .addCase(changeClientPassword.fulfilled, (state, action) => {
          state.clientSuccessMessage =
            action.payload?.message || "Password changed successfully";
        })
        .addCase(changeClientPassword.rejected, (state, action) => {
          state.clientError = action.payload;
        })

        .addCase(updateVendorProfile.fulfilled, (state, action) => {
          state.vendorProfile =
            action.payload?.data || action.payload?.vendor || action.payload;
          state.vendorSuccessMessage = "Vendor profile updated successfully";
        })
        .addCase(updateVendorProfile.rejected, (state, action) => {
          state.vendorError = action.payload;
        })

        .addCase(getVendorDetails.fulfilled, (state, action) => {
          state.vendorProfile =
            action.payload?.data || action.payload?.vendor || action.payload;
        })
        .addCase(getVendorDetails.rejected, (state, action) => {
          state.vendorError = action.payload;
        })

        .addCase(forgotVendorPassword.fulfilled, (state, action) => {
          state.vendorSuccessMessage =
            action.payload?.message || "Password reset OTP sent";
        })
        .addCase(forgotVendorPassword.rejected, (state, action) => {
          state.vendorError = action.payload;
        })

        .addCase(resetVendorPassword.pending, (state) => {
          state.vendorResetLoading = true;
        })
        .addCase(resetVendorPassword.fulfilled, (state, action) => {
          state.vendorResetLoading = false;
          state.vendorSuccessMessage =
            action.payload?.message || "Password reset successfully";
        })
        .addCase(resetVendorPassword.rejected, (state, action) => {
          state.vendorResetLoading = false;
          state.vendorResetError = action.payload;
        })

        .addCase(changeVendorPassword.fulfilled, (state, action) => {
          state.vendorSuccessMessage =
            action.payload?.message || "Password changed successfully";
        })
        .addCase(changeVendorPassword.rejected, (state, action) => {
          state.vendorError = action.payload;
        })

        .addCase(getGoogleCallback.fulfilled, (state, action) => {
          state.googleCallback = action.payload;
        })

        // ========== PACKAGE REDUCERS ==========
        .addCase(createPackage.pending, (state) => {
          state.packagesLoading = true;
          state.packagesError = null;
        })
        .addCase(createPackage.fulfilled, (state, action) => {
          state.packagesLoading = false;
          const nextPackage =
            action.payload?.data || action.payload?.package || action.payload;
          state.selectedPackage = nextPackage;
          state.packages = [nextPackage, ...state.packages];
          state.successMessage = "Package created successfully";
          console.log("✅ Package created in Redux:", nextPackage);
        })
        .addCase(createPackage.rejected, (state, action) => {
          state.packagesLoading = false;
          state.packagesError = action.payload;
          console.error("❌ Package creation failed in Redux:", action.payload);
        })

        .addCase(getAllPackages.pending, (state) => {
          state.packagesLoading = true;
        })
        .addCase(getAllPackages.fulfilled, (state, action) => {
          state.packagesLoading = false;
          state.packages =
            action.payload?.data ||
            action.payload?.packages ||
            action.payload ||
            [];
          console.log("✅ Packages loaded in Redux:", state.packages.length);
        })
        .addCase(getAllPackages.rejected, (state, action) => {
          state.packagesLoading = false;
          state.packagesError = action.payload;
          console.error("❌ Packages load failed in Redux:", action.payload);
        })

        .addCase(getPackageById.pending, (state) => {
          state.packagesLoading = true;
        })
        .addCase(getPackageById.fulfilled, (state, action) => {
          state.packagesLoading = false;
          state.selectedPackage =
            action.payload?.data || action.payload?.package || action.payload;
        })
        .addCase(getPackageById.rejected, (state, action) => {
          state.packagesLoading = false;
          state.packagesError = action.payload;
        })

        .addCase(updatePackage.pending, (state) => {
          state.packagesLoading = true;
        })
        .addCase(updatePackage.fulfilled, (state, action) => {
          state.packagesLoading = false;
          const updatedPackage =
            action.payload?.data || action.payload?.package || action.payload;

          if (updatedPackage?.id) {
            state.packages = state.packages.map((item) =>
              item?.id === updatedPackage.id ? updatedPackage : item,
            );
          }

          if (state.selectedPackage?.id === updatedPackage?.id) {
            state.selectedPackage = updatedPackage;
          }

          state.successMessage = "Package updated successfully";
          console.log("✅ Package updated in Redux:", updatedPackage);
        })
        .addCase(updatePackage.rejected, (state, action) => {
          state.packagesLoading = false;
          state.packagesError = action.payload;
          console.error("❌ Package update failed in Redux:", action.payload);
        })

        .addCase(deletePackage.pending, (state) => {
          state.packagesLoading = true;
        })
        .addCase(deletePackage.fulfilled, (state, action) => {
          state.packagesLoading = false;
          const deletedId = action.meta.arg;
          state.packages = state.packages.filter(
            (item) => item?.id !== deletedId,
          );
          if (state.selectedPackage?.id === deletedId) {
            state.selectedPackage = null;
          }
          state.successMessage = "Package deleted successfully";
          console.log(`✅ Package ${deletedId} deleted from Redux`);
        })
        .addCase(deletePackage.rejected, (state, action) => {
          state.packagesLoading = false;
          state.packagesError = action.payload;
          console.error("❌ Package deletion failed in Redux:", action.payload);
        })

        // ========== TOURIST CENTRE REDUCERS ==========
        .addCase(registerTouristCenter.pending, (state) => {
          state.touristCentresLoading = true;
          state.touristCentresError = null;
        })
        .addCase(registerTouristCenter.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          state.createdTouristCenter = action.payload?.data || action.payload;
          state.vendorCentres = [
            state.createdTouristCenter,
            ...state.vendorCentres,
          ];
          state.successMessage = "Tourist centre registered successfully";
          console.log(
            "✅ Tourist centre registered:",
            state.createdTouristCenter,
          );
        })
        .addCase(registerTouristCenter.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentresError = action.payload;
          console.error("❌ Tourist centre registration failed:", action.payload);
        })

        .addCase(getTouristCentersByState.pending, (state) => {
          state.touristCentresLoading = true;
          state.touristCentresError = null;
        })
        .addCase(getTouristCentersByState.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          const centres = action.payload?.data || [];
          state.touristCentres = centres;
          state.touristCentresError = null;
          console.log("✅ Stored in Redux - touristCentres:", centres);
          console.log(`✅ Count: ${centres.length}`);
        })
        .addCase(getTouristCentersByState.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentres = [];
          if (action.payload?.status !== 404) {
            state.touristCentresError = action.payload;
          } else {
            state.touristCentresError = null;
          }
        })

        .addCase(getTouristCenterById.pending, (state) => {
          state.touristCentresLoading = true;
        })
        .addCase(getTouristCenterById.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          state.selectedTouristCenter =
            action.payload?.data || action.payload?.tourist || action.payload;
          console.log("✅ Tourist centre loaded:", state.selectedTouristCenter);
        })
        .addCase(getTouristCenterById.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentresError = action.payload;
          console.error("❌ Tourist centre load failed:", action.payload);
        })

        .addCase(getVendorTouristCenters.pending, (state) => {
          state.touristCentresLoading = true;
        })
        .addCase(getVendorTouristCenters.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          state.vendorCentres =
            action.payload?.data ||
            action.payload?.tourists ||
            action.payload ||
            [];
        })
        .addCase(getVendorTouristCenters.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentresError = action.payload;
        })

        .addCase(updateTouristCenter.pending, (state) => {
          state.touristCentresLoading = true;
        })
        .addCase(updateTouristCenter.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          const updatedCentre =
            action.payload?.data || action.payload?.tourist || action.payload;
          state.vendorCentres = state.vendorCentres.map((centre) =>
            centre?.id === updatedCentre?.id ? updatedCentre : centre,
          );
          state.successMessage = "Tourist centre updated successfully";
        })
        .addCase(updateTouristCenter.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentresError = action.payload;
        })

        .addCase(deleteTouristCenter.pending, (state) => {
          state.touristCentresLoading = true;
        })
        .addCase(deleteTouristCenter.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          const deletedId = action.meta.arg;
          state.vendorCentres = state.vendorCentres.filter(
            (centre) => centre?.id !== deletedId,
          );
          state.successMessage = "Tourist centre deleted successfully";
        })
        .addCase(deleteTouristCenter.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentresError = action.payload;
        })

        .addCase(getTouristCentersByOpeningHours.pending, (state) => {
          state.touristCentresLoading = true;
        })
        .addCase(getTouristCentersByOpeningHours.fulfilled, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentres =
            action.payload?.data ||
            action.payload?.tourists ||
            action.payload ||
            [];
        })
        .addCase(getTouristCentersByOpeningHours.rejected, (state, action) => {
          state.touristCentresLoading = false;
          state.touristCentresError = action.payload;
        })

        .addCase(createKyc.pending, (state) => {
          state.kycLoading = true;
        })
        .addCase(createKyc.fulfilled, (state, action) => {
          state.kycLoading = false;
          state.kyc =
            action.payload?.data || action.payload?.kyc || action.payload;
          state.successMessage = "KYC submitted successfully";
        })
        .addCase(createKyc.rejected, (state, action) => {
          state.kycLoading = false;
          state.kycError = action.payload;
        })

        .addCase(getKycStatus.pending, (state) => {
          state.kycLoading = true;
        })
        .addCase(getKycStatus.fulfilled, (state, action) => {
          state.kycLoading = false;
          state.kyc =
            action.payload?.data || action.payload?.kyc || action.payload;
        })
        .addCase(getKycStatus.rejected, (state, action) => {
          state.kycLoading = false;
          state.kycError = action.payload;
        })

        // ========== PAYMENT PLAN REDUCERS ==========
        .addCase(createPaymentPlan.pending, (state) => {
          state.paymentPlanLoading = true;
        })
        .addCase(createPaymentPlan.fulfilled, (state, action) => {
          state.paymentPlanLoading = false;
          state.paymentPlan =
            action.payload?.data || action.payload?.plan || action.payload;
          state.paymentPlans = [state.paymentPlan, ...state.paymentPlans];
          state.successMessage = "Payment plan created successfully";
          console.log("✅ Payment plan created:", state.paymentPlan);
        })
        .addCase(createPaymentPlan.rejected, (state, action) => {
          state.paymentPlanLoading = false;
          state.paymentPlanError = action.payload;
          console.error("❌ Payment plan creation failed:", action.payload);
        })

        .addCase(getPaymentPlans.pending, (state) => {
          state.paymentPlanLoading = true;
        })
        .addCase(getPaymentPlans.fulfilled, (state, action) => {
          state.paymentPlanLoading = false;
          state.paymentPlans =
            action.payload?.data || action.payload?.plans || action.payload || [];
          console.log("✅ Payment plans loaded:", state.paymentPlans.length);
        })
        .addCase(getPaymentPlans.rejected, (state, action) => {
          state.paymentPlanLoading = false;
          state.paymentPlanError = action.payload;
          console.error("❌ Payment plans load failed:", action.payload);
        })

        // ========== BOOKINGS REDUCERS ==========
        .addCase(createBooking.pending, (state) => {
          state.bookingLoading = true;
          state.bookingError = null;
        })
        .addCase(createBooking.fulfilled, (state, action) => {
          state.bookingLoading = false;
          state.booking =
            action.payload?.data || action.payload?.booking || action.payload;
          state.userBookings = [state.booking, ...state.userBookings];
          state.successMessage = "Booking created successfully";
          console.log("✅ Booking created in Redux:", state.booking);
        })
        .addCase(createBooking.rejected, (state, action) => {
          state.bookingLoading = false;
          state.bookingError = action.payload;
          console.error("❌ Booking rejected in Redux:", action.payload);
        })

        .addCase(getAllClientBookings.pending, (state) => {
          state.bookingLoading = true;
        })
        .addCase(getAllClientBookings.fulfilled, (state, action) => {
          state.bookingLoading = false;
          state.clientBookings =
            action.payload?.data ||
            action.payload?.bookings ||
            action.payload ||
            [];
        })
        .addCase(getAllClientBookings.rejected, (state, action) => {
          state.bookingLoading = false;
          state.bookingError = action.payload;
        })

        .addCase(getUserBookings.pending, (state) => {
          state.bookingLoading = true;
        })
        .addCase(getUserBookings.fulfilled, (state, action) => {
          state.bookingLoading = false;
          state.userBookings =
            action.payload?.data ||
            action.payload?.bookings ||
            action.payload ||
            [];
        })
        .addCase(getUserBookings.rejected, (state, action) => {
          state.bookingLoading = false;
          state.bookingError = action.payload;
        })

        .addCase(getVendorBookings.pending, (state) => {
          state.bookingLoading = true;
        })
        .addCase(getVendorBookings.fulfilled, (state, action) => {
          state.bookingLoading = false;
          state.vendorBookings =
            action.payload?.data ||
            action.payload?.bookings ||
            action.payload ||
            [];
        })
        .addCase(getVendorBookings.rejected, (state, action) => {
          state.bookingLoading = false;
          state.bookingError = action.payload;
        })

        .addCase(getBookingById.pending, (state) => {
          state.bookingLoading = true;
        })
        .addCase(getBookingById.fulfilled, (state, action) => {
          state.bookingLoading = false;
          state.booking =
            action.payload?.data || action.payload?.booking || action.payload;
        })
        .addCase(getBookingById.rejected, (state, action) => {
          state.bookingLoading = false;
          state.bookingError = action.payload;
        })

        .addCase(cancelBooking.pending, (state) => {
          state.bookingLoading = true;
        })
        .addCase(cancelBooking.fulfilled, (state, action) => {
          state.bookingLoading = false;
          state.successMessage = "Booking cancelled successfully";
          const cancelledId = action.meta.arg;
          state.userBookings = state.userBookings.map((booking) =>
            booking?.id === cancelledId
              ? { ...booking, status: "cancelled" }
              : booking,
          );
          state.clientBookings = state.clientBookings.map((booking) =>
            booking?.id === cancelledId
              ? { ...booking, status: "cancelled" }
              : booking,
          );
        })
        .addCase(cancelBooking.rejected, (state, action) => {
          state.bookingLoading = false;
          state.bookingError = action.payload;
        })

        // ========== PAYMENTS REDUCERS - UPDATED ==========
        .addCase(initializePayment.pending, (state) => {
          state.paymentLoading = true;
          state.paymentError = null;
          state.paymentData = null;
          state.paymentReference = null;
        })
        .addCase(initializePayment.fulfilled, (state, action) => {
          state.paymentLoading = false;
          state.paymentData = action.payload?.data || action.payload;
          state.paymentReference =
            action.payload?.data?.reference ||
            action.payload?.reference ||
            action.payload?.data?.data?.reference ||
            null;
          state.successMessage = "Payment initialized successfully";
          console.log("✅ Payment initialized in Redux:", {
            paymentData: state.paymentData,
            paymentReference: state.paymentReference
          });
        })
        .addCase(initializePayment.rejected, (state, action) => {
          state.paymentLoading = false;
          state.paymentError = action.payload;
          state.paymentData = null;
          state.paymentReference = null;
          console.error("❌ Payment initialization failed in Redux:", action.payload);
        })

        // UPDATED: verifyPayment reducers
        .addCase(verifyPayment.pending, (state) => {
          state.paymentLoading = true;
          state.paymentError = null;
          state.paymentVerified = false;
        })
        .addCase(verifyPayment.fulfilled, (state, action) => {
          state.paymentLoading = false;
          state.paymentVerified = true;
          state.paymentData = action.payload?.data || action.payload;
          state.successMessage = action.payload?.message || "Payment verified successfully";
          console.log("✅ Payment verified in Redux:", state.paymentData);
        })
        .addCase(verifyPayment.rejected, (state, action) => {
          state.paymentLoading = false;
          state.paymentError = action.payload;
          state.paymentVerified = false;
          console.error("❌ Payment verification failed in Redux:", action.payload);
        })

        .addCase(getPaymentStatus.pending, (state) => {
          state.paymentLoading = true;
        })
        .addCase(getPaymentStatus.fulfilled, (state, action) => {
          state.paymentLoading = false;
          state.paymentData = action.payload?.data || action.payload;
        })
        .addCase(getPaymentStatus.rejected, (state, action) => {
          state.paymentLoading = false;
          state.paymentError = action.payload;
        })

        // ========== REVIEWS REDUCERS ==========
        .addCase(createReview.pending, (state) => {
          state.reviewsLoading = true;
          state.reviewsError = null;
        })
        .addCase(createReview.fulfilled, (state, action) => {
          state.reviewsLoading = false;
          const newReview = action.payload?.data || action.payload;
          state.reviews = [newReview, ...state.reviews];
          state.successMessage = "Review submitted successfully";
          console.log("✅ Review added to Redux:", newReview);
        })
        .addCase(createReview.rejected, (state, action) => {
          state.reviewsLoading = false;
          state.reviewsError = action.payload;
          console.error("❌ Review submission failed in Redux:", action.payload);
        })

        .addCase(getAllReviews.pending, (state) => {
          state.reviewsLoading = true;
        })
        .addCase(getAllReviews.fulfilled, (state, action) => {
          state.reviewsLoading = false;
          state.reviews =
            action.payload?.data ||
            action.payload?.reviews ||
            action.payload ||
            [];
          console.log("✅ Reviews loaded in Redux:", state.reviews.length);
        })
        .addCase(getAllReviews.rejected, (state, action) => {
          state.reviewsLoading = false;
          state.reviewsError = action.payload;
          console.error("❌ Reviews load failed in Redux:", action.payload);
        })

        .addCase(getReviewById.pending, (state) => {
          state.reviewsLoading = true;
        })
        .addCase(getReviewById.fulfilled, (state, action) => {
          state.reviewsLoading = false;
          const review = action.payload?.data || action.payload;
          state.reviews = state.reviews.map((r) =>
            r.id === review.id ? review : r,
          );
        })
        .addCase(getReviewById.rejected, (state, action) => {
          state.reviewsLoading = false;
          state.reviewsError = action.payload;
        })

        .addCase(getReviewsByRating.pending, (state) => {
          state.reviewsLoading = true;
        })
        .addCase(getReviewsByRating.fulfilled, (state, action) => {
          state.reviewsLoading = false;
          state.reviews =
            action.payload?.data ||
            action.payload?.reviews ||
            action.payload ||
            [];
          console.log(`✅ Reviews filtered by rating: ${state.reviews.length}`);
        })
        .addCase(getReviewsByRating.rejected, (state, action) => {
          state.reviewsLoading = false;
          state.reviewsError = action.payload;
        })

        .addCase(getRatingStatistics.pending, (state) => {
          state.reviewsLoading = true;
        })
        .addCase(getRatingStatistics.fulfilled, (state, action) => {
          state.reviewsLoading = false;
          state.reviewStatistics = action.payload?.data || action.payload;
          console.log("✅ Review statistics loaded:", state.reviewStatistics);
        })
        .addCase(getRatingStatistics.rejected, (state, action) => {
          state.reviewsLoading = false;
          state.reviewsError = action.payload;
        });
    },
  });

  // ========== EXPORT ACTIONS ==========
  export const {
    clearClientError,
    clearClientSuccess,
    clearVendorError,
    clearVendorSuccess,
    clearApiError,
    clearApiSuccess,
    resetApiState,
    clearPaymentData,
  } = apiSlice.actions;

  // ========== SELECTORS ==========
  export const selectClientProfile = (state) => state.api.clientProfile;
  export const selectClientLoading = (state) => state.api.clientLoading;
  export const selectClientError = (state) => state.api.clientError;
  export const selectClientSuccess = (state) => state.api.clientSuccessMessage;
  export const selectClientResetLoading = (state) => state.api.clientResetLoading;
  export const selectClientResetError = (state) => state.api.clientResetError;

  export const selectVendorProfile = (state) => state.api.vendorProfile;
  export const selectVendorLoading = (state) => state.api.vendorLoading;
  export const selectVendorError = (state) => state.api.vendorError;
  export const selectVendorSuccess = (state) => state.api.vendorSuccessMessage;
  export const selectVendorCentres = (state) => state.api.vendorCentres;
  export const selectVendorResetLoading = (state) => state.api.vendorResetLoading;
  export const selectVendorResetError = (state) => state.api.vendorResetError;

  export const selectPackages = (state) => state.api.packages;
  export const selectSelectedPackage = (state) => state.api.selectedPackage;
  export const selectPackagesLoading = (state) => state.api.packagesLoading;
  export const selectPackagesError = (state) => state.api.packagesError;

  export const selectTouristCentres = (state) => state.api.touristCentres;
  export const selectSelectedTouristCenter = (state) =>
    state.api.selectedTouristCenter;
  export const selectTouristCentresLoading = (state) =>
    state.api.touristCentresLoading;
  export const selectTouristCentresError = (state) =>
    state.api.touristCentresError;
  export const selectCreatedTouristCenter = (state) =>
    state.api.createdTouristCenter;

  export const selectKyc = (state) => state.api.kyc;
  export const selectKycLoading = (state) => state.api.kycLoading;
  export const selectKycError = (state) => state.api.kycError;

  export const selectPaymentPlans = (state) => state.api.paymentPlans;
  export const selectPaymentPlan = (state) => state.api.paymentPlan;
  export const selectPaymentPlanLoading = (state) => state.api.paymentPlanLoading;
  export const selectPaymentPlanError = (state) => state.api.paymentPlanError;

  export const selectUserBookings = (state) => state.api.userBookings;
  export const selectVendorBookings = (state) => state.api.vendorBookings;
  export const selectClientBookings = (state) => state.api.clientBookings;
  export const selectBooking = (state) => state.api.booking;
  export const selectBookingLoading = (state) => state.api.bookingLoading;
  export const selectBookingError = (state) => state.api.bookingError;

  export const selectPaymentLoading = (state) => state.api.paymentLoading;
  export const selectPaymentError = (state) => state.api.paymentError;
  export const selectPaymentReference = (state) => state.api.paymentReference;
  export const selectPaymentVerified = (state) => state.api.paymentVerified;
  export const selectPaymentData = (state) => state.api.paymentData;

  export const selectReviews = (state) => state.api.reviews;
  export const selectReviewsLoading = (state) => state.api.reviewsLoading;
  export const selectReviewsError = (state) => state.api.reviewsError;
  export const selectReviewStatistics = (state) => state.api.reviewStatistics;

  export const selectGoogleCallback = (state) => state.api.googleCallback;

  export const selectApiLoading = (state) =>
    state.api.loading ||
    state.api.clientLoading ||
    state.api.vendorLoading ||
    state.api.packagesLoading ||
    state.api.touristCentresLoading ||
    state.api.kycLoading ||
    state.api.bookingLoading ||
    state.api.paymentPlanLoading ||
    state.api.paymentLoading ||
    state.api.reviewsLoading;

  export const selectApiError = (state) => state.api.error;
  export const selectApiSuccess = (state) => state.api.successMessage;

  export default apiSlice.reducer;``