import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

// API call helper
const apiCall = async (endpoint, options = {}) => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const url = `${baseURL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('dreamnest-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default function PropertyReviewsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    recommend: true
  });

  // Fetch property and reviews data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch property details and reviews in parallel
      const [propertyResponse, reviewsResponse] = await Promise.all([
        apiCall(`/properties/${id}`),
        apiCall(`/properties/${id}/reviews`)
      ]);

      if (propertyResponse.status === 'success') {
        // Transform property data for display
        const propertyData = propertyResponse.data.property;
        setProperty({
          id: propertyData.id,
          title: propertyData.title,
          image: propertyData.images && propertyData.images.length > 0 
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${propertyData.images[0]}` 
            : '/images/properties/default.jpg',
          type: propertyData.propertyType,
          location: `${propertyData.city}, ${propertyData.state}`,
          price: propertyData.monthlyRent || 0,
          overallRating: propertyData.averageRating || 0,
          totalReviews: propertyData.reviewCount || 0
        });
      }

      if (reviewsResponse.status === 'success') {
        // Transform reviews data
        const transformedReviews = reviewsResponse.data.reviews.map(review => ({
          id: review.id,
          author: `${review.author.firstName} ${review.author.lastName}`,
          authorInitials: `${review.author.firstName[0]}${review.author.lastName[0]}`,
          rating: review.rating,
          title: review.title || 'Review',
          content: review.content,
          date: new Date(review.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          verified: true, // Assume verified for now
          helpful: 0, // API doesn't provide helpful count
          aspects: {}, // API doesn't provide aspects breakdown
          stayDuration: 'Unknown', // API doesn't provide stay duration
          recommend: review.recommend !== false, // Default to true if not specified
          photos: review.photos || []
        }));

        setReviews(transformedReviews);
        setReviewSummary(reviewsResponse.data.summary);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching property reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    setShowReviewForm(false);
    setReviewForm({ rating: 0, title: '', content: '', recommend: true });
  };

  const handleRatingClick = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const StarRating = ({ rating, size = 'sm', interactive = false, onRatingClick }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starSize = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= fullStars || (i === fullStars + 1 && hasHalfStar);
      const isHalf = i === fullStars + 1 && hasHalfStar;

      stars.push(
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onRatingClick(i) : undefined}
          className={`${interactive ? 'hover:scale-110 cursor-pointer' : ''} transition-transform`}
          disabled={!interactive}
        >
          {isHalf ? (
            <div className={`relative ${starSize}`}>
              <svg className={`absolute ${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="absolute inset-0 w-1/2 overflow-hidden">
                <svg className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          ) : (
            <svg 
              className={`${starSize} ${
                isFilled ? 'text-yellow-400' : 
                interactive && i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
              } fill-current`} 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>

            {/* Property header skeleton */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-80"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-48"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
              <div>
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The property you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </Container>
      </div>
    );
  }

  const totalReviews = reviewSummary ? reviewSummary.totalReviews : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 overflow-x-auto">
          <Link to="/properties" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap">
            Properties
          </Link>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to={`/properties/${id}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap truncate max-w-24 sm:max-w-none">
            {property.title}
          </Link>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium whitespace-nowrap">
            Reviews
          </span>
        </nav>

        {/* Property Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-8">
          <img
            src={property.image}
            alt={property.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mx-auto sm:mx-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reviews for {property.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              {property.location} • {property.type} • ৳{property.price.toLocaleString()}/month
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={property.overallRating} size="lg" />
                <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {property.overallRating}
                </span>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  ({property.totalReviews} reviews)
                </span>
              </div>
              <Button onClick={() => setShowReviewForm(true)} className="w-full sm:w-auto">
                Write Review
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Write a Review
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Overall Rating *
                    </label>
                    <StarRating 
                      rating={reviewForm.rating} 
                      size="lg" 
                      interactive={true} 
                      onRatingClick={handleRatingClick}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Summarize your experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Share details about your experience with this property..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recommend"
                      checked={reviewForm.recommend}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, recommend: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="recommend" className="text-sm text-gray-700 dark:text-gray-300">
                      I would recommend this property to others
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit">
                      Submit Review
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                        {review.authorInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.author}
                          </h4>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                              Verified Tenant
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Lived here for {review.stayDuration}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <StarRating rating={review.rating} />
                      {review.recommend && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Recommends
                        </div>
                      )}
                    </div>
                  </div>

                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {review.title}
                  </h5>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {review.content}
                  </p>

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-75 transition-opacity cursor-pointer"
                          onClick={() => {
                            // In a real app, this would open a lightbox
                            window.open(photo, '_blank');
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Aspect Ratings - Compact Version */}
                  <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {Object.entries(review.aspects).map(([aspect, rating]) => {
                      const aspectLabels = {
                        location: 'Location',
                        landlord: 'Landlord',
                        valueForMoney: 'Value',
                        amenities: 'Amenities'
                      };
                      
                      return (
                        <div key={aspect} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {aspectLabels[aspect]}:
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {rating.toFixed(1)}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              rating >= 4.5 ? 'bg-green-500' :
                              rating >= 3.5 ? 'bg-yellow-500' :
                              rating >= 2.5 ? 'bg-orange-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful ({review.helpful})
                    </button>
                    
                    <button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Breakdown Sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Rating Breakdown
              </h3>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {property.overallRating}
                </div>
                <StarRating rating={property.overallRating} size="lg" />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Based on {totalReviews} reviews
                </div>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviewSummary ? (reviewSummary.ratingDistribution[stars] || 0) : 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6">
                        {stars}★
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Review Highlights
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">4.8/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Landlord</span>
                    <span className="font-medium text-gray-900 dark:text-white">4.4/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Value for Money</span>
                    <span className="font-medium text-gray-900 dark:text-white">4.2/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amenities</span>
                    <span className="font-medium text-gray-900 dark:text-white">4.4/5</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    87%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Would recommend to others
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}