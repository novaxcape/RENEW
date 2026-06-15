import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
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

const getEntityId = (value) =>
  value?.id ||
  value?._id ||
  value?.vendorId ||
  value?.touristId ||
  value?.data?.id ||
  value?.data?._id ||
  value?.data?.touristId ||
  value?.tourist?.id ||
  value?.tourist?._id ||
  value?.touristCenter?.id ||
  value?.touristCenter?._id;

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
    adultPrice: '',
    childPrice: '',
    familyPackage: '',
    dailySlotCapacity: '',
    installmentPayment: false,
  });
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

  // ✅ NEW: Validate current step before proceeding
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
        if (!pricingData.adultPrice && !pricingData.childPrice && !pricingData.familyPackage) {
          Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please add at least one pricing option.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        return true;
        
      case 4: // Images
        const imageFiles = Object.values(uploadedImages).filter((image) => image?.file);
        if (imageFiles.length < 3) {
          Swal.fire({ icon: 'error', title: 'Missing Images', text: 'Please upload at least 3 centre images.', confirmButtonColor: '#ff6b35' });
          return false;
        }
        if (!documents.termsAndCondition || !documents.privacyPolicy) {
          Swal.fire({ icon: 'error', title: 'Missing Documents', text: 'Please upload terms and privacy policy documents.', confirmButtonColor: '#ff6b35' });
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

    if (!pricingData.adultPrice && !pricingData.childPrice && !pricingData.familyPackage) {
      return 'Please add at least one pricing option (Adult, Child, or Family package).';
    }

    if (imageFiles.length < 3) {
      return 'Please upload at least 3 centre images.';
    }

    if (!documents.termsAndCondition || !documents.privacyPolicy) {
      return 'Please upload the terms and privacy policy documents.';
    }

    return '';
  };

  // ✅ FIXED: Proper package creation function
  const createPackagesForCentre = async (touristId) => {
    const packages = [
      {
        packageName: 'Adult Ticket',
        packageType: 'Adult',
        amount: Number(pricingData.adultPrice),
        numberOfPeople: '1',
      },
      {
        packageName: 'Child Ticket',
        packageType: 'Child',
        amount: Number(pricingData.childPrice),
        numberOfPeople: '1',
      },
      {
        packageName: 'Family Package',
        packageType: 'Family',
        amount: Number(pricingData.familyPackage),
        numberOfPeople: '5',
      },
    ].filter((item) => item.amount > 0);

    if (packages.length === 0) {
      console.warn('No packages to create (all amounts were 0)');
      return [];
    }

    const results = [];
    
    for (const packageData of packages) {
      try {
        const result = await dispatch(createPackage({ touristId, packageData })).unwrap();
        results.push({ 
          success: true, 
          package: packageData.packageName, 
          data: result 
        });
        console.log(`✅ Created ${packageData.packageName} package`);
      } catch (error) {
        console.error(`❌ Failed to create ${packageData.packageName}:`, error);
        results.push({ 
          success: false, 
          package: packageData.packageName, 
          error: error.message || error 
        });
      }
    }

    const successfulPackages = results.filter(r => r.success);
    const failedPackages = results.filter(r => !r.success);

    if (failedPackages.length > 0) {
      console.warn(`${failedPackages.length} package(s) failed to create`);
    }

    if (successfulPackages.length === 0 && packages.length > 0) {
      throw new Error('Failed to create any packages for this centre');
    }

    return results;
  };

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

    const vendorId = getEntityId(vendorDetails) || getEntityId(loggedInUser);
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

    const imageFiles = Object.values(uploadedImages)
      .map((image) => image?.file)
      .filter(Boolean);

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

    const payload = {
      ...centreData,
      facilitiesAndAmenities: facilitiesString,
      dailySlotCapacity: Number(pricingData.dailySlotCapacity),
      installmentPayment: pricingData.installmentPayment,
      openingHours: hoursString,
      images: imageFiles,
      termsAndCondition: documents.termsAndCondition,
      privacyPolicy: documents.privacyPolicy,
    };

    Swal.fire({
      title: 'Creating Centre...',
      text: 'Please wait while we set up your tourism centre',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await dispatch(
        registerTouristCenter({ vendorId, centreData: payload })
      ).unwrap();
      
      const touristId = getEntityId(response);
      
      if (!touristId) {
        throw new Error('No tourist centre ID returned from server');
      }

      Swal.fire({
        title: 'Creating Packages...',
        text: 'Setting up ticket packages for your centre',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const packageResults = await createPackagesForCentre(touristId);
      
      const successfulPackages = packageResults.filter(r => r.success);
      const failedPackages = packageResults.filter(r => !r.success);

      localStorage.setItem('latestTouristId', touristId);
      localStorage.setItem('lastAddedCentre', JSON.stringify({
        centreName: centreData.centreName,
        centreId: touristId,
        packagesCreated: successfulPackages.length,
        packagesFailed: failedPackages.length
      }));
      
      let successMessage = 'Your tourism centre has been submitted successfully!';
      if (successfulPackages.length > 0) {
        successMessage += `\n✅ ${successfulPackages.length} package(s) created.`;
      }
      if (failedPackages.length > 0) {
        successMessage += `\n⚠️ ${failedPackages.length} package(s) failed. You can add them later.`;
      }
      successMessage += '\n\nPlease complete KYC verification to activate your centre.';

      Swal.fire({
        icon: successfulPackages.length > 0 ? 'success' : 'warning',
        title: successfulPackages.length > 0 ? 'Centre Created!' : 'Partial Success',
        text: successMessage,
        confirmButtonColor: '#ff6b35',
      }).then(() => {
        navigate('/kyc', { state: { touristId, centreName: centreData.centreName } });
      });
      
    } catch (error) {
      console.error('Centre submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: typeof error === 'string' ? error : error?.message || 'Unable to submit centre. Please try again.',
        confirmButtonColor: '#ff6b35',
      });
    }
  };

  // ✅ UPDATED: Validate current step before moving to next
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
        return <Pricing formData={pricingData} onChange={handlePricingChange} />;
      case 4:
        return (
          <Images
            uploadedImages={uploadedImages}
            documents={documents}
            onImagesChange={setUploadedImages}
            onDocumentsChange={setDocuments}
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
        {/* ✅ SMALL BACK BUTTON - Hidden on step 1, with orange color and margin-top */}
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
                Upload high-quality images of your tourism centre (minimum 3 images recommended)
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

      <Footer2 />
    </div>
  );
};

export default AddCentre;