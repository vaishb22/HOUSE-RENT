import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { propertyService, bookingService } from "../services/services";
import "../styles/PropertyDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Review States
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: "",
    comment: "",
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Fetch Property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertyService.getPropertyById(id);
        // Backend returns { success: true, property }
        const propertyData = res.data.property;
        setProperty(propertyData);
        // Set reviews from the property data
        if (propertyData.reviews) {
          setReviews(propertyData.reviews);
        }
      } catch (err) {
        setError("Failed to load property details");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Booking Function
  const handleBooking = async () => {
    if (!user) {
      alert("Please login to book this property");
      navigate("/login");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      await bookingService.createBooking({
        propertyId: property._id,
        checkInDate,
        checkOutDate,
      });

      alert("Booking request sent successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  // Review Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to add a review");
      navigate("/login");
      return;
    }

    if (!newReview.rating || !newReview.comment) {
      alert("Please fill all review fields");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");

      const reviewData = {
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
      };

      // Send review to backend
      const res = await propertyService.addReview(id, reviewData);

      // Update reviews with the new review from backend
      // Backend returns { success: true, property }
      if (res.data.property && res.data.property.reviews) {
        setReviews(res.data.property.reviews);
      } else {
        // Fallback: add to local state if backend doesn't return updated reviews
        setReviews([
          ...reviews,
          {
            user: { name: user.name || "User" },
            rating: reviewData.rating,
            comment: reviewData.comment,
            createdAt: new Date(),
          },
        ]);
      }

      setNewReview({ rating: "", comment: "" });
      alert("Review submitted successfully!");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
      console.error("Error submitting review:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  // Get user-friendly property type label
  const getPropertyTypeLabel = (type) => {
    const typeMap = {
      'apartment': 'Residential',
      'house': 'Residential',
      'studio': 'Residential',
      'condo': 'Residential',
      'townhouse': 'Residential',
      'residential': 'Residential',
      'commercial': 'Commercial',
      'land': 'Land/Plot',
      'plot': 'Land/Plot',
      'new': 'New',
    };
    return typeMap[type?.toLowerCase()] || type || 'Residential';
  };

  // Get user-friendly ad type label
  const getAdTypeLabel = (adType) => {
    const adTypeMap = {
      'rent': 'Rent',
      'resale': 'Resale',
      'pg': 'PG/Hostel',
      'hostel': 'PG/Hostel',
      'flatmates': 'Flatmates',
    };
    return adTypeMap[adType?.toLowerCase()] || adType || 'Rent';
  };

  // Helper function to render star rating
  const renderStarRating = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="property-detail-container">
        <div className="container">
          <div className="loading-container">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="property-detail-container">
        <div className="container">
          <div className="error-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="property-detail-container">
        <div className="container">
          <div className="error-container">
            <div className="error-message">Property not found</div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="property-detail-container">
      <div className="container">
        <div className="property-detail-wrapper">
          {/* ================= IMAGE SECTION ================= */}
          <div className="property-image-container">
            {property.images && property.images.length > 0 && property.images[0]?.startsWith('http') ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="property-main-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="image-placeholder" style={{ display: property.images?.length > 0 && property.images[0]?.startsWith('http') ? 'none' : 'flex' }}>
              🏠 {property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'Property'} in {property.city || 'India'}
            </div>
          </div>

          {/* ================= HEADER ================= */}
          <div className="property-header">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <span
                  className={`status-badge ${
                    property.isAvailable
                      ? "status-available"
                      : "status-unavailable"
                  }`}
                >
                  {property.isAvailable ? "Available" : "Not Available"}
                </span>
                <h1 className="property-title">{property.title}</h1>
                <div className="property-location">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {/* Show address without duplication - address already includes city */}
                  {property.address || property.city || 'Address not provided'}
                  {property.zipCode && !property.address?.includes(property.zipCode) ? `, ${property.zipCode}` : ''}
                </div>
              </div>
              {property.rating > 0 && (
                <div className="rating-display text-end">
                  <div>
                    <span className="rating-stars">
                      {renderStarRating(Math.round(property.rating))}
                    </span>
                    <span className="rating-value">({property.rating}/5)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="property-content">
            {/* LEFT SIDE - INFO */}
            <div className="property-details-card">
              <div className="property-price">
                ₹{" "}
                {property.price
                  ? property.price.toLocaleString()
                  : "N/A"}{" "}
                <span>/ month</span>
              </div>

              <p className="property-description">{property.description}</p>

              {/* Features Grid */}
              <div className="property-features-grid">
                <div className="property-feature-item">
                  <div className="property-feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div className="property-feature-info">
                    <h6>Property Type</h6>
                    <p>{property.propertyCategory || getPropertyTypeLabel(property.type)}</p>
                  </div>
                </div>

                <div className="property-feature-item">
                  <div className="property-feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                  </div>
                  <div className="property-feature-info">
                    <h6>Ad Type</h6>
                    <p>{property.adType || 'Rent'}</p>
                  </div>
                </div>

                <div className="property-feature-item">
                  <div className="property-feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"></path>
                      <path d="M21 10H3"></path>
                      <path d="M18 3H6a2 2 0 0 0-2 2v2h16V5a2 2 0 0 0-2-2z"></path>
                    </svg>
                  </div>
                  <div className="property-feature-info">
                    <h6>Bedrooms</h6>
                    <p>{property.bedrooms ?? "N/A"}</p>
                  </div>
                </div>

                <div className="property-feature-item">
                  <div className="property-feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                      <line x1="10" x2="8" y1="5" y2="7"></line>
                      <line x1="2" x2="22" y1="12" y2="12"></line>
                      <line x1="7" x2="7" y1="19" y2="21"></line>
                      <line x1="17" x2="17" y1="19" y2="21"></line>
                    </svg>
                  </div>
                  <div className="property-feature-info">
                    <h6>Bathrooms</h6>
                    <p>{property.bathrooms ?? "N/A"}</p>
                  </div>
                </div>

                <div className="property-feature-item">
                  <div className="property-feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                      <line x1="9" x2="15" y1="22" y2="22"></line>
                      <line x1="12" x2="12" y1="2" y2="22"></line>
                    </svg>
                  </div>
                  <div className="property-feature-info">
                    <h6>Square Feet</h6>
                    <p>{property.squareFeet ? property.squareFeet.toLocaleString() : "N/A"}</p>
                  </div>
                </div>

                <div className="property-feature-item">
                  <div className="property-feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div className="property-feature-info">
                    <h6>Pet Friendly</h6>
                    <p>{property.petFriendly ? "Yes ✓" : "No"}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="amenities-section">
                  <h5 className="amenities-title">Amenities</h5>
                  <div className="amenities-list">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Info */}
              {property.owner && (
                <div className="owner-info">
                  <div className="owner-avatar">
                    {getInitials(property.owner.name)}
                  </div>
                  <div className="owner-details">
                    <h6>Property Owner</h6>
                    <p>{property.owner.name || "Unknown"}</p>
                    <p>{property.owner.email || ""}</p>
                  </div>
                </div>
              )}

              {/* BOOKING SECTION - Below property info */}
              <div className="booking-section">
                <div className="booking-card">
                  <h4>Book This Property</h4>
                  <div className="booking-form">
                    <div className="mb-3">
                      <label>Check-In Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Check-Out Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <button
                      className="booking-btn"
                      onClick={handleBooking}
                      disabled={!property.isAvailable}
                    >
                      {property.isAvailable ? "Book Now" : "Not Available"}
                    </button>

                    {!property.isAvailable && (
                      <p className="mt-3 text-center" style={{ opacity: 0.8 }}>
                        This property is currently not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= REVIEWS SECTION ================= */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2 className="reviews-title">
                Customer Reviews
              </h2>
              <span className="reviews-count">{reviews.length} Reviews</span>
            </div>

            {reviews.length === 0 ? (
              <div className="empty-reviews">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {getInitials(review.user?.name || review.name)}
                        </div>
                        <div>
                          <div className="reviewer-name">
                            {review.user?.name || review.name || "Anonymous"}
                          </div>
                          <div className="review-date">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStarRating(review.rating)}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Review */}
            <div className="add-review-card">
              <h4 className="add-review-title">Add Your Review</h4>

              {reviewError && (
                <div className="alert alert-danger">{reviewError}</div>
              )}

              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label>Rating (1-5)</label>
                  <select
                    className="form-control"
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({ ...newReview, rating: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Rating</option>
                    <option value="1">1 - Poor ⭐</option>
                    <option value="2">2 - Fair ⭐⭐</option>
                    <option value="3">3 - Good ⭐⭐⭐</option>
                    <option value="4">4 - Very Good ⭐⭐⭐⭐</option>
                    <option value="5">5 - Excellent ⭐⭐⭐⭐⭐</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Comment</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Share your experience with this property..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

