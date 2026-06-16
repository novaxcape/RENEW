import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

export const googleAuthUrl = `${API_BASE_URL}/client/auth/google`;

// ========== HELPER FUNCTIONS ==========
const getToken = (state) =>
  state?.auth?.userToken ||
  localStorage.getItem("vendorToken") ||
  localStorage.getItem("token");

const authConfig = (state, config = {}) => {
  const token = getToken(state);

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

  const isFile =
    typeof File !== "undefined" && value instanceof File;
  const isBlob =
    typeof Blob !== "undefined" && value instanceof Blob;

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

const createThunk = (type, request) =>
  createAsyncThunk(type, async (payload, thunkApi) => {
    try {
      const response = await request(payload, thunkApi);
      return response.data;
    } catch (error) {
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
      authConfig(getState())
    )
);

// Client Password Management
export const forgotClientPassword = createThunk(
  "api/client/forgotPassword",
  (payload) => axios.post(`${API_BASE_URL}/client/forget-password`, payload)
);

export const resetClientPassword = createThunk(
  "api/client/resetPassword",
  (payload) => axios.post(`${API_BASE_URL}/client/reset-password`, payload)
);

export const changeClientPassword = createThunk(
  "api/client/changePassword",
  (payload, { getState }) =>
    axios.post(
      `${API_BASE_URL}/client/change-password`,
      payload,
      authConfig(getState())
    )
);

// Google Auth
export const getGoogleCallback = createThunk(
  "api/client/googleCallback",
  (params) =>
    axios.get(`${API_BASE_URL}/client/auth/google/callback`, { params })
);

// ========== VENDOR API THUNKS ==========
// Vendor Profile Management
export const updateVendorProfile = createThunk(
  "api/vendor/updateProfile",
  (payload, { getState }) =>
    axios.put(
      `${API_BASE_URL}/vendor/update-profile`,
      toFormData(payload),
      authConfig(getState())
    )
);

export const getVendorDetails = createThunk(
  "api/vendor/getDetails",
  (_, { getState }) =>
    axios.get(`${API_BASE_URL}/vendor/profile`, authConfig(getState()))
);

// Vendor Password Management
export const forgotVendorPassword = createThunk(
  "api/vendor/forgotPassword",
  (payload) => axios.post(`${API_BASE_URL}/vendor/forget-password`, payload)
);

export const resetVendorPassword = createThunk(
  "api/vendor/resetPassword",
  (payload) => axios.post(`${API_BASE_URL}/vendor/reset-password`, payload)
);

export const changeVendorPassword = createThunk(
  "api/vendor/changePassword",
  (payload, { getState }) =>
    axios.post(
      `${API_BASE_URL}/vendor/change-password`,
      payload,
      authConfig(getState())
    )
);

// ========== PACKAGE API THUNKS ==========
export const createPackage = createThunk(
  "api/package/create",
  ({ touristId, packageData }, { getState }) =>
    axios.post(
      `${API_BASE_URL}/package/${touristId}`,
      packageData,
      authConfig(getState())
    )
);

export const getAllPackages = createThunk(
  "api/package/getAll",
  (_, { getState }) =>
    axios.get(`${API_BASE_URL}/package/all`, authConfig(getState()))
);

export const getPackageById = createThunk(
  "api/package/getById",
  (id, { getState }) =>
    axios.get(`${API_BASE_URL}/package/${id}`, authConfig(getState()))
);

export const updatePackage = createThunk(
  "api/package/update",
  ({ id, packageData }, { getState }) =>
    axios.put(
      `${API_BASE_URL}/package/package/${id}`,
      packageData,
      authConfig(getState())
    )
);

export const deletePackage = createThunk(
  "api/package/delete",
  (id, { getState }) =>
    axios.delete(`${API_BASE_URL}/package/${id}`, authConfig(getState()))
);

// ========== TOURIST CENTRE API THUNKS ==========
// ✅ FIXED: registerTouristCenter with proper FormData handling
export const registerTouristCenter = createThunk(
  "api/touristCentre/register",
  async ({ vendorId, centreData }, { getState, rejectWithValue }) => {
    try {
      // Determine if we're sending FormData or JSON
      const isFormData = centreData instanceof FormData;
      
      // Get auth config
      const token = getToken(getState());
      
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      
      // If not FormData, set Content-Type to application/json
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      // If FormData, let the browser set the Content-Type with boundary
      
      const response = await axios.post(
        `${API_BASE_URL}/tourist/register/${vendorId}`,
        centreData,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Updated getTouristCentersByState with proper data extraction and filtering
export const getTouristCentersByState = createThunk(
  "api/touristCentre/getByState",
  async (state, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tourist/get-all-state/${encodeURIComponent(state)}`);
      
      // Log the raw response to debug
      console.log("API Response for", state, ":", response.data);
      
      // Extract centres from response - try multiple possible data paths
      let centres = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        centres = response.data.data;
      } else if (Array.isArray(response.data)) {
        centres = response.data;
      } else if (response.data?.tourists && Array.isArray(response.data.tourists)) {
        centres = response.data.tourists;
      }
      
      // Filter out empty objects and invalid centres
      const validCentres = centres.filter(centre => 
        centre && 
        typeof centre === 'object' &&
        Object.keys(centre).length > 0 &&
        (centre.centreName || centre.name || centre.id || centre._id || centre.title)
      );
      
      console.log("Valid centres after filtering:", validCentres);
      
      return { 
        data: validCentres, 
        count: validCentres.length,
        originalCount: centres.length,
        message: response.data?.message || "Centers found"
      };
    } catch (error) {
      console.error("Error fetching centres:", error);
      if (error.response?.status === 404) {
        return { data: [], count: 0, message: "No centers found in this state" };
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getTouristCenterById = createThunk(
  "api/touristCentre/getById",
  (id) =>
    axios.get(`${API_BASE_URL}/tourist/get-one/${id}`)
);

export const getVendorTouristCenters = createThunk(
  "api/touristCentre/getVendorCentres",
  (vendorId, { getState }) =>
    axios.get(`${API_BASE_URL}/tourist/vendor/${vendorId}`, authConfig(getState()))
);

export const updateTouristCenter = createThunk(
  "api/touristCentre/update",
  ({ centreId, centreData }, { getState }) =>
    axios.put(
      `${API_BASE_URL}/tourist/update/${centreId}`,
      toFormData(centreData),
      authConfig(getState())
    )
);

export const deleteTouristCenter = createThunk(
  "api/touristCentre/delete",
  (centreId, { getState }) =>
    axios.delete(`${API_BASE_URL}/tourist/delete/${centreId}`, authConfig(getState()))
);

export const getTouristCentersByOpeningHours = createThunk(
  "api/touristCentre/getByOpeningHours",
  (openingHours) =>
    axios.get(`${API_BASE_URL}/tourist/get-all-opening-hours/${encodeURIComponent(openingHours)}`)
);

// ========== KYC API THUNKS ==========
export const createKyc = createThunk(
  "api/kyc/create",
  ({ touristId, kycData }, { getState }) =>
    axios.post(
      `${API_BASE_URL}/kyc/${touristId}`,
      kycData,
      authConfig(getState())
    )
);

export const getKycStatus = createThunk(
  "api/kyc/getStatus",
  (touristId, { getState }) =>
    axios.get(`${API_BASE_URL}/kyc/${touristId}`, authConfig(getState()))
);

// ========== PAYMENT PLAN API THUNKS ==========
export const createPaymentPlan = createThunk(
  "api/paymentPlan/create",
  ({ packageId, planData }, { getState }) =>
    axios.post(
      `${API_BASE_URL}/plan/create-plan/${packageId}`,
      planData,
      authConfig(getState())
    )
);

export const getPaymentPlans = createThunk(
  "api/paymentPlan/getAll",
  (packageId, { getState }) =>
    axios.get(`${API_BASE_URL}/plan/package/${packageId}`, authConfig(getState()))
);

// ========== BOOKING API THUNKS ==========
export const createBooking = createThunk(
  "api/booking/create",
  ({ touristId, packageId, bookingData }, { getState }) =>
    axios.post(
      `${API_BASE_URL}/booking/create/${touristId}/${packageId}`,
      bookingData,
      authConfig(getState())
    )
);

export const getAllClientBookings = createThunk(
  "api/booking/getAllClient",
  (_, { getState }) =>
    axios.get(`${API_BASE_URL}/booking/get-all`, authConfig(getState()))
);

export const getUserBookings = createThunk(
  "api/booking/getUserBookings",
  (userId, { getState }) =>
    axios.get(`${API_BASE_URL}/booking/user/${userId}`, authConfig(getState()))
);

export const getVendorBookings = createThunk(
  "api/booking/getVendorBookings",
  ({ touristId, packageId }, { getState }) =>
    axios.get(
      `${API_BASE_URL}/booking/get-all/${touristId}/${packageId}`, 
      authConfig(getState())
    )
);

export const getBookingById = createThunk(
  "api/booking/getById",
  (bookingId, { getState }) =>
    axios.get(`${API_BASE_URL}/booking/${bookingId}`, authConfig(getState()))
);

export const cancelBooking = createThunk(
  "api/booking/cancel",
  (bookingId, { getState }) =>
    axios.put(
      `${API_BASE_URL}/booking/cancel/${bookingId}`,
      {},
      authConfig(getState())
    )
);

// ========== PAYMENT API THUNKS ==========
export const initializePayment = createThunk(
  "api/payment/initialize",
  ({ bookingId, paymentData }, { getState }) =>
    axios.post(
      `${API_BASE_URL}/payment/make-payment/${bookingId}`,
      paymentData,
      authConfig(getState())
    )
);

export const verifyPayment = createThunk(
  "api/payment/verify",
  ({ reference, bookingId }, { getState }) =>
    axios.get(
      `${API_BASE_URL}/payment/verify-payment`,
      { 
        params: { reference, bookingId },
        ...authConfig(getState())
      }
    )
);

export const getPaymentStatus = createThunk(
  "api/payment/status",
  (bookingId, { getState }) =>
    axios.get(`${API_BASE_URL}/payment/status/${bookingId}`, authConfig(getState()))
);

// ========== INITIAL STATE ==========
const initialState = {
  // Client State
  clientLoading: false,
  clientError: null,
  clientProfile: null,
  clientSuccessMessage: null,
  clientResetLoading: false,
  clientResetError: null,
  
  // Vendor State
  vendorLoading: false,
  vendorError: null,
  vendorProfile: null,
  vendorSuccessMessage: null,
  vendorCentres: [],
  vendorResetLoading: false,
  vendorResetError: null,
  
  // Package State
  packagesLoading: false,
  packagesError: null,
  packages: [],
  selectedPackage: null,
  
  // Tourist Centre State
  touristCentresLoading: false,
  touristCentresError: null,
  touristCentres: [],
  selectedTouristCenter: null,
  createdTouristCenter: null,
  
  // KYC State
  kycLoading: false,
  kycError: null,
  kyc: null,
  
  // Payment Plan State
  paymentPlanLoading: false,
  paymentPlanError: null,
  paymentPlan: null,
  paymentPlans: [],
  
  // Booking State
  bookingLoading: false,
  bookingError: null,
  booking: null,
  userBookings: [],
  vendorBookings: [],
  clientBookings: [],
  
  // Payment State
  paymentLoading: false,
  paymentError: null,
  paymentReference: null,
  paymentVerified: false,
  paymentData: null,
  
  // Google Auth State
  googleCallback: null,
  
  // Common State
  loading: false,
  error: null,
  successMessage: null,
};

// ========== SLICE ==========
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    // Client Actions
    clearClientError: (state) => {
      state.clientError = null;
    },
    clearClientSuccess: (state) => {
      state.clientSuccessMessage = null;
    },
    
    // Vendor Actions
    clearVendorError: (state) => {
      state.vendorError = null;
    },
    clearVendorSuccess: (state) => {
      state.vendorSuccessMessage = null;
    },
    
    // Common Actions
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
      state.clientResetError = null;
      state.vendorResetError = null;
    },
    clearApiSuccess: (state) => {
      state.successMessage = null;
      state.clientSuccessMessage = null;
      state.vendorSuccessMessage = null;
    },
    resetApiState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ========== CLIENT PROFILE ==========
      .addCase(updateClientProfile.fulfilled, (state, action) => {
        state.clientProfile = action.payload?.data || action.payload?.user || action.payload;
        state.clientSuccessMessage = "Profile updated successfully";
      })
      .addCase(updateClientProfile.rejected, (state, action) => {
        state.clientError = action.payload;
      })
      
      // ========== CLIENT PASSWORD ==========
      .addCase(forgotClientPassword.fulfilled, (state, action) => {
        state.clientSuccessMessage = action.payload?.message || "Password reset OTP sent";
      })
      .addCase(forgotClientPassword.rejected, (state, action) => {
        state.clientError = action.payload;
      })
      
      .addCase(resetClientPassword.pending, (state) => {
        state.clientResetLoading = true;
      })
      .addCase(resetClientPassword.fulfilled, (state, action) => {
        state.clientResetLoading = false;
        state.clientSuccessMessage = action.payload?.message || "Password reset successfully";
      })
      .addCase(resetClientPassword.rejected, (state, action) => {
        state.clientResetLoading = false;
        state.clientResetError = action.payload;
      })
      
      .addCase(changeClientPassword.fulfilled, (state, action) => {
        state.clientSuccessMessage = action.payload?.message || "Password changed successfully";
      })
      .addCase(changeClientPassword.rejected, (state, action) => {
        state.clientError = action.payload;
      })
      
      // ========== VENDOR PROFILE ==========
      .addCase(updateVendorProfile.fulfilled, (state, action) => {
        state.vendorProfile = action.payload?.data || action.payload?.vendor || action.payload;
        state.vendorSuccessMessage = "Vendor profile updated successfully";
      })
      .addCase(updateVendorProfile.rejected, (state, action) => {
        state.vendorError = action.payload;
      })
      
      .addCase(getVendorDetails.fulfilled, (state, action) => {
        state.vendorProfile = action.payload?.data || action.payload?.vendor || action.payload;
      })
      .addCase(getVendorDetails.rejected, (state, action) => {
        state.vendorError = action.payload;
      })
      
      // ========== VENDOR PASSWORD ==========
      .addCase(forgotVendorPassword.fulfilled, (state, action) => {
        state.vendorSuccessMessage = action.payload?.message || "Password reset OTP sent";
      })
      .addCase(forgotVendorPassword.rejected, (state, action) => {
        state.vendorError = action.payload;
      })
      
      .addCase(resetVendorPassword.pending, (state) => {
        state.vendorResetLoading = true;
      })
      .addCase(resetVendorPassword.fulfilled, (state, action) => {
        state.vendorResetLoading = false;
        state.vendorSuccessMessage = action.payload?.message || "Password reset successfully";
      })
      .addCase(resetVendorPassword.rejected, (state, action) => {
        state.vendorResetLoading = false;
        state.vendorResetError = action.payload;
      })
      
      .addCase(changeVendorPassword.fulfilled, (state, action) => {
        state.vendorSuccessMessage = action.payload?.message || "Password changed successfully";
      })
      .addCase(changeVendorPassword.rejected, (state, action) => {
        state.vendorError = action.payload;
      })
      
      // ========== GOOGLE CALLBACK ==========
      .addCase(getGoogleCallback.fulfilled, (state, action) => {
        state.googleCallback = action.payload;
      })
      
      // ========== PACKAGES ==========
      .addCase(createPackage.pending, (state) => {
        state.packagesLoading = true;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.packagesLoading = false;
        const nextPackage = action.payload?.data || action.payload?.package || action.payload;
        state.selectedPackage = nextPackage;
        state.packages = [nextPackage, ...state.packages];
        state.successMessage = "Package created successfully";
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.packagesLoading = false;
        state.packagesError = action.payload;
      })
      
      .addCase(getAllPackages.pending, (state) => {
        state.packagesLoading = true;
      })
      .addCase(getAllPackages.fulfilled, (state, action) => {
        state.packagesLoading = false;
        state.packages = action.payload?.data || action.payload?.packages || action.payload || [];
      })
      .addCase(getAllPackages.rejected, (state, action) => {
        state.packagesLoading = false;
        state.packagesError = action.payload;
      })
      
      .addCase(getPackageById.pending, (state) => {
        state.packagesLoading = true;
      })
      .addCase(getPackageById.fulfilled, (state, action) => {
        state.packagesLoading = false;
        state.selectedPackage = action.payload?.data || action.payload?.package || action.payload;
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
        const updatedPackage = action.payload?.data || action.payload?.package || action.payload;
        state.selectedPackage = updatedPackage;
        state.packages = state.packages.map((item) =>
          item?.id === updatedPackage?.id ? updatedPackage : item
        );
        state.successMessage = "Package updated successfully";
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.packagesLoading = false;
        state.packagesError = action.payload;
      })
      
      .addCase(deletePackage.pending, (state) => {
        state.packagesLoading = true;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packagesLoading = false;
        const deletedId = action.meta.arg;
        state.packages = state.packages.filter((item) => item?.id !== deletedId);
        if (state.selectedPackage?.id === deletedId) {
          state.selectedPackage = null;
        }
        state.successMessage = "Package deleted successfully";
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.packagesLoading = false;
        state.packagesError = action.payload;
      })
      
      // ========== TOURIST CENTRES ==========
      .addCase(registerTouristCenter.pending, (state) => {
        state.touristCentresLoading = true;
      })
      .addCase(registerTouristCenter.fulfilled, (state, action) => {
        state.touristCentresLoading = false;
        state.createdTouristCenter = action.payload?.data || action.payload?.tourist || action.payload;
        state.vendorCentres = [state.createdTouristCenter, ...state.vendorCentres];
        state.successMessage = "Tourist centre registered successfully";
      })
      .addCase(registerTouristCenter.rejected, (state, action) => {
        state.touristCentresLoading = false;
        state.touristCentresError = action.payload;
      })
      
      .addCase(getTouristCentersByState.pending, (state) => {
        state.touristCentresLoading = true;
        state.touristCentresError = null;
      })
      .addCase(getTouristCentersByState.fulfilled, (state, action) => {
        state.touristCentresLoading = false;
        // Get the validated data from the response
        const centres = action.payload?.data || [];
        state.touristCentres = centres;
        state.touristCentresError = null;
        
        // Log to debug
        console.log("Stored in Redux - touristCentres:", centres);
      })
      .addCase(getTouristCentersByState.rejected, (state, action) => {
        state.touristCentresLoading = false;
        state.touristCentres = [];
        // Don't set error for 404
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
        state.selectedTouristCenter = action.payload?.data || action.payload?.tourist || action.payload;
      })
      .addCase(getTouristCenterById.rejected, (state, action) => {
        state.touristCentresLoading = false;
        state.touristCentresError = action.payload;
      })
      
      .addCase(getVendorTouristCenters.pending, (state) => {
        state.touristCentresLoading = true;
      })
      .addCase(getVendorTouristCenters.fulfilled, (state, action) => {
        state.touristCentresLoading = false;
        state.vendorCentres = action.payload?.data || action.payload?.tourists || action.payload || [];
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
        const updatedCentre = action.payload?.data || action.payload?.tourist || action.payload;
        state.vendorCentres = state.vendorCentres.map((centre) =>
          centre?.id === updatedCentre?.id ? updatedCentre : centre
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
        state.vendorCentres = state.vendorCentres.filter((centre) => centre?.id !== deletedId);
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
        state.touristCentres = action.payload?.data || action.payload?.tourists || action.payload || [];
      })
      .addCase(getTouristCentersByOpeningHours.rejected, (state, action) => {
        state.touristCentresLoading = false;
        state.touristCentresError = action.payload;
      })
      
      // ========== KYC ==========
      .addCase(createKyc.pending, (state) => {
        state.kycLoading = true;
      })
      .addCase(createKyc.fulfilled, (state, action) => {
        state.kycLoading = false;
        state.kyc = action.payload?.data || action.payload?.kyc || action.payload;
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
        state.kyc = action.payload?.data || action.payload?.kyc || action.payload;
      })
      .addCase(getKycStatus.rejected, (state, action) => {
        state.kycLoading = false;
        state.kycError = action.payload;
      })
      
      // ========== PAYMENT PLANS ==========
      .addCase(createPaymentPlan.pending, (state) => {
        state.paymentPlanLoading = true;
      })
      .addCase(createPaymentPlan.fulfilled, (state, action) => {
        state.paymentPlanLoading = false;
        state.paymentPlan = action.payload?.data || action.payload?.plan || action.payload;
        state.paymentPlans = [state.paymentPlan, ...state.paymentPlans];
        state.successMessage = "Payment plan created successfully";
      })
      .addCase(createPaymentPlan.rejected, (state, action) => {
        state.paymentPlanLoading = false;
        state.paymentPlanError = action.payload;
      })
      
      .addCase(getPaymentPlans.pending, (state) => {
        state.paymentPlanLoading = true;
      })
      .addCase(getPaymentPlans.fulfilled, (state, action) => {
        state.paymentPlanLoading = false;
        state.paymentPlans = action.payload?.data || action.payload?.plans || action.payload || [];
      })
      .addCase(getPaymentPlans.rejected, (state, action) => {
        state.paymentPlanLoading = false;
        state.paymentPlanError = action.payload;
      })
      
      // ========== BOOKINGS ==========
      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.booking = action.payload?.booking || action.payload?.data || action.payload;
        state.userBookings = [state.booking, ...state.userBookings];
        state.successMessage = "Booking created successfully";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })
      
      .addCase(getAllClientBookings.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(getAllClientBookings.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.clientBookings = action.payload?.data || action.payload?.bookings || action.payload || [];
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
        state.userBookings = action.payload?.data || action.payload?.bookings || action.payload || [];
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
        state.vendorBookings = action.payload?.data || action.payload?.bookings || action.payload || [];
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
        state.booking = action.payload?.data || action.payload?.booking || action.payload;
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
          booking?.id === cancelledId ? { ...booking, status: "cancelled" } : booking
        );
        state.clientBookings = state.clientBookings.map((booking) =>
          booking?.id === cancelledId ? { ...booking, status: "cancelled" } : booking
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })
      
      // ========== PAYMENTS ==========
      .addCase(initializePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentData = action.payload?.data || action.payload;
        state.paymentReference = action.payload?.data?.reference || action.payload?.reference;
        state.successMessage = "Payment initialized successfully";
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      
      .addCase(verifyPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentVerified = true;
        state.paymentData = action.payload?.data || action.payload;
        state.successMessage = "Payment verified successfully";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
        state.paymentVerified = false;
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
  resetApiState 
} = apiSlice.actions;

// ========== SELECTORS ==========
// Client Selectors
export const selectClientProfile = (state) => state.api.clientProfile;
export const selectClientLoading = (state) => state.api.clientLoading;
export const selectClientError = (state) => state.api.clientError;
export const selectClientSuccess = (state) => state.api.clientSuccessMessage;
export const selectClientResetLoading = (state) => state.api.clientResetLoading;
export const selectClientResetError = (state) => state.api.clientResetError;

// Vendor Selectors
export const selectVendorProfile = (state) => state.api.vendorProfile;
export const selectVendorLoading = (state) => state.api.vendorLoading;
export const selectVendorError = (state) => state.api.vendorError;
export const selectVendorSuccess = (state) => state.api.vendorSuccessMessage;
export const selectVendorCentres = (state) => state.api.vendorCentres;
export const selectVendorResetLoading = (state) => state.api.vendorResetLoading;
export const selectVendorResetError = (state) => state.api.vendorResetError;

// Package Selectors
export const selectPackages = (state) => state.api.packages;
export const selectSelectedPackage = (state) => state.api.selectedPackage;
export const selectPackagesLoading = (state) => state.api.packagesLoading;
export const selectPackagesError = (state) => state.api.packagesError;

// Tourist Centre Selectors
export const selectTouristCentres = (state) => state.api.touristCentres;
export const selectSelectedTouristCenter = (state) => state.api.selectedTouristCenter;
export const selectTouristCentresLoading = (state) => state.api.touristCentresLoading;
export const selectTouristCentresError = (state) => state.api.touristCentresError;
export const selectCreatedTouristCenter = (state) => state.api.createdTouristCenter;

// KYC Selectors
export const selectKyc = (state) => state.api.kyc;
export const selectKycLoading = (state) => state.api.kycLoading;
export const selectKycError = (state) => state.api.kycError;

// Payment Plan Selectors
export const selectPaymentPlans = (state) => state.api.paymentPlans;
export const selectPaymentPlan = (state) => state.api.paymentPlan;
export const selectPaymentPlanLoading = (state) => state.api.paymentPlanLoading;
export const selectPaymentPlanError = (state) => state.api.paymentPlanError;

// Booking Selectors
export const selectUserBookings = (state) => state.api.userBookings;
export const selectVendorBookings = (state) => state.api.vendorBookings;
export const selectClientBookings = (state) => state.api.clientBookings;
export const selectBooking = (state) => state.api.booking;
export const selectBookingLoading = (state) => state.api.bookingLoading;
export const selectBookingError = (state) => state.api.bookingError;

// Payment Selectors
export const selectPaymentLoading = (state) => state.api.paymentLoading;
export const selectPaymentError = (state) => state.api.paymentError;
export const selectPaymentReference = (state) => state.api.paymentReference;
export const selectPaymentVerified = (state) => state.api.paymentVerified;
export const selectPaymentData = (state) => state.api.paymentData;

// Google Auth Selector
export const selectGoogleCallback = (state) => state.api.googleCallback;

// Common Selectors
export const selectApiLoading = (state) => 
  state.api.loading || 
  state.api.clientLoading || 
  state.api.vendorLoading || 
  state.api.packagesLoading || 
  state.api.touristCentresLoading ||
  state.api.kycLoading ||
  state.api.bookingLoading ||
  state.api.paymentPlanLoading;

export const selectApiError = (state) => state.api.error;
export const selectApiSuccess = (state) => state.api.successMessage;

export default apiSlice.reducer;