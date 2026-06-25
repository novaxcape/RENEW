// File: src/pages/ReviewPage.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';

const ReviewPage = () => {
  const { touristCentreId } = useParams(); // Get ID from URL params
  
  return (
    <div>
      {/* Pass touristCentreId as a prop to Reviews component */}
      <Reviews touristCentreId={touristCentreId} />
      <Footer />
    </div>
  );
};

export default ReviewPage;