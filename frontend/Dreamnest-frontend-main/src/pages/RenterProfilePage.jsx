import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/Button';

const RenterProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');

  // Form state for renter-specific data
  const [formData, setFormData] = useState({
    // Rental Preferences
    rentalPreferences: {
      budgetRange: { min: 10000, max: 50000 },
      preferredAreas: [],
      propertyTypes: [],
      amenities: [],
      occupancyPreference: 'any', // alone, couple, family, shared
      moveInTimeline: 'flexible', // immediate, within-month, flexible
      leaseDuration: '12-months' // 6-months, 12-months, long-term
    },

    // Search & Activity History
    searchHistory: [],
    savedProperties: [],
    recentBookings: [],
    
    // Preferences & Settings
    searchNotifications: true,
    priceDropAlerts: true,
    newListingAlerts: true,
    recommendationEngine: true
  });

  // Mock data for demonstration
  const mockSearchHistory = [
    { id: 1, query: "2BR apartment Dhanmondi", date: "2025-10-26", results: 23 },
    { id: 2, query: "Studio Gulshan under 25000", date: "2025-10-25", results: 12 },
    { id: 3, query: "Family house Uttara", date: "2025-10-24", results: 8 },
    { id: 4, query: "Furnished apartment Mohakhali", date: "2025-10-23", results: 15 }
  ];

  const mockSavedProperties = [
    { id: 1, title: "Modern 2BR in Dhanmondi", price: 25000, area: "Dhanmondi", savedDate: "2025-10-20" },
    { id: 2, title: "Luxury Studio in Gulshan", price: 22000, area: "Gulshan", savedDate: "2025-10-18" },
    { id: 3, title: "Family Apartment Uttara", price: 30000, area: "Uttara", savedDate: "2025-10-15" }
  ];

  const mockRecentBookings = [
    { id: 1, propertyTitle: "Modern 2BR in Dhanmondi", date: "2025-10-20", status: "confirmed", service: "Property Viewing" },
    { id: 2, propertyTitle: "Cleaning Service", date: "2025-10-18", status: "completed", service: "Home Cleaning" },
    { id: 3, propertyTitle: "Repair Service", date: "2025-10-15", status: "completed", service: "Plumbing Repair" }
  ];

  // Available options
  const bangladeshAreas = [
    'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mohakhali', 'Bashundhara',
    'Mirpur', 'Wari', 'Old Dhaka', 'Tejgaon', 'Farmgate', 'Panthapath'
  ];

  const propertyTypes = [
    'Apartment', 'Studio', 'House', 'Room', 'Office Space', 'Commercial'
  ];

  const amenitiesList = [
    'Parking', 'Generator', 'Lift', 'Security', 'Gym', 'Swimming Pool',
    'Garden', 'Rooftop Access', 'Furnished', 'Air Conditioning', 'Balcony', 'Wi-Fi'
  ];

  useEffect(() => {
    // Check authentication and role
    const userData = localStorage.getItem('dreamnest-user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'RENTER') {
      navigate('/profile');
      return;
    }

    setUser(parsedUser);
    
    // Load existing renter preferences
    setFormData(prev => ({
      ...prev,
      rentalPreferences: {
        ...prev.rentalPreferences,
        ...parsedUser.rentalPreferences
      },
      searchHistory: mockSearchHistory,
      savedProperties: mockSavedProperties,
      recentBookings: mockRecentBookings,
      searchNotifications: parsedUser.searchNotifications ?? true,
      priceDropAlerts: parsedUser.priceDropAlerts ?? true,
      newListingAlerts: parsedUser.newListingAlerts ?? true,
      recommendationEngine: parsedUser.recommendationEngine ?? true
    }));
    
    setIsLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      if (section === 'budgetRange') {
        setFormData(prev => ({
          ...prev,
          rentalPreferences: {
            ...prev.rentalPreferences,
            budgetRange: {
              ...prev.rentalPreferences.budgetRange,
              [field]: parseInt(value) || 0
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          rentalPreferences: {
            ...prev.rentalPreferences,
            [field]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayToggle = (section, item) => {
    setFormData(prev => ({
      ...prev,
      rentalPreferences: {
        ...prev.rentalPreferences,
        [section]: prev.rentalPreferences[section].includes(item)
          ? prev.rentalPreferences[section].filter(i => i !== item)
          : [...prev.rentalPreferences[section], item]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage
      const updatedUser = {
        ...user,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearSearchHistory = () => {
    if (window.confirm('Clear all search history? This cannot be undone.')) {
      setFormData(prev => ({
        ...prev,
        searchHistory: []
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Renter Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your rental preferences and search settings
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              General Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 dark:text-green-300 font-medium">
                Renter preferences updated successfully!
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'preferences', name: 'Rental Preferences', icon: '🏠' },
                { id: 'history', name: 'Search History', icon: '🔍' },
                { id: 'saved', name: 'Saved Properties', icon: '❤️' },
                { id: 'settings', name: 'Notifications', icon: '🔔' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              
              {/* Rental Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Rental Preferences
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Set your preferences to help us find the perfect rental for you
                    </p>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Budget Range</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minimum Budget (৳)
                        </label>
                        <input
                          type="number"
                          name="budgetRange.min"
                          value={formData.rentalPreferences.budgetRange.min}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Maximum Budget (৳)
                        </label>
                        <input
                          type="number"
                          name="budgetRange.max"
                          value={formData.rentalPreferences.budgetRange.max}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="50000"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Current range: ৳{formData.rentalPreferences.budgetRange.min.toLocaleString()} - ৳{formData.rentalPreferences.budgetRange.max.toLocaleString()}
                    </p>
                  </div>

                  {/* Preferred Areas */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferred Areas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {bangladeshAreas.map((area) => (
                        <label key={area} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.rentalPreferences.preferredAreas.includes(area)}
                            onChange={() => handleArrayToggle('preferredAreas', area)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Types</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {propertyTypes.map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.rentalPreferences.propertyTypes.includes(type)}
                            onChange={() => handleArrayToggle('propertyTypes', type)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Desired Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.rentalPreferences.amenities.includes(amenity)}
                            onChange={() => handleArrayToggle('amenities', amenity)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Other Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Occupancy Preference
                      </label>
                      <select
                        name="occupancyPreference"
                        value={formData.rentalPreferences.occupancyPreference}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="any">Any</option>
                        <option value="alone">Live Alone</option>
                        <option value="couple">Couple</option>
                        <option value="family">Family</option>
                        <option value="shared">Shared Living</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Move-in Timeline
                      </label>
                      <select
                        name="moveInTimeline"
                        value={formData.rentalPreferences.moveInTimeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="within-month">Within a Month</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lease Duration
                      </label>
                      <select
                        name="leaseDuration"
                        value={formData.rentalPreferences.leaseDuration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="6-months">6 Months</option>
                        <option value="12-months">12 Months</option>
                        <option value="long-term">Long Term (2+ years)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Search History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Search History
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your recent property searches and results
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleClearSearchHistory}
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30"
                    >
                      Clear History
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.searchHistory.map((search) => (
                      <div key={search.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{search.query}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {search.date} • {search.results} results found
                          </p>
                        </div>
                        <Button size="sm" onClick={() => alert(`Search again: ${search.query}`)}>
                          Search Again
                        </Button>
                      </div>
                    ))}
                    {formData.searchHistory.length === 0 && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No search history available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Saved Properties Tab */}
              {activeTab === 'saved' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Saved Properties
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Properties you&apos;ve saved for later viewing
                    </p>
                  </div>

                  <div className="space-y-4">
                    {formData.savedProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{property.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {property.area} • ৳{property.price.toLocaleString()}/month • Saved on {property.savedDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => alert(`View property: ${property.title}`)}>
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => alert(`Remove from saved: ${property.title}`)}
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notification Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Notification Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Control what rental-related notifications you receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'searchNotifications', label: 'Search Notifications', description: 'Get notified about new properties matching your searches' },
                      { key: 'priceDropAlerts', label: 'Price Drop Alerts', description: 'Receive alerts when saved properties reduce their price' },
                      { key: 'newListingAlerts', label: 'New Listing Alerts', description: 'Get notified about new listings in your preferred areas' },
                      { key: 'recommendationEngine', label: 'Smart Recommendations', description: 'Receive AI-powered property recommendations based on your preferences' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="checkbox"
                          name={setting.key}
                          checked={formData[setting.key]}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div>
                          <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                            {setting.label}
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.updatedAt && `Last updated: ${new Date(user.updatedAt).toLocaleString()}`}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RenterProfilePage;