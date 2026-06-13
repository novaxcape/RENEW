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

    const results = await Promise.allSettled(
      packages.map((packageData) =>
        dispatch(createPackage({ touristId, packageData })).unwrap()
      )
    );

    const successfulPackages = results.filter(r => r.status === 'fulfilled');
    const failedPackages = results.filter(r => r.status === 'rejected');

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

    // Convert facilities array to comma-separated string
    const facilitiesString = selectedFacilities.join(', ');

    // Convert opening hours object to readable string format
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

    try {
      const response = await dispatch(
        registerTouristCenter({ vendorId, centreData: payload })
      ).unwrap();
      
      const touristId = getEntityId(response);
      
      if (!touristId) {
        throw new Error('No tourist centre ID returned from server');
      }

      localStorage.setItem('latestTouristId', touristId);
      localStorage.setItem('lastAddedCentre', JSON.stringify({
        centreName: centreData.centreName,
        centreId: touristId
      }));
      
      await createPackagesForCentre(touristId);

      Swal.fire({
        icon: 'success',
        title: 'Centre Submitted Successfully!',
        text: 'Your tourism centre has been submitted. Please complete KYC verification to activate your centre.',
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

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      return;
    }
    handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
        <button className="btn-back" onClick={handleBack} disabled={loading}>
          Back
        </button>
        
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