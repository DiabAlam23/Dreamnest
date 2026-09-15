import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function WriteReviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get('property');
  const providerId = searchParams.get('provider');
  
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [reviewType, setReviewType] = useState('property');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    overallRating: 0,
    title: '',
    content: '',
    recommend: true,
    
    // Property-specific
    stayDuration: '',
    moveOutReason: '',
    aspectRatings: {
      location: 0,
      landlord: 0,
      valueForMoney: 0,
      amenities: 0
    },
    
    // Service-specific
    serviceType: '',
    projectDetails: '',
    serviceAspects: {
      punctuality: 0,
      professionalism: 0,
      quality: 0,
      communication: 0,
      valueForMoney: 0
    },
    
    // Photos (placeholder)
    photos: [],
    
    // Contact info
    allowContact: false,
    contactPreference: 'email'
  });

  // Mock data based on type
  const mockPropertyData = {
    id: 'prop-1',
    title: 'Luxury Apartment in Dhanmondi',
    image: '/images/properties/properties_4.jpg',
    type: 'property',
    location: 'Dhanmondi, Dhaka',
    price: 45000
  };

  const mockProviderData = {
    id: 'clean-pro-1',
    name: 'CleanPro Bangladesh',
    image: '/images/services/services_21.jpg',
    type: 'service',
    category: 'Cleaning Services',
    services: ['Deep Cleaning', 'Regular Cleaning', 'Office Cleaning', 'Post-Construction Cleaning']
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (propertyId) {
        setTarget(mockPropertyData);
        setReviewType('property');
      } else if (providerId) {
        setTarget(mockProviderData);
        setReviewType('service');
      } else {
        // No specific target, user can choose
        setTarget(null);
        setReviewType('property'); // default
      }
      
      setLoading(false);
    };

    fetchData();
  }, [propertyId, providerId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingClick = (field, rating, isAspect = false) => {
    if (isAspect) {
      const aspectsField = reviewType === 'property' ? 'aspectRatings' : 'serviceAspects';
      setFormData(prev => ({
        ...prev,
        [aspectsField]: {
          ...prev[aspectsField],
          [field]: rating
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: rating
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Review submitted:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to appropriate page
    if (reviewType === 'property' && target) {
      navigate(`/properties/${target.id}/reviews`);
    } else if (reviewType === 'service' && target) {
      navigate(`/services/cleaning/${target.id}/reviews`);
    } else {
      navigate('/reviews');
    }
  };

  const StarRating = ({ rating, size = 'lg', interactive = true, onRatingClick, field, isAspect = false }) => {
    const stars = [];
    const starSize = size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-5 h-5';

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;

      stars.push(
        <button
          key={i}
          type="button"
          onClick={interactive ? () => onRatingClick(field, i, isAspect) : undefined}
          className={`${interactive ? 'hover:scale-110 cursor-pointer' : ''} transition-transform`}
          disabled={!interactive}
        >
          <svg 
            className={`${starSize} ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            } fill-current hover:text-yellow-400`} 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
      </div>
    );
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Basic Info', description: 'Overall rating and review' },
      { number: 2, title: 'Detailed Ratings', description: 'Rate specific aspects' },
      { number: 3, title: 'Additional Info', description: 'Photos and details' }
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step.number
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center mt-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.number
                  ? 'bg-primary-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-64 mx-auto"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Write a Review
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your experience to help others make informed decisions
            </p>
          </div>

          {/* Target Selection or Display */}
          {!target ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What would you like to review?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setReviewType('property')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    reviewType === 'property'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Property
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Review an apartment, house, or commercial space
                  </p>
                </button>
                
                <button
                  onClick={() => setReviewType('service')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    reviewType === 'service'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-4xl mb-4">🛠️</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Service Provider
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Review a cleaning, maintenance, or other service
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={target.image}
                  alt={target.title || target.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Reviewing: {target.title || target.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {target.location || target.category}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Review Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Overall Rating *
                    </label>
                    <div className="flex items-center gap-4">
                      <StarRating 
                        rating={formData.overallRating} 
                        onRatingClick={handleRatingClick}
                        field="overallRating"
                      />
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {formData.overallRating > 0 ? `${formData.overallRating}/5` : 'Select rating'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Summarize your experience in a few words"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Share details about your experience. What did you like? What could be improved? Be specific and helpful to others."
                    />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Minimum 50 characters ({formData.content.length}/50)
                    </div>
                  </div>

                  {reviewType === 'property' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How long did you live here?
                      </label>
                      <select
                        value={formData.stayDuration}
                        onChange={(e) => handleInputChange('stayDuration', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select duration</option>
                        <option value="Less than 3 months">Less than 3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="2+ years">2+ years</option>
                      </select>
                    </div>
                  )}

                  {reviewType === 'service' && target && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Which service did you use?
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select service</option>
                        {target.services && target.services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Detailed Ratings */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Rate Specific Aspects
                  </h3>
                  
                  {reviewType === 'property' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(formData.aspectRatings).map(([aspect, rating]) => (
                        <div key={aspect} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                              {aspect.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                          </div>
                          <StarRating 
                            rating={rating} 
                            size="md"
                            onRatingClick={handleRatingClick}
                            field={aspect}
                            isAspect={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(formData.serviceAspects).map(([aspect, rating]) => (
                        <div key={aspect} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                              {aspect.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                          </div>
                          <StarRating 
                            rating={rating} 
                            size="md"
                            onRatingClick={handleRatingClick}
                            field={aspect}
                            isAspect={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {reviewType === 'service' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Details
                      </label>
                      <textarea
                        value={formData.projectDetails}
                        onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Brief description of the work done (e.g., '3-bedroom apartment deep clean, 1,200 sq ft')"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Additional Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Additional Information
                  </h3>

                  {/* Photo Upload Placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400">
                        Photos help others see your experience
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        (Photo upload feature would be implemented here)
                      </p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recommend"
                      checked={formData.recommend}
                      onChange={(e) => handleInputChange('recommend', e.target.checked)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="recommend" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      I would recommend this {reviewType === 'property' ? 'property' : 'service provider'} to others
                    </label>
                  </div>

                  {/* Contact Preference */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="allowContact"
                        checked={formData.allowContact}
                        onChange={(e) => handleInputChange('allowContact', e.target.checked)}
                        className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowContact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow others to contact me about my review
                      </label>
                    </div>
                    {formData.allowContact && (
                      <select
                        value={formData.contactPreference}
                        onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="email">Contact via email</option>
                        <option value="platform">Contact via platform messages</option>
                      </select>
                    )}
                  </div>

                  {/* Review Guidelines */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      Review Guidelines
                    </h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                      <li>• Be honest and fair in your review</li>
                      <li>• Focus on your personal experience</li>
                      <li>• Avoid inappropriate language or personal attacks</li>
                      <li>• Include specific details that help others</li>
                      <li>• Reviews are public and may be moderated</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={currentStep === 1 && (formData.overallRating === 0 || !formData.title || formData.content.length < 50)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={formData.overallRating === 0 || !formData.title || formData.content.length < 50}
                    >
                      Submit Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}