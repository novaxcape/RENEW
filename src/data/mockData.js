const img = (text, color) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='${color}'/><text x='300' y='210' font-size='34' fill='white' text-anchor='middle' font-family='sans-serif'>${text}</text></svg>`
  );

const makeCentre = (i, name, city, state, price, color, trending) => {
  const pic = img(name, color);
  return {
    id: String(i), _id: String(i), centreId: String(i),
    name, centreName: name, title: name,
    city, state, location: `${city}, ${state}`,
    rating: 4.5, reviews: 100 + i * 7, price,
    image: pic, photo: pic, coverImage: pic, imagePublicUrl: pic,
    images: [pic, pic, pic], imagesPublicUrl: [pic, pic, pic], photos: [pic, pic, pic],
    openingHours: "8:00 AM - 6:00 PM", trending, isTrending: trending, time: "8:00 AM - 6:00 PM",
    description: `${name} is one of the most loved destinations in ${state}. Enjoy scenic views, guided tours and unforgettable memories.`,
  };
};

export const mockCentres = [
  makeCentre(1, "Obudu Mountain Resort", "Obudu", "Cross River", 15000, "#2f6f4e", true),
  makeCentre(2, "Olumo Rock", "Abeokuta", "Ogun", 5000, "#8a5a2b", true),
  makeCentre(3, "Yankari Game Reserve", "Bauchi", "Bauchi", 12000, "#b07d2b", false),
  makeCentre(4, "Lekki Conservation Centre", "Lekki", "Lagos", 4000, "#2b7a8a", true),
  makeCentre(5, "Zuma Rock", "Suleja", "Niger", 3000, "#6b4f8a", false),
  makeCentre(6, "Idanre Hills", "Idanre", "Ondo", 6000, "#a04646", false),
];

export const mockPackages = [
  { id: "p1", _id: "p1", name: "Standard Ticket", packageName: "Standard Ticket", packageType: "Standard", type: "Standard", description: "Single-day entry with a guided walk.", amount: 5000, price: 5000, numberOfPeople: 1, maxPeople: 1, status: "active", createdAt: "2026-09-01T10:00:00Z" },
  { id: "p2", _id: "p2", name: "Family Pass", packageName: "Family Pass", packageType: "Family", type: "Family", description: "Entry for up to 4 people with refreshments.", amount: 18000, price: 18000, numberOfPeople: 4, maxPeople: 4, status: "active", createdAt: "2026-09-03T10:00:00Z" },
  { id: "p3", _id: "p3", name: "VIP Experience", packageName: "VIP Experience", packageType: "VIP", type: "VIP", description: "Private guide, priority access and lunch.", amount: 35000, price: 35000, numberOfPeople: 2, maxPeople: 2, status: "inactive", createdAt: "2026-09-05T10:00:00Z" },
];

const statuses = ["Successful", "In Progress", "Installment", "Cancelled", "Successful"];
export const mockBookings = statuses.map((status, i) => ({
  id: `b${i + 1}`, _id: `b${i + 1}`,
  bookingNumber: `NVX-${1001 + i}`, ticketId: `TKT-${2001 + i}`,
  status, ticketType: mockPackages[i % 3].name, ticket: mockPackages[i % 3].name,
  package: mockPackages[i % 3], packageName: mockPackages[i % 3].name,
  tourist: { name: mockCentres[i].name, centreName: mockCentres[i].name },
  centreName: mockCentres[i].name,
  amount: mockPackages[i % 3].amount, totalAmount: mockPackages[i % 3].amount, price: mockPackages[i % 3].amount,
  date: `2026-10-0${i + 1}`, visitDate: `2026-10-1${i}`, createdAt: `2026-10-0${i + 1}T09:30:00Z`,
  passcode: `${482910 + i}`, isInstallment: status === "Installment",
}));

export const mockReviews = [
  { id: "r1", name: "Amaka Obi", text: "Beautiful place and very well organised. The guide was excellent!", rating: 5, date: "2026-09-12", avatar: img("AO", "#555") },
  { id: "r2", name: "Tunde Bello", text: "Great views and friendly staff. Will visit again with the family.", rating: 4, date: "2026-09-20", avatar: img("TB", "#666") },
  { id: "r3", name: "Ngozi Eze", text: "Booking was smooth and the experience was worth every naira.", rating: 5, date: "2026-10-01", avatar: img("NE", "#777") },
];

export const mockTransactions = [
  { id: "t1", walletId: "w1", type: "credit", transactionType: "credit", title: "Booking payment", description: "Booking NVX-1001", narration: "Booking NVX-1001", amount: 15000, value: 15000, total: 15000, payoutAmount: 15000, status: "Successful", paymentStatus: "Successful", bankName: "GTBank", providerReference: "REF-9001", purpose: "booking", date: "2026-10-01", createdAt: "2026-10-01T10:00:00Z", updatedAt: "2026-10-01T10:00:00Z", timestamp: "2026-10-01T10:00:00Z" },
  { id: "t2", walletId: "w1", type: "debit", transactionType: "debit", title: "Withdrawal", description: "Payout to bank", narration: "Payout to bank", amount: 10000, value: 10000, total: 10000, payoutAmount: 10000, status: "Successful", paymentStatus: "Successful", bankName: "Access Bank", providerReference: "REF-9002", purpose: "withdrawal", date: "2026-10-03", createdAt: "2026-10-03T10:00:00Z", updatedAt: "2026-10-03T10:00:00Z", timestamp: "2026-10-03T10:00:00Z" },
];

const person = {
  id: "u1", _id: "u1", name: "Ada Lovelace", fullName: "Ada Lovelace", firstName: "Ada", lastName: "Lovelace",
  email: "ada@example.com", phone: "08012345678", phoneNumber: "08012345678",
  businessName: "Ada Tours", business: "Ada Tours", businessAddress: "12 Marina Road, Lagos", address: "12 Marina Road, Lagos",
  avatar: img("AL", "#444"), image: img("AL", "#444"),
};

export const mockAuth = {
  loggedInUser: person, userToken: "mock-token", loading: false, error: null,
  isAuthenticated: true, vendorDetails: person, isVendor: false,
};

export const mockApi = {
  clientLoading: false, clientError: null, clientProfile: person, clientSuccessMessage: null,
  clientResetLoading: false, clientResetError: null,
  vendorLoading: false, vendorError: null, vendorProfile: person, vendorSuccessMessage: null,
  vendorCentres: mockCentres, vendorResetLoading: false, vendorResetError: null,
  packagesLoading: false, packagesError: null, packages: mockPackages, selectedPackage: mockPackages[0],
  touristCentresLoading: false, touristCentresError: null, touristCentres: mockCentres,
  selectedTouristCenter: mockCentres[0], createdTouristCenter: null,
  kycLoading: false, kycError: null, kyc: null,
  paymentPlanLoading: false, paymentPlanError: null, paymentPlan: null, paymentPlans: [],
  bookingLoading: false, bookingError: null, booking: mockBookings[0],
  userBookings: mockBookings, vendorBookings: mockBookings,
  vendorBookingPagination: { page: 1, totalPages: 1, total: mockBookings.length },
  clientBookings: mockBookings,
  paymentLoading: false, paymentError: null, paymentReference: null, paymentVerified: false, paymentData: null,
  reviewsLoading: false, reviewsError: null, reviews: mockReviews,
  reviewStatistics: { average: 4.7, count: mockReviews.length },
  googleCallback: null, loading: false, error: null, successMessage: null,
};

export const mockDashboard = {
  stats: {
    vendorName: "Ada Tours",
    requests: { today: 24, yesterday: 18 },
    revenue: { today: 185000, yesterday: 142000 },
    bookings: { today: 12, yesterday: 9, total: 340 },
    ticketTypes: { breakdown: [{ name: "Standard", value: 60 }, { name: "Family", value: 25 }, { name: "VIP", value: 15 }], total: 100 },
    visitorStats: [
      { day: "Mon", date: "Mon", visits: 40 }, { day: "Tue", date: "Tue", visits: 55 }, { day: "Wed", date: "Wed", visits: 38 },
      { day: "Thu", date: "Thu", visits: 70 }, { day: "Fri", date: "Fri", visits: 90 }, { day: "Sat", date: "Sat", visits: 120 }, { day: "Sun", date: "Sun", visits: 85 },
    ],
    ratings: { average: 4.7, count: 128 },
    recentBookings: mockBookings,
  },
  loading: false, error: null,
  wallet: { id: "w1", touristId: "1", balance: 250000, totalEarnings: 980000 },
  walletLoading: false, walletError: null,
  transactions: mockTransactions, transactionsLoading: false, transactionsError: null,
};

export const mockState = { auth: mockAuth, api: mockApi, dashboard: mockDashboard };

export const dispatch = () => {
  const result = Promise.resolve({ payload: {}, meta: { requestStatus: "fulfilled" } });
  result.unwrap = () => Promise.resolve({});
  return result;
};

const done = () => Promise.resolve({ data: {} });
export const axios = {
  get: done, post: done, put: done, patch: done, delete: done,
  interceptors: { request: { use: () => 0 }, response: { use: () => 0 } },
};
export const noFetch = () =>
  Promise.resolve({ ok: true, status: 200, json: async () => ({}), text: async () => "" });

export const googleAuthUrl = "#";

// ========== SELECTORS ==========
export const selectClientProfile = state => state.api.clientProfile;
export const selectClientLoading = state => state.api.clientLoading;
export const selectClientError = state => state.api.clientError;
export const selectClientSuccess = state => state.api.clientSuccessMessage;
export const selectClientResetLoading = state => state.api.clientResetLoading;
export const selectClientResetError = state => state.api.clientResetError;
export const selectVendorProfile = state => state.api.vendorProfile;
export const selectVendorLoading = state => state.api.vendorLoading;
export const selectVendorError = state => state.api.vendorError;
export const selectVendorSuccess = state => state.api.vendorSuccessMessage;
export const selectVendorCentres = state => state.api.vendorCentres;
export const selectVendorResetLoading = state => state.api.vendorResetLoading;
export const selectVendorResetError = state => state.api.vendorResetError;
export const selectPackages = state => state.api.packages;
export const selectSelectedPackage = state => state.api.selectedPackage;
export const selectPackagesLoading = state => state.api.packagesLoading;
export const selectPackagesError = state => state.api.packagesError;
export const selectTouristCentres = state => state.api.touristCentres;
export const selectSelectedTouristCenter = state => state.api.selectedTouristCenter;
export const selectTouristCentresLoading = state => state.api.touristCentresLoading;
export const selectTouristCentresError = state => state.api.touristCentresError;
export const selectCreatedTouristCenter = state => state.api.createdTouristCenter;
export const selectKyc = state => state.api.kyc;
export const selectKycLoading = state => state.api.kycLoading;
export const selectKycError = state => state.api.kycError;
export const selectPaymentPlans = state => state.api.paymentPlans;
export const selectPaymentPlan = state => state.api.paymentPlan;
export const selectPaymentPlanLoading = state => state.api.paymentPlanLoading;
export const selectPaymentPlanError = state => state.api.paymentPlanError;
export const selectUserBookings = state => state.api.userBookings;
export const selectVendorBookings = state => state.api.vendorBookings;
export const selectVendorBookingPagination = state => state.api.vendorBookingPagination;
export const selectClientBookings = state => state.api.clientBookings;
export const selectBooking = state => state.api.booking;
export const selectBookingLoading = state => state.api.bookingLoading;
export const selectBookingError = state => state.api.bookingError;
export const selectPaymentLoading = state => state.api.paymentLoading;
export const selectPaymentError = state => state.api.paymentError;
export const selectPaymentReference = state => state.api.paymentReference;
export const selectPaymentVerified = state => state.api.paymentVerified;
export const selectPaymentData = state => state.api.paymentData;
export const selectReviews = state => state.api.reviews;
export const selectReviewsLoading = state => state.api.reviewsLoading;
export const selectReviewsError = state => state.api.reviewsError;
export const selectReviewStatistics = state => state.api.reviewStatistics;
export const selectGoogleCallback = state => state.api.googleCallback;
export const selectApiLoading = state => state.api.loading || state.api.clientLoading || state.api.vendorLoading || state.api.packagesLoading || state.api.touristCentresLoading || state.api.kycLoading || state.api.bookingLoading || state.api.paymentPlanLoading || state.api.paymentLoading || state.api.reviewsLoading;
export const selectApiError = state => state.api.error;
export const selectApiSuccess = state => state.api.successMessage;
// ========== DASHBOARD SELECTORS ==========
export const selectDashboard = state => state.dashboard;
export const selectStats = state => state.dashboard.stats;
export const selectLoading = state => state.dashboard.loading;
export const selectError = state => state.dashboard.error;
export const selectVendorName = state => state.dashboard.stats?.vendorName || '';
export const selectRequests = state => state.dashboard.stats?.requests || {
  today: 0,
  yesterday: 0
};
export const selectRevenue = state => state.dashboard.stats?.revenue || {
  today: 0,
  yesterday: 0
};
export const selectBookings = state => state.dashboard.stats?.bookings || {
  today: 0,
  yesterday: 0,
  total: 0
};
export const selectTicketTypes = state => state.dashboard.stats?.ticketTypes || {
  breakdown: [],
  total: 0
};
export const selectVisitorStats = state => state.dashboard.stats?.visitorStats || [];
export const selectRatings = state => state.dashboard.stats?.ratings || {
  average: 0,
  count: 0
};

// ========== WALLET SELECTORS ==========
// ========== WALLET SELECTORS ==========
export const selectWallet = state => state.dashboard.wallet;
export const selectWalletLoading = state => state.dashboard.walletLoading;
export const selectWalletError = state => state.dashboard.walletError;

// Computed wallet selectors
// Computed wallet selectors
export const selectWalletBalance = state => state.dashboard.wallet?.balance || 0;
export const selectWalletTotalEarnings = state => state.dashboard.wallet?.totalEarnings || 0;
export const selectWalletId = state => state.dashboard.wallet?.id || null;
export const selectWalletTouristId = state => state.dashboard.wallet?.touristId || null;

// ========== TRANSACTIONS SELECTORS ==========
// ========== TRANSACTIONS SELECTORS ==========
export const selectTransactions = state => state.dashboard.transactions || [];
export const selectTransactionsLoading = state => state.dashboard.transactionsLoading;
export const selectTransactionsError = state => state.dashboard.transactionsError;

export const createPackage = () => ({});
export const registerTouristCenter = () => ({});
export const fetchDashboard = () => ({});
export const fetchDashboardSuccess = () => ({});
export const fetchDashboardFail = () => ({});
export const clearDashboardError = () => ({});
export const logout = () => ({});
export const getTouristCentersByState = () => ({});
export const clearApiError = () => ({});
export const setUserDetails = () => ({});
export const updateToken = () => ({});
export const loginSuccess = () => ({});
export const getTouristCenterById = () => ({});
export const getAllPackages = () => ({});
export const updateVendorProfile = () => ({});
export const getVendorDetails = () => ({});
export const changeVendorPassword = () => ({});
export const clearVendorError = () => ({});
export const clearVendorSuccess = () => ({});
export const setLoading = () => ({});
export const setError = () => ({});
export const clearError = () => ({});
export const setVendorDetails = () => ({});
export const updateVendorToken = () => ({});
export const getVendorAllCentres = () => ({});
export const deleteTouristCenter = () => ({});
export const vendorLogout = () => ({});
export const vendorVerifyOTP = () => ({});
export const vendorVerifyOTPSuccess = () => ({});
export const vendorVerifyOTPFail = () => ({});
export const verifyAdmin = () => ({});
export const verifyAdminSuccess = () => ({});
export const verifyAdminFail = () => ({});
export const verifyPayment = () => ({});
export const getBookingById = () => ({});
export const getInstallmentPaymentStatus = () => ({});
export const clearPaymentData = () => ({});
export const getAllClientBookings = () => ({});
export const getVendorBookings = () => ({});
export const getVendorTouristCenters = () => ({});
export const createBooking = () => ({});
export const initializePayment = () => ({});
export const getPackageById = () => ({});
export const getPaymentPlans = () => ({});
export const logoutClient = () => ({});
export const logoutVendor = () => ({});
export const createKyc = () => ({});
export const deletePackage = () => ({});
export const updatePackage = () => ({});
export const verifyPasscode = () => ({});
export const updateClientProfile = () => ({});
export const clearClientError = () => ({});
export const clearClientSuccess = () => ({});
export const createReview = () => ({});
export const fetchWalletStart = () => ({});
export const fetchWalletSuccess = () => ({});
export const fetchWalletFail = () => ({});
export const clearWalletError = () => ({});
