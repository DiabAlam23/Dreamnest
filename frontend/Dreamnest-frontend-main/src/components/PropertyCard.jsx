import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

const getPropertyImage = (property) => {
  const value = Array.isArray(property?.images) ? property.images[0] : property?.image;
  if (value && typeof value === 'object') {
    return value.url || value.src || value.imageUrl || null;
  }
  if (typeof value === 'string' && value.trim()) {
    if (/^https?:\/\//i.test(value)) return value;
    return `${API_ORIGIN}/${value.replace(/^\/+/, '')}`;
  }
  const type = String(property?.propertyType || '').toLowerCase();
  const fallbacks = {
    apartment: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000',
    house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000',
    condo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000',
    studio: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000'
  };
  return fallbacks[type] || 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=1000';
};

export default function PropertyCard({ 
  property, 
  viewStyle = 'grid', 
  onViewDetails 
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    } else {
      navigate(`/properties/${property.id}`);
    }
  };
  // Star rating component
  const StarRating = ({ rating, totalReviews, clickable = false, onClick }) => {
    if (!Number(rating)) return null; // Don't show rating if not available
    
    const stars = [];
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <svg className="absolute w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const content = (
      <div className="flex items-center gap-1 mt-2">
        <div className="flex items-center gap-0.5">
          {stars}
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
          {safeRating.toFixed(1)} ({totalReviews || 0})
        </span>
      </div>
    );

    if (clickable && onClick) {
      return (
        <button 
          onClick={onClick}
          className="transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1 -m-1"
          title="View all reviews"
        >
          {content}
        </button>
      );
    }

    return content;
  };

  return (
    <div
      className={`group bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl ${
        viewStyle === 'list' ? 'flex flex-col sm:flex-row' : ''
      }`}
    >
      {/* Property Image */}
      <div className={`relative overflow-hidden ${
        viewStyle === 'grid' 
          ? 'h-48' 
          : 'h-48 sm:h-40 sm:w-64 flex-shrink-0'
      }`}>
        <img
          src={getPropertyImage(property)}
          alt={property.title || 'Property'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white font-semibold px-3 py-1 rounded-lg">
          ৳{property.monthlyRent ? property.monthlyRent.toLocaleString() : 'N/A'}/mo
        </div>
      </div>

      {/* Property Details */}
      <div className={`${viewStyle === 'grid' ? 'p-5' : 'p-5 flex-1 flex flex-col justify-between'}`}>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {property.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>

          {/* Property Stats */}
          <div className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${
            viewStyle === 'list' ? 'flex items-center gap-6' : 'flex items-center justify-between'
          }`}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
                {property.bedrooms} bed
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14V9a2 2 0 012-2h4a2 2 0 012 2v5M8 14H6a2 2 0 00-2 2v3a2 2 0 002 2h2m8-7h2a2 2 0 012 2v3a2 2 0 01-2 2h-2" />
                </svg>
                {property.bathrooms} bath
              </span>
            </div>
            <span>{property.sqft} sqft</span>
          </div>

          {/* Star Rating */}
          <StarRating 
            rating={property.rating} 
            totalReviews={property.totalReviews} 
            clickable={true}
            onClick={() => navigate(`/properties/${property.id}/reviews`)}
          />
        </div>

        {/* Action Button */}
        <Button
          size="sm"
          className={`group/btn relative overflow-hidden mt-4 ${viewStyle === 'list' ? 'self-start' : 'w-full'}`}
          onClick={handleViewDetails}
        >
          <span className="relative z-10">
            View Details
          </span>
          <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gradient-to-r from-primary-600 to-accent-500" />
        </Button>
      </div>
    </div>
  );
}