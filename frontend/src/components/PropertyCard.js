import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaStar } from 'react-icons/fa';
import '../styles/PropertyCard.css';

// Simple reliable placeholder images
const FALLBACK_IMAGES = [
  'https://placehold.co/600x400/2c3e50/white?text=House',
  'https://placehold.co/600x400/3498db/white?text=Apartment',
  'https://placehold.co/600x400/e74c3c/white?text=Villa',
  'https://placehold.co/600x400/9b59b6/white?text=Property',
  'https://placehold.co/600x400/27ae60/white?text=Home',
];

const PropertyCard = ({ property }) => {
  // Get image - try database images first, otherwise use fallback
  const getImageUrl = () => {
    // Check if property has images array with valid URLs
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      const img = property.images[0];
      if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
        return img;
      }
    }
    // Use fallback based on property _id for variety
    const typeIndex = property._id ? property._id.charCodeAt(0) % FALLBACK_IMAGES.length : 0;
    return FALLBACK_IMAGES[typeIndex];
  };

  const imageUrl = getImageUrl();

  return (
    <Link to={`/property/${property._id}`} className='property-card-link'>
      <Card className='property-card h-100'>
        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          <img
            src={imageUrl}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className='property-badge'>
          {property.isApproved ? (
            <span className='badge bg-success'>Available</span>
          ) : (
            <span className='badge bg-warning'>Pending</span>
          )}
        </div>

        <Card.Body>
          <Card.Title className='property-title'>{property.title}</Card.Title>

          <p className='property-location text-muted small'>
            {property.address || 'Address not provided'}, {property.city || ''}
          </p>

          <div className='property-features'>
            <span className='feature'>
              <FaBed /> {property.bedrooms ?? 0}
            </span>
            <span className='feature'>
              <FaBath /> {property.bathrooms ?? 0}
            </span>
            <span className='feature'>
              <FaRulerCombined /> {property.squareFeet?.toLocaleString() || 0}
            </span>
          </div>

          {property.rating > 0 && (
            <div className='property-rating mt-2'>
              <FaStar className='text-warning' /> {property.rating}/5
            </div>
          )}

          <div className='property-price mt-3'>
            <h5 className='text-primary'>₹{Number(property.price || 0).toLocaleString()}/mo</h5>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className='property-amenities mt-2'>
              {property.amenities.slice(0, 2).map((amenity, index) => (
                <small key={index} className='amenity-tag'>
                  {amenity}
                </small>
              ))}
              {property.amenities.length > 2 && (
                <small className='amenity-tag'>+{property.amenities.length - 2} more</small>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default PropertyCard;
