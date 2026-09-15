import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function ServiceCategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [sortBy, setSortBy] = useState('rating');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const categoryInfo = {
    security: {
      name: 'Security Services',
      icon: '',
      description: 'Professional security guards and surveillance services'
    },
    cleaning: {
      name: 'Cleaning Services',
      icon: '',
      description: 'Professional home and office cleaning services'
    },
    maintenance: {
      name: 'Maintenance & Repairs',
      icon: '',
      description: 'Plumbing, electrical, and general repair services'
    }
  };

  const categoryDisplayName = category ? category.toUpperCase() : '';
  const currentCategory = categoryInfo[category?.toLowerCase()] || categoryInfo.cleaning;

  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
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
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return response.json();
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const servicesResponse = await apiCall('/services');
        if (servicesResponse.status === 'success') {
          const services = servicesResponse.data.services || [];

          const categoryServices = services.filter(
            service => service.category.toUpperCase() === categoryDisplayName
          );

          const providersMap = {};
          categoryServices.forEach(service => {
            const providerId = service.provider.id;

            if (!providersMap[providerId]) {
              providersMap[providerId] = {
                id: providerId,
                name: `${service.provider.firstName} ${service.provider.lastName}`,
                avatar: service.provider.avatar,
                bannerImage: service.images && service.images.length > 0 ? service.images[0] : null,
                services: [],
                rating: service.rating || 0,
                totalReviews: service.totalReviews || 0,
                startingPrice: service.price,
              };
            }

            providersMap[providerId].services.push({
              id: service.id,
              title: service.description,
              price: service.price,
            });
          });

          const uniqueProviders = Object.values(providersMap).map(provider => ({
            ...provider,
            verified: true,
            responseTime: '< 2 hours',
            description: `Professional ${categoryDisplayName.toLowerCase()} service provider`,
            yearsExperience: 3,
            completedJobs: Math.floor(Math.random() * 200) + 50,
          }));

          setProviders(uniqueProviders);
          setFilteredProviders(uniqueProviders);
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [category, categoryDisplayName]);

  useEffect(() => {
    let filtered = [...providers];

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case 'experience':
        filtered.sort((a, b) => b.yearsExperience - a.yearsExperience);
        break;
      default:
        break;
    }

    setFilteredProviders(filtered);
  }, [providers, sortBy]);

  const StarRating = ({ rating, reviews = 0 }) => {
    const fullStars = Math.floor(rating);

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < fullStars
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 fill-current'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)} {reviews > 0 && `(${reviews} reviews)`}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="animate-pulse">
            <div className="h-4 w-20 mb-6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-12 w-80 mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-6 w-96 mb-8 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Error Loading Providers</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">{error}</p>
            <Button onClick={() => navigate('/services')}>Back to Services</Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/services" className="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
            Services
          </Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">{currentCategory.name}</span>
        </nav>

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-4xl dark:bg-primary-900/30">
              {currentCategory.icon}
            </div>
            <div>
              <h1 className="mb-0 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                {currentCategory.name}
              </h1>
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                {currentCategory.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>{filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} available</span>
            {filteredProviders.length > 0 && (
              <>
                <span></span>
                <span>Starting from {Math.min(...filteredProviders.map(p => p.startingPrice)).toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        <div className="mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="reviews">Most Reviews</option>
            <option value="experience">Most Experience</option>
          </select>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No providers found
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              No providers are currently offering {currentCategory.name.toLowerCase()} in your area.
            </p>
            <Button onClick={() => navigate('/services')} variant="outline">
              Browse Other Services
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Banner Image */}
                {provider.bannerImage && (
                  <div className="relative h-32 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={provider.bannerImage}
                      alt={provider.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600 dark:bg-primary-900/30">
                        {provider.avatar ? (
                          <img src={provider.avatar} alt={provider.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          provider.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {provider.name}
                        </h3>
                        {provider.verified && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Starting at</p>
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {provider.startingPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <StarRating rating={provider.rating} reviews={provider.totalReviews} />
                </div>

                <div className="p-6">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {provider.description}
                  </p>

                  {provider.services.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {service.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Response: {provider.responseTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                      </svg>
                      {provider.yearsExperience} years experience
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {provider.completedJobs} completed jobs
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/services/${category}/${provider.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        View Profile
                      </Button>
                    </Link>

                    {user && user.role === 'SERVICE_PROVIDER' ? (
                      <Button variant="outline" size="sm" disabled>
                        Colleague
                      </Button>
                    ) : isAuthenticated ? (
                      <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/login')}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

