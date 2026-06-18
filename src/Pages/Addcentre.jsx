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

// ✅ ENHANCED getEntityId function - handles all response formats
const getEntityId = (value, depth = 0) => {
  if (!value || depth > 5) return null;

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  if (typeof value === 'object') {
    const paths = [
      'data.touristId',
      'data.id', 
      'data._id',
      'data.data.id',
      'data.data._id',
      'data.data.touristId',
      'data.data.vendorId',
      'data.vendorId',
      'data.userId',
      'data.centreId',
      'data.centre._id',
      'data.centre.id',
      'data.centre.touristId',
      'data.result._id',
      'data.result.id',
      'data.result.touristId',
      'touristId',
      'vendorId',
      'id',
      '_id',
      'userId',
      'centreId',
      'centre._id',
      'centre.id',
      'centre.touristId',
      'result._id',
      'result.id',
      'result.touristId'
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
        console.log(`✅ Found ID at path "${path}":`, current);
        return current;
      }
    }

    if (value.data && typeof value.data === 'object') {
      for (const key of Object.keys(value.data)) {
        if (key.toLowerCase().includes('id') || key.toLowerCase().includes('tourist')) {
          const val = value.data[key];
          if (typeof val === 'string' && val.length > 0) {
            console.log(`✅ Found ID in data.${key}:`, val);
            return val;
          }
        }
      }
    }

    for (const key of Object.keys(value)) {
      const val = value[key];
      if (typeof val === 'string' && val.length > 0 && 
          (key.toLowerCase().includes('id') || 
           key.toLowerCase().includes('tourist') ||
           key.toLowerCase().includes('vendor') ||
           key.toLowerCase().includes('user') ||
           key.toLowerCase().includes('centre'))) {
        console.log(`✅ Found ID at key "${key}":`, val);
        return val;
      }
      if (typeof val === 'object' && val !== null) {
        const nestedId = getEntityId(val, depth + 1);
        if (nestedId) return nestedId;
      }
    }
  }

  console.warn("⚠️ Could not extract ID from:", value);
  return null;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    console.log("📦 Packages updated in AddCentre:", packages);
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

  // ✅ FIXED: Validate current step with proper package validation
  const validateCurrentStep = () => {
    switch(currentStep) {
      case 1:
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
        
      case 2:
        if (selectedFacilities.length === 0) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please select at least one facility.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        return true;
        
      case 3:
        if (!pricingData.dailySlotCapacity) {
          Swal.fire({ 
            icon: 'error', 
            title: 'Missing Information', 
            text: 'Please enter daily slot capacity.', 
            confirmButtonColor: '#ff6b35' 
          });
          return false;
        }
        
        // ✅ Filter valid packages
        const validPackages = packagesList.filter(pkg => 
          pkg.packageName?.trim() && 
          pkg.packageType?.trim() && 
          pkg.amount && 
          Number(pkg.amount) > 0 &&
          pkg.numberOfPeople && 
          Number(pkg.numberOfPeople) > 0
        );
        
        console.log("📦 Valid packages in validation:", validPackages);
        console.log("📦 All packages:", packagesList);
        
        if (validPackages.length === 0) {
          Swal.fire({ 
            icon: 'error', 
            title: 'Missing Package Information', 
            text: 'Please add at least one valid package with name, type, amount, and number of people.\n\nMake sure all fields are filled correctly.',
            confirmButtonColor: '#ff6b35' 
          });
          return false;
        }
        
        if (!documents.termsAndCondition || !documents.privacyPolicy) {
          Swal.fire({ 
            icon: 'error', 
            title: 'Missing Documents', 
            text: 'Please upload terms and privacy policy documents.', 
            confirmButtonColor: '#ff6b35' 
          });
          return false;
        }
        return true;
        
      case 4:
        const imageFiles = Object.values(uploadedImages).filter((image) => image?.file);
        if (imageFiles.length < 1) {
          Swal.fire({ icon: 'error', title: 'Missing Images', text: 'Please upload at least 1 centre image.', confirmButtonColor: '#ff6b35' });
          return false;
        }
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
        
      case 5:
        return true;
        
      default:
        return true;
    }
  };

  // ✅ FIXED: validateCentre with proper package validation
  const validateCentre = () => {
    const imageFiles = Object.values(uploadedImages).filter((image) => image?.file);
    
    // ✅ Filter valid packages
    const validPackages = packagesList.filter(pkg => 
      pkg.packageName?.trim() && 
      pkg.packageType?.trim() && 
      pkg.amount && 
      Number(pkg.amount) > 0 &&
      pkg.numberOfPeople && 
      Number(pkg.numberOfPeople) > 0
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
      return 'Please add at least one valid package with name, type, amount, and number of people.';
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

  // ✅ FIXED: createPackagesForCentre with better error handling
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
        const payload = {
          packageName: packageData.packageName.trim(),
          packageType: packageData.packageType.trim(),
          amount: Number(packageData.amount),
          numberOfPeople: String(Number(packageData.numberOfPeople)),
        };
        
        console.log(`📤 Creating package "${payload.packageName}" for touristId:`, touristId);
        console.log(`📤 Payload:`, payload);
        
        const result = await dispatch(createPackage({ 
          touristId: touristId.trim(), 
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

    if (allFailed && validPackages.length > 0) {
      const errorMessages = failedPackages.map(p => `${p.package}: ${p.error}`).join('\n');
      throw new Error(`Failed to create any packages:\n${errorMessages}`);
    }

    return results;
  };

  // ✅ FIXED: createPackagesAndFinish with proper error display
  const createPackagesAndFinish = async (touristId) => {
    console.log("📦 Creating packages for touristId:", touristId);
    console.log("📦 touristId type:", typeof touristId);
    
    if (!touristId || typeof touristId !== 'string' || touristId.trim().length === 0) {
      console.error("❌ Invalid touristId:", touristId);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Centre ID',
        text: 'The centre was created but we received an invalid ID. Please try again.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }
    
    const cleanTouristId = touristId.trim();
    console.log("✅ Using clean touristId:", cleanTouristId);
    
    Swal.fire({
      title: 'Creating Packages...',
      text: 'Setting up ticket packages for your centre',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const packageResults = await createPackagesForCentre(cleanTouristId);
      
      const successfulPackages = packageResults.filter(r => r.success);
      const failedPackages = packageResults.filter(r => !r.success);

      localStorage.setItem('latestTouristId', cleanTouristId);
      localStorage.setItem('lastAddedCentre', JSON.stringify({
        centreName: centreData.centreName,
        centreId: cleanTouristId,
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
        navigate('/kyc', { state: { touristId: cleanTouristId, centreName: centreData.centreName } });
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
        navigate('/kyc', { state: { touristId: cleanTouristId, centreName: centreData.centreName } });
      });
    }
  };

  // ✅ FIXED: submitCentreData with ALL required fields
  const submitCentreData = async (vendorId) => {
    const imageFiles = Object.values(uploadedImages)
      .map((image) => image?.file)
      .filter(Boolean);

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

    const formData = new FormData();
    
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
    
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

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

    console.log("📄 Submitting FormData with fields:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: ${pair[1].name} (${pair[1].size} bytes)`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    try {
      console.log("📤 Submitting centre registration for vendor:", vendorId);
      
      const response = await dispatch(
        registerTouristCenter({ vendorId, centreData: formData })
      ).unwrap();
      
      console.log("📦 FULL REGISTRATION RESPONSE:", JSON.stringify(response, null, 2));
      
      let touristId = getEntityId(response);
      
      if (!touristId && response?.data) {
        console.log("🔍 Checking response.data:", response.data);
        touristId = getEntityId(response.data);
      }
      
      if (!touristId && response?.success && response?.data) {
        console.log("🔍 Checking response.success.data:", response.success.data);
        touristId = getEntityId(response.success.data);
      }
      
      if (!touristId && response?.result) {
        console.log("🔍 Checking response.result:", response.result);
        touristId = getEntityId(response.result);
      }
      
      if (!touristId && typeof response === 'string') {
        touristId = response;
      }
      
      console.log("🎯 Extracted touristId:", touristId);
      
      if (!touristId) {
        console.error("❌ Could not extract touristId from response:", response);
        localStorage.setItem('debug_centre_response', JSON.stringify(response));
        
        Swal.fire({
          icon: 'error',
          title: 'Server Response Issue',
          text: 'Could not extract centre ID from server response. Please check console for details.',
          confirmButtonColor: '#ff6b35',
        });
        
        throw new Error('Could not extract tourist centre ID from server response');
      }

      console.log("✅ Using touristId for packages:", touristId);
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

    console.log("📄 vendorDetails:", vendorDetails);
    console.log("📄 loggedInUser:", loggedInUser);
    
    let vendorId = getEntityId(vendorDetails) || getEntityId(loggedInUser);
    
    console.log("📄 Extracted vendorId:", vendorId);
    
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

  // ✅ FIXED: renderStepContent with packagesList passed to Review
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