import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const servicesResponse = await apiCall('/services');
        if (servicesResponse.status === 'success') {
          const services = servicesResponse.data.services || [];
          
          // Extract categories
          const categoriesMap = {};
          services.forEach(service => {
            if (!categoriesMap[service.category]) {
              categoriesMap[service.category] = {
                name: service.category,
                serviceCount: 0,
                providers: new Set()
              };
            }
            categoriesMap[service.category].serviceCount++;
            categoriesMap[service.category].providers.add(service.provider.id);
          });

          const categoriesArray = Object.values(categoriesMap).map(cat => ({
            name: cat.name,
            serviceCount: cat.serviceCount,
            providerCount: cat.providers.size
          }));

          // Extract unique providers and get first 3
          const providersMap = {};
          services.forEach(service => {
            if (!providersMap[service.provider.id]) {
              providersMap[service.provider.id] = {
                id: service.provider.id,
                name: `${service.provider.firstName} ${service.provider.lastName}`,
                avatar: service.provider.avatar,
                bannerImage: service.images && service.images.length > 0 ? service.images[0] : null,
                serviceCount: 0,
                category: service.category,
                firstService: service
              };
            }
            providersMap[service.provider.id].serviceCount++;
          });

          const uniqueProviders = Object.values(providersMap).slice(0, 3);

          setCategories(categoriesArray);
          setFeaturedProviders(uniqueProviders);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      SECURITY: '',
      CLEANING: '',
      MAINTENANCE: '',
      PLUMBING: '',
      ELECTRICAL: '',
      PAINTING: '',
      GARDENING: ''
    };
    return icons[category] || '';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading services...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-12 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Services</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose a service category to explore available providers
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Browse by Category</h2>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => navigate(`/services/${category.name.toLowerCase()}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-left hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-6xl mb-6">{getCategoryIcon(category.name)}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{category.name}</h3>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.serviceCount} service{category.serviceCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.providerCount} provider{category.providerCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold">
                    View Providers
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No service categories available.</p>
          )}
        </div>

        {/* Featured Providers Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Service Providers</h2>
          {featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Banner Image */}
                  {provider.bannerImage && (
                    <div className="h-40 bg-gradient-to-r from-gray-300 to-gray-400 overflow-hidden">
                      <img
                        src={provider.bannerImage}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Avatar and Name */}
                    <div className="flex items-center gap-4 mb-4">
                      {provider.avatar ? (
                        <img
                          src={provider.avatar}
                          alt={provider.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-bold">
                            {provider.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{provider.category}</p>
                      </div>
                    </div>

                    {/* Services Info */}
                    <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {provider.serviceCount} service{provider.serviceCount !== 1 ? 's' : ''} offered
                      </p>
                    </div>

                    {/* View Profile Button */}
                    <button
                      onClick={() => navigate(`/services/${provider.category.toLowerCase()}/${provider.id}`)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">Loading featured providers...</p>
          )}
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">1</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Choose Category</h3>
              <p className="text-gray-600 dark:text-gray-400">Select a service category</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">2</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">View Providers</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse available providers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">3</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Book Service</h3>
              <p className="text-gray-600 dark:text-gray-400">Book and schedule</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
