import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import PropertyCard from '../components/PropertyCard.jsx';

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

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const locationQuery = searchParams.get('location') || '';
  
  const [filters, setFilters] = useState({
    search: searchQuery,
    location: locationQuery,
    priceMin: '',
    priceMax: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    sortBy: 'createdAt'
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewStyle, setViewStyle] = useState('grid'); // 'grid' or 'list'

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy: filters.sortBy === 'createdAt' ? 'createdAt' : 'monthlyRent',
        sortOrder: filters.sortBy === 'price-low' ? 'asc' : filters.sortBy === 'price-high' ? 'desc' : 'desc'
      });

      if (filters.search) params.set('search', filters.search);
      if (filters.location) params.set('city', filters.location);
      if (filters.priceMin) params.set('minPrice', filters.priceMin);
      if (filters.priceMax) params.set('maxPrice', filters.priceMax);
      if (filters.propertyType) params.set('propertyType', filters.propertyType);
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);

      const response = await apiCall(`/properties?${params.toString()}`);

      if (response.status === 'success') {
        // Transform API data to match PropertyCard expectations
        const transformedProperties = response.data.properties.map(property => ({
          id: property.id,
          title: property.title,
          location: `${property.city}, ${property.state}`,
          price: property.monthlyRent || 0,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.area,
          image: property.images && property.images.length > 0 
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${property.images[0]}` 
            : '/images/properties/default.jpg',
          featured: false, // API doesn't have featured flag
          rating: property.averageRating,
          totalReviews: property.reviewCount
        }));

        setProperties(transformedProperties);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters, pagination.currentPage]);

  const propertyTypes = ['Any Type', 'Apartment', 'House', 'Condo', 'Studio'];
  const bedroomOptions = ['Any', '1', '2', '3', '4+'];
  const bathroomOptions = ['Any', '1', '2', '3+'];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleNewSearch = () => {
    // Update URL params with new search
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    setSearchParams(params);
    // Reset to page 1 for new search
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '', location: '' }));
    setSearchParams({});
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Results Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200/60 dark:border-gray-700">
        <Container className="py-8 md:py-12">
          {/* Search Context */}
          {searchQuery && (
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {properties.length} properties found
              </p>
            </div>
          )}

          {/* New Search Bar */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Location Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <div className="flex gap-2">
                <Button onClick={handleNewSearch} className="whitespace-nowrap">
                  Update Search
                </Button>
                {(searchQuery || locationQuery) && (
                  <Button variant="outline" onClick={clearSearch}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="flex-1 py-8">
        <div className="flex flex-col lg:flex-row gap-8 min-h-0">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 sticky top-8 h-fit">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Refine Results</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type === 'Any Type' ? '' : type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {bedroomOptions.map(option => (
                    <option key={option} value={option === 'Any' ? '' : option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {bathroomOptions.map(option => (
                    <option key={option} value={option === 'Any' ? '' : option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </Button>
          </div>

          {/* Mobile Filters Collapsible */}
          {showFilters && (
            <div className="lg:hidden mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="flex-1 min-w-0 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="flex-1 min-w-0 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type === 'Any Type' ? '' : type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {bedroomOptions.map(option => (
                      <option key={option} value={option === 'Any' ? '' : option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bathrooms</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {bathroomOptions.map(option => (
                      <option key={option} value={option === 'Any' ? '' : option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Main Results Area */}
          <main className="flex-1 min-w-0 w-full lg:w-auto overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Properties</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <Button onClick={fetchProperties}>Try Again</Button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or clear all filters.
                </p>
                <Button onClick={clearSearch}>Clear Search</Button>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {properties.length} Properties Found
                    </h2>
                    {searchQuery && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Showing results for &ldquo;{searchQuery}&rdquo;
                        {locationQuery && ` in ${locationQuery}`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* View Style Toggle */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setViewStyle('grid')}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          viewStyle === 'grid'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        aria-label="Grid view"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Grid
                      </button>
                      <button
                        onClick={() => setViewStyle('list')}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          viewStyle === 'list'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        aria-label="List view"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        List
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Properties Display - Grid/List View */}
                <div className="mb-8 w-full">
                  <div className={viewStyle === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'grid grid-cols-1 gap-4'
                  }>
                    {properties.map((property) => (
                      <PropertyCard 
                        key={property.id}
                        property={property}
                        viewStyle={viewStyle}
                        onViewDetails={() => {
                          // Navigate to property detail page
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200/60 dark:border-gray-700/60">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                        if (pageNum > pagination.totalPages) return null;
                        return (
                          <button 
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 text-sm rounded-md ${
                              pageNum === pagination.currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}