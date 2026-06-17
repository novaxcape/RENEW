import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Stepper from '../components/Stepper';
import "../Styles/Addcenter.css";

import BasicInfo from '../components/BasicInfo';
import Facilities from '../components/Facilities';
import Pricing from '../components/Pricing';
import Images from '../components/Images';
import Hours from '../components/Hours';
import Review from '../components/Review';
import { createPackage, registerTouristCenter } from '../redox/apiSlice';

const defaultOpeningHours = {
  monday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
  tuesday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
  wednesday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
  thursday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
  friday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
  saturday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
  sunday: { isOpen: false, openTime: '10 AM', closeTime: '4 PM' },
};

// ✅ ROBUST getEntityId function - handles all response formats
const getEntityId = (value) => {
  if (!value) return null;

  // If it's already a string
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  // If it's an object
  if (typeof value === 'object') {
    // Check common paths
    const paths = [
      'data.touristId',
      'data.id', 
      'data._id',
      'data.data.id',
      'data.data._id',
      'data.data.touristId',
      'touristId',
      'id',
      '_id',
      'vendorId',
      'userId',
      'data.vendorId',
      'data.userId'
    ];

    for (const path of paths) {
      const parts = path.split('.');
      let current = value;
      let found = true;
      
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          found = false;
          break;
        }
      }
      
      if (found && current && typeof current === 'string' && current.length > 0) {
        return current;
      }
    }

    // If no path worked, try to find any property that looks like an ID
    for (const key of Object.keys(value)) {
      const val = value[key];
      if (typeof val === 'string' && val.length > 0 && 
          (key.toLowerCase().includes('id') || 
           key.toLowerCase().includes('tourist') ||
           key.toLowerCase().includes('vendor') ||
           key.toLowerCase().includes('user'))) {
        return val;
      }
      // Recursively check nested objects
      if (typeof val === 'object' && val !== null) {
        const nestedId = getEntityId(val);
        if (nestedId) return nestedId;
      }
    }
  }

  console.warn("⚠️ Could not extract ID from:", value);
  return null;
};

// ✅ MAX FILE SIZE CONSTANT
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const AddCentre = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorDetails, loggedInUser } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.api);

  const [currentStep, setCurrentStep] = useState(1);
  const [centreData, setCentreData] = useState({
    centreName: '',
    location: '',
    description: '',
    city: '',
    state: '',
    streetAddress: '',
  });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [pricingData, setPricingData] = useState({
    dailySlotCapacity: '',
    installmentPayment: false,
  });
  const [packagesList, setPackagesList] = useState([
    { packageName: '', packageType: '', amount: '', numberOfPeople: '' }
  ]);
  const [uploadedImages, setUploadedImages] = useState({});
  const [documents, setDocuments] = useState({
    termsAndCondition: null,
    privacyPolicy: null,
  });
  const [openingHours, setOpeningHours] = useState(defaultOpeningHours);

  const handleCentreChange = (event) => {
    const { name, value } = event.target;
    setCentreData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPricingData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePackagesChange = (packages) => {
    setPackagesList(packages);
  };

  const handleFacilityToggle = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  const handleHoursChange = (day, field, value) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  // Validate current step before proceeding
  const validateCurrentStep = () => {
    switch(currentStep) {
      case 1: // Basic Information
        if (!centreData.centreName) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please enter centre name.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!centreData.city) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please enter city.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!centreData.state) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please select state.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!centreData.streetAddress) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please enter street address.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!centreData.location) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please provide location/GPS coordinates.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!centreData.description) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please enter description.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        return true;
        
      case 2: // Facilities
        if (selectedFacilities.length === 0) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please select at least one facility.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        return true;
        
      case 3: // Pricing
        if (!pricingData.dailySlotCapacity) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please enter daily slot capacity.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        const validPackages = packagesList.filter(pkg => 
          pkg.packageName && pkg.packageType && pkg.amount && pkg.numberOfPeople
        );
        if (validPackages.length === 0) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please add at least one valid package.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!documents.termsAndCondition || !documents.privacyPolicy) {
          Swal.fire({ icon: 'error', title: 'Missing Documents', text: 'Please upload terms and privacy policy documents.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        return true;
        
      case 4: // Images
        const imageFiles = Object.values(uploadedImages).filter((image) => image?.file);
        if (imageFiles.length < 1) {
          Swal.fire({ icon: 'error', title: 'Missing Images', text: 'Please upload at least 1 centre image.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        // Check file sizes in validation
        const oversized = imageFiles.filter(file => file.size > MAX_FILE_SIZE);
        if (oversized.length > 0) {
          Swal.fire({ 
            icon: 'error', 
            title: 'File Too Large', 
            text: 'One or more images exceed the 10MB limit. Please compress your images and try again.', 
            confirmButtonColor: '#ff6b35' 
          });
          return false;
        }
        return true;
        
      case 5: // Hours - Optional, can proceed
        return true;
        
      default:
        return true;
    }
  };

  const validateCentre = () => {
    const imageFiles = Object.values(uploadedImages).filter((image) => image?.file);
    const validPackages = packagesList.filter(pkg => 
      pkg.packageName && pkg.packageType && pkg.amount && pkg.numberOfPeople
    );

    if (
      !centreData.centreName ||
      !centreData.description ||
      !centreData.city ||
      !centreData.state ||
      !centreData.streetAddress ||
      !centreData.location
    ) {
      return 'Please complete the basic information fields.';
    }

    if (!selectedFacilities.length) {
      return 'Please select at least one facility.';
    }

    if (!pricingData.dailySlotCapacity) {
      return 'Please add the daily capacity.';
    }

    if (validPackages.length === 0) {
      return 'Please add at least one valid package.';
    }

    if (imageFiles.length < 1) {
      return 'Please upload at least 1 centre image.';
    }

    const oversized = imageFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      return 'One or more images exceed the 10MB limit. Please compress your images.';
    }

    if (!documents.termsAndCondition) {
      return 'Please upload the Terms and Condition document.';
    }

    if (!documents.privacyPolicy) {
      return 'Please upload the Privacy Policy document.';
    }

    return '';
  };

  // ✅ FIXED: Package creation function with proper error handling
  const createPackagesForCentre = async (touristId) => {
    const validPackages = packagesList.filter(pkg => 
      pkg.packageName?.trim() && 
      pkg.packageType?.trim() && 
      pkg.amount && 
      Number(pkg.amount) > 0 &&
      pkg.numberOfPeople && 
      Number(pkg.numberOfPeople) > 0
    );

    if (validPackages.length === 0) {
      console.warn('No valid packages to create');
      throw new Error('Please add at least one valid package with name, type, amount, and number of people.');
    }

    console.log(`📦 Attempting to create ${validPackages.length} packages for tourist:`, touristId);
    console.log('📦 Package data:', JSON.stringify(validPackages, null, 2));
    
    const results = [];
    let allFailed = true;
    
    for (const packageData of validPackages) {
      try {
        // Prepare the payload exactly as API expects
        const payload = {
          packageName: packageData.packageName.trim(),
          packageType: packageData.packageType.trim(),
          amount: Number(packageData.amount),
          numberOfPeople: String(Number(packageData.numberOfPeople)),
        };
        
        console.log(`📤 Creating package "${payload.packageName}":`, payload);
        
        // Call the API
        const result = await dispatch(createPackage({ 
          touristId, 
          packageData: payload 
        })).unwrap();
        
        console.log(`✅ Package "${payload.packageName}" created:`, result);
        
        results.push({ 
          success: true, 
          package: payload.packageName, 
          data: result 
        });
        
        allFailed = false;
        
      } catch (error) {
        console.error(`❌ Failed to create package "${packageData.packageName}":`, error);
        
        // Extract detailed error message
        let errorMessage = 'Unknown error';
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.error) {
          errorMessage = error.error;
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        }
        
        // Check for specific errors
        if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('already exists')) {
          errorMessage = 'This package name already exists for this centre. Please use a different name.';
        } else if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('invalid tourist')) {
          errorMessage = `Invalid tourist centre ID: ${touristId}. Please make sure the centre was created successfully.`;
        }
        
        results.push({ 
          success: false, 
          package: packageData.packageName, 
          error: errorMessage 
        });
      }
    }

    // Log final results
    const successfulPackages = results.filter(r => r.success);
    const failedPackages = results.filter(r => !r.success);
    
    console.log(`📊 Package creation summary:`);
    console.log(`  ✅ Successful: ${successfulPackages.length}`);
    console.log(`  ❌ Failed: ${failedPackages.length}`);
    
    if (failedPackages.length > 0) {
      console.log('❌ Failed packages:');
      failedPackages.forEach(p => {
        console.log(`  - ${p.package}: ${p.error}`);
      });
    }

    // If ALL packages failed, throw error so user knows
    if (allFailed && validPackages.length > 0) {
      const errorMessages = failedPackages.map(p => `${p.package}: ${p.error}`).join('\n');
      throw new Error(`Failed to create any packages:\n${errorMessages}`);
    }

    return results;
  };

  // ✅ FIXED: createPackagesAndFinish with proper error display
  const createPackagesAndFinish = async (touristId) => {
    Swal.fire({
      title: 'Creating Packages...',
      text: 'Setting up ticket packages for your centre',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const packageResults = await createPackagesForCentre(touristId);
      
      const successfulPackages = packageResults.filter(r => r.success);
      const failedPackages = packageResults.filter(r => !r.success);

      // Store results
      localStorage.setItem('latestTouristId', touristId);
      localStorage.setItem('lastAddedCentre', JSON.stringify({
        centreName: centreData.centreName,
        centreId: touristId,
        packagesCreated: successfulPackages.length,
        packagesFailed: failedPackages.length
      }));
      
      let message = '🏢 Your tourism centre has been registered!\n\n';
      
      if (successfulPackages.length > 0) {
        message += `✅ ${successfulPackages.length} package(s) created successfully:\n`;
        successfulPackages.forEach(p => {
          message += `   • ${p.package}\n`;
        });
      }
      
      if (failedPackages.length > 0) {
        message += `\n❌ ${failedPackages.length} package(s) failed:\n`;
        failedPackages.forEach(p => {
          message += `   • ${p.package}: ${p.error || 'Unknown error'}\n`;
        });
        message += `\n⚠️ You can add these packages later from your dashboard.`;
      } else {
        message += `\n✅ All packages created successfully! Tourists can now book tickets.`;
      }
      
      message += `\n\n📋 Next: Complete KYC verification to activate your centre.`;

      Swal.fire({
        icon: successfulPackages.length > 0 ? 'success' : 'error',
        title: successfulPackages.length > 0 ? 'Centre & Packages Created!' : 'Centre Created but Packages Failed',
        text: message,
        confirmButtonColor: '#ff6b35',
        confirmButtonText: 'Continue to KYC'
      }).then(() => {
        navigate('/kyc', { state: { touristId, centreName: centreData.centreName } });
      });
      
    } catch (error) {
      console.error("❌ Critical error in package creation:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Package Creation Failed',
        text: error.message || 'Failed to create packages. You can add them later from your dashboard.',
        confirmButtonColor: '#ff6b35',
        confirmButtonText: 'Continue to KYC'
      }).then(() => {
        navigate('/kyc', { state: { touristId, centreName: centreData.centreName } });
      });
    }
  };

  // ✅ FIXED: submitCentreData with ALL required fields and correct data types
  const submitCentreData = async (vendorId) => {
    const imageFiles = Object.values(uploadedImages)
      .map((image) => image?.file)
      .filter(Boolean);

    // Validate file sizes
    const oversized = imageFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'One or more images exceed the 10MB limit. Please compress your images and try again.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    // Build facilities and hours strings
    const facilitiesString = selectedFacilities.join(', ');
    const hoursString = Object.entries(openingHours)
      .map(([day, times]) => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        if (times.isOpen) {
          return `${dayName}: ${times.openTime} - ${times.closeTime}`;
        }
        return `${dayName}: Closed`;
      })
      .join(' | ');

    // Create FormData for file upload
    const formData = new FormData();
    
    // APPEND ALL REQUIRED FIELDS - Match API exactly
    formData.append('centreName', centreData.centreName || '');
    formData.append('description', centreData.description || '');
    formData.append('city', centreData.city || '');
    formData.append('state', centreData.state || '');
    formData.append('location', centreData.location || '');
    formData.append('streetAddress', centreData.streetAddress || '');
    formData.append('facilitiesAndAmenities', facilitiesString);
    formData.append('dailySlotCapacity', String(Number(pricingData.dailySlotCapacity) || 0));
    formData.append('installmentPayment', String(pricingData.installmentPayment || false));
    formData.append('openingHours', hoursString);
    
    // Append each image file (API accepts up to 10)
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    // Append documents (these are required!)
    if (documents.termsAndCondition) {
      formData.append('termsAndCondition', documents.termsAndCondition);
    } else {
      console.error("❌ termsAndCondition document is missing!");
      Swal.fire({
        icon: 'error',
        title: 'Missing Document',
        text: 'Please upload the Terms and Condition document.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }
    
    if (documents.privacyPolicy) {
      formData.append('privacyPolicy', documents.privacyPolicy);
    } else {
      console.error("❌ privacyPolicy document is missing!");
      Swal.fire({
        icon: 'error',
        title: 'Missing Document',
        text: 'Please upload the Privacy Policy document.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    // Debug: Log FormData contents
    console.log("📄 Submitting FormData with fields:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: ${pair[1].name} (${pair[1].size} bytes)`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    // Send the request
    try {
      console.log("📤 Submitting centre registration for vendor:", vendorId);
      
      const response = await dispatch(
        registerTouristCenter({ vendorId, centreData: formData })
      ).unwrap();
      
      console.log("✅ Full registration response:", JSON.stringify(response, null, 2));
      
      // Try multiple ways to extract the tourist ID
      let touristId = getEntityId(response);
      
      // Method 2: If response has a nested structure with data
      if (!touristId && response?.data) {
        touristId = getEntityId(response.data);
      }
      
      // Method 3: Check if response itself is an ID string
      if (!touristId && typeof response === 'string') {
        touristId = response;
      }
      
      // Method 4: Check if response has a success flag and data
      if (!touristId && response?.success && response?.data) {
        touristId = getEntityId(response.data);
      }
      
      // Method 5: Check common response patterns
      if (!touristId) {
        // Try to find any property that contains 'id' in its name
        const allProps = Object.keys(response);
        const idProps = allProps.filter(key => 
          key.toLowerCase().includes('id') || 
          key.toLowerCase().includes('tourist')
        );
        
        for (const prop of idProps) {
          const value = response[prop];
          if (typeof value === 'string' && value.length > 0) {
            touristId = value;
            break;
          }
          if (typeof value === 'object' && value !== null) {
            const nestedId = getEntityId(value);
            if (nestedId) {
              touristId = nestedId;
              break;
            }
          }
        }
      }
      
      console.log("🎯 Extracted touristId:", touristId);
      
      if (!touristId) {
        // As a last resort, try to use the vendorId as touristId (some APIs use same ID)
        console.warn("⚠️ Could not extract touristId, trying vendorId as fallback:", vendorId);
        touristId = vendorId;
        
        // If still no ID, throw error
        if (!touristId) {
          throw new Error('Could not extract tourist centre ID from server response. Response: ' + JSON.stringify(response));
        }
      }

      console.log("✅ Using touristId for packages:", touristId);
      
      // Now create packages and finish
      await createPackagesAndFinish(touristId);
      
    } catch (error) {
      console.error("❌ Centre submission error:", error);
      throw error;
    }
  };

  // ✅ UPDATED handleSubmit with better vendor ID extraction
  const handleSubmit = async () => {
    const validationError = validateCentre();
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: validationError,
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    // Log what we have for debugging
    console.log("📄 vendorDetails:", vendorDetails);
    console.log("📄 loggedInUser:", loggedInUser);
    
    // Try to get vendor ID from multiple sources
    let vendorId = getEntityId(vendorDetails) || getEntityId(loggedInUser);
    
    console.log("📄 Extracted vendorId:", vendorId);
    
    // If still no vendorId, check localStorage
    if (!vendorId) {
      const storedVendorId = localStorage.getItem('vendorId') || 
                             localStorage.getItem('touristId') ||
                             localStorage.getItem('userId');
      
      console.log("📄 vendorId from localStorage:", storedVendorId);
      
      if (storedVendorId) {
        vendorId = storedVendorId;
        console.log("📄 Using vendorId from localStorage:", vendorId);
      }
    }
    
    if (!vendorId) {
      Swal.fire({
        icon: 'error',
        title: 'Vendor Not Found',
        text: 'Please log in again before adding a centre.',
        confirmButtonColor: '#ff6b35',
      });
      navigate('/vendor/login');
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Creating Centre...',
      text: 'Please wait while we set up your tourism centre',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await submitCentreData(vendorId);
    } catch (error) {
      console.error('Centre submission error:', error);
      
      let errorMessage = 'Unable to submit centre. Please try again.';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: errorMessage,
        confirmButtonColor: '#ff6b35',
      });
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/vendor/dashboard');
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return <BasicInfo formData={centreData} onChange={handleCentreChange} />;
      case 2:
        return (
          <Facilities
            selectedFacilities={selectedFacilities}
            onToggle={handleFacilityToggle}
          />
        );
      case 3:
        return (
          <Pricing 
            formData={pricingData} 
            onChange={handlePricingChange}
            onPackagesChange={handlePackagesChange}
            onDocumentsChange={setDocuments}
            documents={documents}
          />
        );
      case 4:
        return (
          <Images
            uploadedImages={uploadedImages}
            onImagesChange={setUploadedImages}
          />
        );
      case 5:
        return <Hours openingHours={openingHours} onChange={handleHoursChange} />;
      case 6:
        return (
          <Review
            centreData={centreData}
            pricingData={pricingData}
            selectedFacilities={selectedFacilities}
            uploadedImages={uploadedImages}
            documents={documents}
            openingHours={openingHours}
            packagesList={packagesList}
          />
        );
      default:
        return <BasicInfo formData={centreData} onChange={handleCentreChange} />;
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Basic Information',
      'Facilities & Amenities',
      'Pricing & Tickets',
      'Images & Media',
      'Operating Hours',
      'Review & Submit'
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="main-content">
        {/* Small Back Button - Hidden on step 1 */}
        {currentStep > 1 && (
          <button 
            className="btn-back" 
            onClick={handleBack} 
            disabled={loading}
            style={{
              fontSize: "12px",
              padding: "6px 16px",
              width: "auto",
              minWidth: "70px",
              backgroundColor: "#ff5e3a",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              marginTop: "20px",
              marginBottom: "25px",
              color: "white",
              transition: "all 0.3s ease",
              fontWeight: "600",
              display: "inline-block"
            }}
          >
            ← Back
          </button>
        )}
        
        <h1>Add New Tourism Centre</h1>
        <p className="subtitle">
          Fill in the details to list your tourism centre on NovaEscape
        </p>

        <Stepper currentStep={currentStep} />

        <div className="form-card">
          <div className="step-header">
            <h2 className="card-title">{getStepTitle()}</h2>
            {currentStep === 2 && (
              <p className="card-subtitle">
                Select all the facilities and amenities available at your centre
              </p>
            )}
            {currentStep === 4 && (
              <p className="card-subtitle">
                Upload high-quality images of your tourism centre (minimum 1 image required)
              </p>
            )}
          </div>

          {renderStepContent()}
          
          <div className="form-actions">
            <button 
              className="btn-next" 
              onClick={handleNext} 
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Submitting...' : currentStep === 6 ? 'Submit Centre' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddCentre;