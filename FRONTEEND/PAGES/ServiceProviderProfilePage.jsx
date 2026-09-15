import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function ServiceProviderProfilePage() {
  const { category, providerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');

  // API base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('dreamnest-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Fetch provider data from API
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all services to find provider data
        const servicesResponse = await apiCall('/services');
        
        if (servicesResponse.status === 'success') {
          const services = servicesResponse.data.services || [];
          
          // Filter services for this provider
          const providerServices = services.filter(service => service.provider.id === providerId);
          
          if (providerServices.length === 0) {
            throw new Error('Provider not found');
          }

          // Build provider profile from first service
          const firstService = providerServices[0];
          const bannerImage = firstService.images && firstService.images.length > 0 ? firstService.images[0] : null;
          
          const providerProfile = {
            id: firstService.provider.id,
            name: `${firstService.provider.firstName} ${firstService.provider.lastName}`,
            firstName: firstService.provider.firstName,
            lastName: firstService.provider.lastName,
            avatar: firstService.provider.avatar,
            image: firstService.provider.avatar, // Use avatar as profile image
            coverImage: bannerImage || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=400&fit=crop', // Use first service image as cover or fallback
            bannerImage: bannerImage,
            services: providerServices,
            rating: firstService.rating || 4.8,
            totalReviews: firstService.totalReviews || 24,
            reviewsCount: firstService.totalReviews || 24,
            verified: true,
            availability: 'available',
            responseTime: '2 hours',
            experience: '5+ years',
            yearsExperience: 5,
            completedJobs: 150,
            responseRate: '98%',
            serviceArea: firstService.serviceArea || ['Dhaka'],
            coverage: ['Dhaka', 'Dhanmondi', 'Gulshan'],
            description: `Professional ${firstService.category} service provider with extensive experience in the industry.`,
            languages: ['Bengali', 'English'],
            hourlyRate: firstService.price,
            certifications: ['Licensed', 'Insured'],
            contact: {
              phone: '+880 1700 000000',
              email: `${firstService.provider.firstName.toLowerCase()}@dreamnest.com`,
              address: 'Dhaka, Bangladesh',
              workingHours: '9:00 AM - 6:00 PM'
            },
            portfolio: [],
            reviews: []
          };
          
          setProvider(providerProfile);
        } else {
          throw new Error(servicesResponse.message || 'Failed to fetch services');
        }
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProvider();
    }
  }, [providerId]);

  const StarRating = ({ rating, size = 'sm', clickable = false, onClick }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className={`relative ${starSize}`}>
          <svg className={`absolute ${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <svg className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const content = (
      <div className="flex items-center gap-0.5">
        {stars}
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
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>

            {/* Cover image skeleton */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>

            {/* Profile header skeleton */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-64"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-48"></div>
                <div className="flex gap-4">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Provider Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The service provider you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Provider</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="space-x-3">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Link to="/services">
                <Button variant="outline">
                  Back to Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Provider Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The service provider you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link to="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link to="/services" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Services
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to={`/services/${category}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Cleaning Services
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">
            {provider.name}
          </span>
        </nav>

        {/* Cover Image */}
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
          <img
            src={provider.coverImage}
            alt={`${provider.name} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
          <div className="relative">
            <img
              src={provider.image}
              alt={provider.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            {provider.verified && (
              <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {provider.name}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-4">
              <div className="flex items-center gap-2">
                <StarRating 
                  rating={provider.rating} 
                  size="lg" 
                  clickable={true}
                  onClick={() => navigate(`/services/${category}/${providerId}/reviews`)}
                />
                <button
                  onClick={() => navigate(`/services/${category}/${providerId}/reviews`)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {provider.rating}
                  </span>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    ({provider.reviewsCount} reviews)
                  </span>
                </button>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                provider.availability === 'available' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  provider.availability === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                {provider.availability === 'available' ? 'Available Now' : 'Busy'}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <Link to={`/services/${category}/${providerId}/book`} className="w-full">
                <Button size="lg" className="w-full">
                  Book Service
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full">
                Contact Provider
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => navigate(`/services/${category}/${providerId}/reviews`)}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.414L3 21l2.414-5.094A8.959 8.959 0 113 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                <span className="hidden sm:inline">View All Reviews ({provider.reviewsCount})</span>
                <span className="sm:hidden">Reviews ({provider.reviewsCount})</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {provider.completedJobs}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Jobs Completed
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {provider.yearsExperience}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Years Experience
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {provider.responseTime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Response Time
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {provider.coverage.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cities Covered
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'services', label: 'Services & Pricing' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'reviews', label: 'Reviews' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About {provider.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {provider.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {provider.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Service Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.coverage.map((area, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{provider.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{provider.contact.email}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{provider.contact.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{provider.contact.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Services & Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          ৳{service.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {service.duration || 'Per session'}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {service.description}
                    </p>

                    {service.category && (
                      <div className="mb-4">
                        <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {service.category}
                        </span>
                      </div>
                    )}
                    
                    <Link to={`/services/${category}/${providerId}/book?service=${service.id}`}>
                      <Button className="w-full">
                        Book {service.title}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Our Work Portfolio
              </h2>
              {provider.portfolio && provider.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {provider.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Portfolio items coming soon.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Customer Reviews
              </h2>
              {provider.reviews && provider.reviews.length > 0 ? (
                <div className="space-y-6">
                  {provider.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                          {review.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.author}
                            </h4>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                                Verified
                              </span>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              • {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              for {review.service}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No reviews yet. Be the first to review!
                  </p>
                  <Button onClick={() => navigate(`/reviews/write?provider=${providerId}`)}>
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Floating Write Review Button */}
      <button
        onClick={() => navigate(`/reviews/write?provider=${providerId}`)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary-600 hover:bg-primary-700 text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group z-50"
        title="Write a Review"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>
  );
}