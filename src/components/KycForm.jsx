import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LuBuilding2, LuCreditCard, LuUser } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { createKyc } from "../redox/apiSlice";
import "./css/KycForm.css";

const initialFormData = {
  centreName: "",
  lankmark: "",
  CAC: "",
  centreEmail: "",
  yearEstablished: "",
  centreType: "",
  phoneNumber: "",
  centrePhoneNumber: "", // Add both fields
  postal: "",
  city: "",
  state: "",
  streetAddress: "",
  directorFullName: "",
  directorEmail: "",
  directorPhoneNumber: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  bankCode: "",
};

const getEntityId = (value) =>
  value?.id ||
  value?._id ||
  value?.touristId ||
  value?.data?.id ||
  value?.data?._id ||
  value?.tourist?.id ||
  value?.tourist?._id ||
  value?.touristCenter?.id ||
  value?.touristCenter?._id;

const KycForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { kycLoading } = useSelector((state) => state.api);
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...(location.state?.centreName ? { centreName: location.state.centreName } : {}),
  }));

  const touristId =
    location.state?.touristId ||
    localStorage.getItem("latestTouristId") ||
    getEntityId(location.state?.centreData) ||
    null;

  useEffect(() => {
    if (!touristId) {
      Swal.fire({
        icon: "info",
        title: "Add Your Centre First",
        text: "Please add your tourism centre before completing KYC verification.",
        confirmButtonColor: "#ff6b35",
      }).then(() => {
        navigate("/add-centre", { replace: true });
      });
    }
  }, [navigate, touristId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "lankmark",
      "CAC",
      "yearEstablished",
      "phoneNumber",
      "centreType",
      "postal",
      "state",
      "directorFullName",
      "directorEmail",
      "directorPhoneNumber",
      "bankName",
      "accountNumber",
      "accountName",
    ];

    const missingField = requiredFields.find((field) => !formData[field]);
    if (missingField) {
      const fieldNames = {
        lankmark: "Landmark",
        CAC: "CAC Registration Number",
        yearEstablished: "Year Established",
        phoneNumber: "Centre Phone Number",
        centreType: "Centre Type",
        postal: "Postal Code",
        state: "State",
        directorFullName: "Director Full Name",
        directorEmail: "Director Email",
        directorPhoneNumber: "Director Phone Number",
        bankName: "Bank Name",
        accountNumber: "Account Number",
        accountName: "Account Name",
      };
      return `Please complete the required field: ${fieldNames[missingField] || missingField}`;
    }

    if (formData.directorEmail && !/\S+@\S+\.\S+/.test(formData.directorEmail)) {
      return "Please enter a valid email address for the director";
    }

    if (
      formData.yearEstablished &&
      (formData.yearEstablished < 1800 ||
        formData.yearEstablished > new Date().getFullYear())
    ) {
      return "Please enter a valid year established (between 1800 and current year)";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!touristId) {
      Swal.fire({
        icon: "info",
        title: "Add Your Centre First",
        text: "Please add your tourism centre before completing KYC verification.",
        confirmButtonColor: "#ff6b35",
      }).then(() => {
        navigate("/add-centre", { replace: true });
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: validationError,
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    // Send BOTH phoneNumber and centrePhoneNumber to satisfy backend
    const kycData = {
      lankmark: formData.lankmark,
      CAC: formData.CAC,
      yearEstablished: Number(formData.yearEstablished),
      phoneNumber: String(formData.phoneNumber),
      centrePhoneNumber: String(formData.phoneNumber), // Send same value as centrePhoneNumber
      centreEmail: formData.centreEmail,
      centreType: formData.centreType,
      postal: formData.postal,
      state: formData.state,
      directorFullName: formData.directorFullName,
      directorEmail: formData.directorEmail,
      directorPhoneNumber: String(formData.directorPhoneNumber),
      bankName: formData.bankName,
      accountNumber: String(formData.accountNumber),
      accountName: formData.accountName,
      bankCode: formData.bankCode || "",
      // Optional fields
      ...(formData.centreName && { centreName: formData.centreName }),
      ...(formData.city && { city: formData.city }),
      ...(formData.streetAddress && { streetAddress: formData.streetAddress }),
    };

    console.log("=== SENDING BOTH PHONE FIELDS ===");
    console.log("Submitting KYC data:", JSON.stringify(kycData, null, 2));
    console.log("Tourist ID:", touristId);
    console.log("Has phoneNumber:", Object.hasOwn(kycData, "phoneNumber"));
    console.log("Has centrePhoneNumber:", Object.hasOwn(kycData, "centrePhoneNumber"));

    try {
   await dispatch(
  createKyc({ touristId, kycData })
).unwrap();

// Remove temporary storage
localStorage.removeItem("latestTouristId");

// ✅ Mark onboarding as completed
localStorage.setItem("kycSubmitted", "true");
localStorage.setItem("vendorHasCentre", "true");

// If you want vendors to access the dashboard immediately,
// temporarily mark packages as complete too.
localStorage.setItem("vendorHasPackages", "true");

Swal.fire({
  icon: "success",
  title: "KYC Submitted Successfully!",
  text: "Your verification details have been submitted. You will be notified once verified.",
  confirmButtonColor: "#ff6b35",
  timer: 3000,
  timerProgressBar: true,
}).then(() => {
  navigate("/vendor/dashboard");
});
    } catch (error) {
      console.error("KYC submission error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      
      // Try to get the actual error message from backend
      let errorMessage = "Unable to submit KYC. Please try again.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }
      
      Swal.fire({
        icon: "error",
        title: "KYC Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    }
  };

  return (
    <main className="kyc-page-wrapper">
      <div className="back-button-row">
        <div className="back-button-container">
          <button
            type="button"
            className="kyc-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back to Centre Details
          </button>
        </div>
      </div>

      <div className="content-bg-container">
        <div className="kyc-page-container">
          <div className="kyc-intro-section">
            <h1 className="kyc-main-title">KYC Verification</h1>
            <p className="kyc-sub-title">
              Complete your verification to start receiving bookings
            </p>
            {touristId && (
              <div className="kyc-info-banner">
                <FiCheckCircle style={{ marginRight: "8px" }} />
                Centre ID: {touristId}
              </div>
            )}
          </div>

          <form className="kyc-multi-block-form" onSubmit={handleSubmit}>
            {/* Business Information Section */}
            <section className="kyc-form-card">
              <div className="card-header-row">
                <LuBuilding2 className="card-header-icon" />
                <h2 className="card-section-title">Business Information</h2>
              </div>

              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label className="form-field-label">Centre Name</label>
                  <input
                    name="centreName"
                    value={formData.centreName}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., Lekki Tourism Limited"
                  />
                  <small className="field-hint">Optional</small>
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Landmark *</label>
                  <input
                    name="lankmark"
                    value={formData.lankmark}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., Near Lekki Toll Gate"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">CAC Registration Number *</label>
                  <input
                    name="CAC"
                    value={formData.CAC}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., RC 123456"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Centre Email</label>
                  <input
                    name="centreEmail"
                    value={formData.centreEmail}
                    onChange={handleChange}
                    type="email"
                    className="form-text-input"
                    placeholder="info@business.com"
                  />
                  <small className="field-hint">Optional</small>
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Year Established *</label>
                  <input
                    name="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    type="number"
                    className="form-text-input"
                    placeholder="e.g., 2020"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Centre Type *</label>
                  <input
                    name="centreType"
                    value={formData.centreType}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., recreation, museum"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Centre Phone *</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    type="tel"
                    className="form-text-input"
                    placeholder="08012345678"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Postal Code *</label>
                  <input
                    name="postal"
                    value={formData.postal}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., 101245"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., Lagos"
                  />
                  <small className="field-hint">Optional</small>
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">State *</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., Lagos"
                    required
                  />
                </div>

                <div className="form-input-group full-width-field">
                  <label className="form-field-label">Street Address</label>
                  <input
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="Street address"
                  />
                  <small className="field-hint">Optional</small>
                </div>
              </div>
            </section>

            {/* Owner/Director Information Section */}
            <section className="kyc-form-card">
              <div className="card-header-row">
                <LuUser className="card-header-icon" />
                <h2 className="card-section-title">Owner/Director Information</h2>
              </div>

              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label className="form-field-label">Full Name *</label>
                  <input
                    name="directorFullName"
                    value={formData.directorFullName}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Email Address *</label>
                  <input
                    name="directorEmail"
                    value={formData.directorEmail}
                    onChange={handleChange}
                    type="email"
                    className="form-text-input"
                    placeholder="director@example.com"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Phone Number *</label>
                  <input
                    name="directorPhoneNumber"
                    value={formData.directorPhoneNumber}
                    onChange={handleChange}
                    type="tel"
                    className="form-text-input"
                    placeholder="08012345678"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Bank Account Details Section */}
            <section className="kyc-form-card">
              <div className="card-header-row">
                <LuCreditCard className="card-header-icon" />
                <h2 className="card-section-title">Bank Account Details</h2>
              </div>

              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label className="form-field-label">Bank Name *</label>
                  <input
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., Access Bank"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Account Number *</label>
                  <input
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="1234567890"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Account Name *</label>
                  <input
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="As it appears in bank records"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Bank Code</label>
                  <input
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleChange}
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., 044"
                  />
                  <small className="field-hint">Optional</small>
                </div>
              </div>
            </section>

            <div className="submit-action-row">
              <button
                type="submit"
                className="kyc-submit-btn"
                disabled={kycLoading}
                style={{ opacity: kycLoading ? 0.7 : 1 }}
              >
                {kycLoading
                  ? "Submitting..."
                  : "Submit for Verification"}
                <FiCheckCircle className="btn-success-check-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default KycForm;
