import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/Button';

const ProviderProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Form state for provider-specific data
  const [formData, setFormData] = useState({
    // Service Specializations
    serviceDetails: {
      primaryServices: [],
      serviceAreas: [],
      experienceYears: 1,
      teamSize: 1,
      businessDescription: '',
      specializations: [],
      workingHours: {
        start: '08:00',
        end: '18:00',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    },

    // Professional Credentials
    credentials: {
      certifications: [],
      licenses: [],
      insuranceDetails: {
        hasInsurance: false,
        provider: '',
        policyNumber: '',
        expiryDate: ''
      },
      professionalMemberships: []
    },

    // Business Operations
    businessSettings: {
      minimumJobValue: 500,
      maximumJobValue: 50000,
      emergencyServices: false,
      advanceBookingRequired: false,
      paymentTerms: 'on-completion', // on-completion, 50-50, advance-required
      cancellationPolicy: 'flexible' // flexible, moderate, strict
    },

    // Portfolio & Reviews
    portfolio: {
      completedJobs: 0,
      averageRating: 0,
      totalReviews: 0,
      responseTime: '2-hours' // immediate, 1-hour, 2-hours, same-day
    }
  });

  // Available service categories
  const serviceCategories = [
    'Home Cleaning', 'Plumbing', 'Electrical Work', 'Carpentry', 
    'Painting', 'AC Repair', 'Appliance Repair', 'Gardening',
    'Pest Control', 'Security Services', 'Moving Services', 'General Maintenance'
  ];

  const bangladeshAreas = [
    'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mohakhali', 'Bashundhara',
    'Mirpur', 'Wari', 'Old Dhaka', 'Tejgaon', 'Farmgate', 'Panthapath'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Mock data for demonstration
  const mockCertifications = [
    { id: 1, name: 'Electrical Safety Certificate', issuer: 'Bangladesh Electrical Board', date: '2024-01-15', status: 'active' },
    { id: 2, name: 'Plumbing Professional License', issuer: 'Dhaka Water Authority', date: '2023-06-20', status: 'active' },
    { id: 3, name: 'First Aid Training', issuer: 'Red Crescent', date: '2024-03-10', status: 'active' }
  ];

  useEffect(() => {
    // Check authentication and role
    const userData = localStorage.getItem('dreamnest-user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'SERVICE_PROVIDER') {
      navigate('/profile');
      return;
    }

    setUser(parsedUser);
    
    // Load existing provider data
    setFormData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        primaryServices: parsedUser.primaryServices || [],
        serviceAreas: parsedUser.serviceAreas || [],
        experienceYears: parsedUser.experienceYears || 1,
        teamSize: parsedUser.teamSize || 1,
        businessDescription: parsedUser.businessDescription || '',
        specializations: parsedUser.specializations || []
      },
      credentials: {
        ...prev.credentials,
        certifications: mockCertifications,
        insuranceDetails: {
          ...prev.credentials.insuranceDetails,
          ...parsedUser.insuranceDetails
        }
      },
      businessSettings: {
        ...prev.businessSettings,
        ...parsedUser.businessSettings
      },
      portfolio: {
        ...prev.portfolio,
        completedJobs: parsedUser.completedJobs || 0,
        averageRating: parsedUser.averageRating || 0,
        totalReviews: parsedUser.totalReviews || 0
      }
    }));
    
    setIsLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 3) {
        const [section, subsection, field] = parts;
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [field]: type === 'checkbox' ? checked : value
            }
          }
        }));
      } else {
        const [section, field] = parts;
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
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

  const handleArrayToggle = (section, field, item) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].includes(item)
          ? prev[section][field].filter(i => i !== item)
          : [...prev[section][field], item]
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
        ...formData.serviceDetails,
        businessSettings: formData.businessSettings,
        credentials: formData.credentials,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      alert('Failed to save professional profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCertificationUpload = () => {
    // In a real app, this would open a file upload dialog
    alert('Upload certification functionality coming soon');
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
              Professional Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your service offerings and professional credentials
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              General Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/provider')}>
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
                Professional profile updated successfully!
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'services', name: 'Services & Skills', icon: '🛠️' },
                { id: 'credentials', name: 'Credentials', icon: '🏆' },
                { id: 'business', name: 'Business Settings', icon: '⚙️' },
                { id: 'portfolio', name: 'Portfolio & Stats', icon: '📊' }
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
              
              {/* Services & Skills Tab */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Services & Specializations
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Define your service offerings and areas of expertise
                    </p>
                  </div>

                  {/* Primary Services */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Primary Services</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {serviceCategories.map((service) => (
                        <label key={service} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.serviceDetails.primaryServices.includes(service)}
                            onChange={() => handleArrayToggle('serviceDetails', 'primaryServices', service)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Service Areas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {bangladeshAreas.map((area) => (
                        <label key={area} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.serviceDetails.serviceAreas.includes(area)}
                            onChange={() => handleArrayToggle('serviceDetails', 'serviceAreas', area)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience & Team */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="serviceDetails.experienceYears"
                        value={formData.serviceDetails.experienceYears}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Team Size
                      </label>
                      <input
                        type="number"
                        name="serviceDetails.teamSize"
                        value={formData.serviceDetails.teamSize}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Business Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Description
                    </label>
                    <textarea
                      name="serviceDetails.businessDescription"
                      value={formData.serviceDetails.businessDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Describe your services, experience, and what makes you stand out..."
                    />
                  </div>

                  {/* Working Hours */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Working Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="serviceDetails.workingHours.start"
                          value={formData.serviceDetails.workingHours.start}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          name="serviceDetails.workingHours.end"
                          value={formData.serviceDetails.workingHours.end}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Days
                      </label>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                          <label key={day} className="flex items-center space-x-1 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={formData.serviceDetails.workingHours.availableDays.includes(day)}
                              onChange={() => handleArrayToggle('serviceDetails', 'workingHours.availableDays', day)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{day.slice(0, 3)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Credentials Tab */}
              {activeTab === 'credentials' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Professional Credentials
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Showcase your certifications, licenses, and professional qualifications
                    </p>
                  </div>

                  {/* Current Certifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Certifications</h3>
                    <div className="space-y-3">
                      {formData.credentials.certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{cert.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {cert.issuer} • Issued: {cert.date}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            cert.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : cert.status === 'expired'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {cert.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={handleCertificationUpload}
                      className="mt-4 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Certification
                    </Button>
                  </div>

                  {/* Insurance Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Insurance Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="credentials.insuranceDetails.hasInsurance"
                          checked={formData.credentials.insuranceDetails.hasInsurance}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                          I have professional liability insurance
                        </label>
                      </div>

                      {formData.credentials.insuranceDetails.hasInsurance && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Insurance Provider
                            </label>
                            <input
                              type="text"
                              name="credentials.insuranceDetails.provider"
                              value={formData.credentials.insuranceDetails.provider}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Insurance company name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Policy Number
                            </label>
                            <input
                              type="text"
                              name="credentials.insuranceDetails.policyNumber"
                              value={formData.credentials.insuranceDetails.policyNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Policy number"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="date"
                              name="credentials.insuranceDetails.expiryDate"
                              value={formData.credentials.insuranceDetails.expiryDate}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Business Settings Tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Business Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Configure your service pricing, policies, and booking preferences
                    </p>
                  </div>

                  {/* Pricing Range */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Job Value Range</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minimum Job Value (৳)
                        </label>
                        <input
                          type="number"
                          name="businessSettings.minimumJobValue"
                          value={formData.businessSettings.minimumJobValue}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Maximum Job Value (৳)
                        </label>
                        <input
                          type="number"
                          name="businessSettings.maximumJobValue"
                          value={formData.businessSettings.maximumJobValue}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Options */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Service Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="businessSettings.emergencyServices"
                          checked={formData.businessSettings.emergencyServices}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div>
                          <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                            Emergency Services Available
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Offer 24/7 emergency repair services with premium rates
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="businessSettings.advanceBookingRequired"
                          checked={formData.businessSettings.advanceBookingRequired}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div>
                          <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                            Advance Booking Required
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Require customers to book services at least 24 hours in advance
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Policies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Terms
                      </label>
                      <select
                        name="businessSettings.paymentTerms"
                        value={formData.businessSettings.paymentTerms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="on-completion">Payment on Completion</option>
                        <option value="50-50">50% Advance, 50% on Completion</option>
                        <option value="advance-required">Full Advance Required</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cancellation Policy
                      </label>
                      <select
                        name="businessSettings.cancellationPolicy"
                        value={formData.businessSettings.cancellationPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="flexible">Flexible (Free cancellation up to 2 hours)</option>
                        <option value="moderate">Moderate (Free cancellation up to 6 hours)</option>
                        <option value="strict">Strict (24 hours notice required)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio & Stats Tab */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Portfolio & Performance Stats
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Track your service performance and build your professional portfolio
                    </p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {formData.portfolio.completedJobs}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Completed Jobs
                      </div>
                    </div>

                    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                        {formData.portfolio.averageRating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Average Rating
                      </div>
                    </div>

                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {formData.portfolio.totalReviews}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Reviews
                      </div>
                    </div>
                  </div>

                  {/* Response Time Setting */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Response Time</h3>
                    <select
                      name="portfolio.responseTime"
                      value={formData.portfolio.responseTime}
                      onChange={handleInputChange}
                      className="w-full md:w-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="immediate">Immediate (within 30 minutes)</option>
                      <option value="1-hour">Within 1 Hour</option>
                      <option value="2-hours">Within 2 Hours</option>
                      <option value="same-day">Same Day</option>
                    </select>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      How quickly you typically respond to new booking requests
                    </p>
                  </div>

                  {/* Portfolio Upload Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Work Portfolio</h3>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <p className="text-lg text-gray-900 dark:text-white font-medium">Upload your work samples</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Show potential customers examples of your completed projects
                        </p>
                        <Button className="mt-4">
                          Upload Photos
                        </Button>
                      </div>
                    </div>
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
                      Save Professional Profile
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

export default ProviderProfilePage;