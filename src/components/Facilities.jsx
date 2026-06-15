import { IconWifi, IconCar, IconImage, IconUtensils, IconTree, IconWater, IconMountain, IconCompass, IconCamera } from './Icon.jsx';

const facilityOptions = [
  { label: 'Free WiFi', icon: <IconWifi /> },
  { label: 'Parking', icon: <IconCar /> },
  { label: 'Restaurant', icon: <IconUtensils /> },
  { label: 'Photography Allowed', icon: <IconCamera /> },
  { label: 'Nature Trails', icon: <IconTree /> },
  { label: 'Water Activities', icon: <IconWater /> },
  { label: 'Hiking', icon: <IconMountain /> },
  { label: 'Guided Tours', icon: <IconCompass /> },
];

const Facilities = ({ selectedFacilities, onToggle }) => {
  return (
    <div className="step-content">
      <div className="facilities-grid">
        {facilityOptions.map((facility) => {
          const isSelected = selectedFacilities.includes(facility.label);

          return (
            <button
              key={facility.label}
              type="button"
              className={`facility-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggle(facility.label)}
              aria-pressed={isSelected}
            >
              {facility.icon}
              <span>{facility.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Facilities;