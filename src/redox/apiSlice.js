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
export const registerTouristCenter = createThunk(
  "api/touristCentre/register",
  ({ vendorId, centreData }, { getState }) =>
    axios.post(
      `${API_BASE_URL}/tourist/register/${vendorId}`,
      toFormData(centreData),
      authConfig(getState())
    )
);

export const getTouristCentersByState = createThunk(
  "api/touristCentre/getByState",
  (state) =>
    axios.get(`${API_BASE_URL}/tourist/get-all-state/${encodeURIComponent(state)}`)
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

export const getUserBookings = createThunk(
  "api/booking/getUserBookings",
  (userId, { getState }) =>
    axios.get(`${API_BASE_URL}/booking/user/${userId}`, authConfig(getState()))
);

export const getVendorBookings = createThunk(
  "api/booking/getVendorBookings",
  (vendorId, { getState }) =>
    axios.get(`${API_BASE_URL}/booking/vendor/${vendorId}`, authConfig(getState()))
);

// ========== INITIAL STATE ==========
const initialState = {
  // Client State
  clientLoading: false,
  clientError: null,
  clientProfile: null,
  clientSuccessMessage: null,
  
  // Vendor State
  vendorLoading: false,
  vendorError: null,
  vendorProfile: null,
  vendorSuccessMessage: null,
  vendorCentres: [],
  
  // Package State
  packagesLoading: false,
  packagesError: null,
  packages: [],
  selectedPackage: null,
  
  // Tourist Centre State
  touristCentresLoading: false,
  touristCentresError: null,
  touristCentres: [],
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
      })
      .addCase(getTouristCentersByState.fulfilled, (state, action) => {
        state.touristCentresLoading = false;
        state.touristCentres = action.payload?.data || action.payload?.tourists || action.payload || [];
      })
      .addCase(getTouristCentersByState.rejected, (state, action) => {
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

// Vendor Selectors
export const selectVendorProfile = (state) => state.api.vendorProfile;
export const selectVendorLoading = (state) => state.api.vendorLoading;
export const selectVendorError = (state) => state.api.vendorError;
export const selectVendorSuccess = (state) => state.api.vendorSuccessMessage;
export const selectVendorCentres = (state) => state.api.vendorCentres;

// Package Selectors
export const selectPackages = (state) => state.api.packages;
export const selectSelectedPackage = (state) => state.api.selectedPackage;
export const selectPackagesLoading = (state) => state.api.packagesLoading;

// Tourist Centre Selectors
export const selectTouristCentres = (state) => state.api.touristCentres;
export const selectTouristCentresLoading = (state) => state.api.touristCentresLoading;

// Booking Selectors
export const selectUserBookings = (state) => state.api.userBookings;
export const selectVendorBookings = (state) => state.api.vendorBookings;

export default apiSlice.reducer;