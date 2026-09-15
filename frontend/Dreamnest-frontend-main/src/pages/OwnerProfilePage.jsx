import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/Button';

const OwnerProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('business');

  // Form state for owner-specific data
  const [formData, setFormData] = useState({
    // Business Details
    businessDetails: {
      businessName: '',
      businessType: 'individual', // individual, company, agency
      tradeLicense: '',
      taxIdNumber: '',
      yearsInBusiness: 1,
      propertyCount: 1,
      description: ''
    },

    // Contact & Office Information
    officeDetails: {
      officeAddress: {
        street: '',
        city: 'Dhaka',
        district: '',
        postalCode: ''
      },
      officePhone: '',
      emergencyContact: '',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    },

    // Verification & Documents
    verification: {
      identityVerified: false,
      phoneVerified: false,
      addressVerified: false,
      documentsUploaded: []
    },

    // Property Management Preferences
    managementPreferences: {
      allowOnlineBookings: true,
      autoResponseEnabled: true,
      screeningRequired: true,
      depositPolicy: 'standard', // standard, flexible, strict
      petPolicy: 'case-by-case', // allowed, not-allowed, case-by-case
      smokingPolicy: 'not-allowed' // allowed, not-allowed, outdoor-only
    },

    // Financial Settings
    financialSettings: {
      preferredPaymentMethods: ['bank-transfer', 'mobile-banking'],
      lateFeePolicy: true,
      securityDepositMonths: 2,
      advanceRentMonths: 1
    }
  });

  // Available options
  const businessTypes = [
    { value: 'individual', label: 'Individual Owner' },
    { value: 'company', label: 'Real Estate Company' },
    { value: 'agency', label: 'Property Management Agency' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'mobile-banking', label: 'Mobile Banking (bKash, Nagad)' },
    { value: 'check', label: 'Check' },
    { value: 'online-payment', label: 'Online Payment Gateway' }
  ];

  const mockDocuments = [
    { id: 1, name: 'National ID Card', type: 'identity', status: 'verified', uploadDate: '2025-10-15' },
    { id: 2, name: 'Trade License', type: 'business', status: 'pending', uploadDate: '2025-10-20' },
    { id: 3, name: 'Property Ownership Documents', type: 'property', status: 'verified', uploadDate: '2025-10-10' }
  ];

  useEffect(() => {
    // Check authentication and role
    const userData = localStorage.getItem('dreamnest-user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'OWNER') {
      navigate('/profile');
      return;
    }

    setUser(parsedUser);
    
    // Load existing owner data
    setFormData(prev => ({
      ...prev,
      businessDetails: {
        ...prev.businessDetails,
        businessName: parsedUser.businessName || '',
        businessType: parsedUser.businessType || 'individual',
        tradeLicense: parsedUser.tradeLicense || '',
        taxIdNumber: parsedUser.taxIdNumber || '',
        yearsInBusiness: parsedUser.yearsInBusiness || 1,
        propertyCount: parsedUser.propertyCount || 1,
        description: parsedUser.businessDescription || ''
      },
      officeDetails: {
        ...prev.officeDetails,
        officePhone: parsedUser.officePhone || '',
        emergencyContact: parsedUser.emergencyContact || '',
        officeAddress: {
          ...prev.officeDetails.officeAddress,
          ...parsedUser.officeAddress
        }
      },
      verification: {
        ...prev.verification,
        identityVerified: parsedUser.identityVerified || false,
        phoneVerified: parsedUser.phoneVerified || false,
        addressVerified: parsedUser.addressVerified || false,
        documentsUploaded: mockDocuments
      },
      managementPreferences: {
        ...prev.managementPreferences,
        ...parsedUser.managementPreferences
      },
      financialSettings: {
        ...prev.financialSettings,
        ...parsedUser.financialSettings
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
        ...formData.businessDetails,
        ...formData.officeDetails,
        managementPreferences: formData.managementPreferences,
        financialSettings: formData.financialSettings,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      alert('Failed to save business profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentUpload = (documentType) => {
    // In a real app, this would open a file upload dialog
    alert(`Upload ${documentType} document functionality coming soon`);
  };

  const handleVerificationRequest = (verificationType) => {
    // In a real app, this would initiate verification process
    alert(`Request ${verificationType} verification functionality coming soon`);
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
              Owner Business Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your property business information and verification
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              General Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/owner')}>
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
                Business profile updated successfully!
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'business', name: 'Business Details', icon: '🏢' },
                { id: 'verification', name: 'Verification', icon: '✅' },
                { id: 'management', name: 'Management', icon: '⚙️' },
                { id: 'financial', name: 'Financial', icon: '💰' }
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
              
              {/* Business Details Tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Business Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Provide details about your property business
                    </p>
                  </div>

                  {/* Basic Business Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessDetails.businessName"
                        value={formData.businessDetails.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Your property business name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Type
                      </label>
                      <select
                        name="businessDetails.businessType"
                        value={formData.businessDetails.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        {businessTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trade License Number
                      </label>
                      <input
                        type="text"
                        name="businessDetails.tradeLicense"
                        value={formData.businessDetails.tradeLicense}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Trade license number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tax ID Number
                      </label>
                      <input
                        type="text"
                        name="businessDetails.taxIdNumber"
                        value={formData.businessDetails.taxIdNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Tax identification number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Years in Business
                      </label>
                      <input
                        type="number"
                        name="businessDetails.yearsInBusiness"
                        value={formData.businessDetails.yearsInBusiness}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Properties
                      </label>
                      <input
                        type="number"
                        name="businessDetails.propertyCount"
                        value={formData.businessDetails.propertyCount}
                        onChange={handleInputChange}
                        min="1"
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
                      name="businessDetails.description"
                      value={formData.businessDetails.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Describe your property business, experience, and specialties..."
                    />
                  </div>

                  {/* Office Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Office Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Office Address
                        </label>
                        <input
                          type="text"
                          name="officeDetails.officeAddress.street"
                          value={formData.officeDetails.officeAddress.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Office street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Office Phone
                        </label>
                        <input
                          type="tel"
                          name="officeDetails.officePhone"
                          value={formData.officeDetails.officePhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="+880-XXXX-XXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Emergency Contact
                        </label>
                        <input
                          type="tel"
                          name="officeDetails.emergencyContact"
                          value={formData.officeDetails.emergencyContact}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="+880-XXXX-XXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Working Hours Start
                        </label>
                        <input
                          type="time"
                          name="officeDetails.workingHours.start"
                          value={formData.officeDetails.workingHours.start}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Working Hours End
                        </label>
                        <input
                          type="time"
                          name="officeDetails.workingHours.end"
                          value={formData.officeDetails.workingHours.end}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Tab */}
              {activeTab === 'verification' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Account Verification
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Verify your identity and business to build trust with potential tenants
                    </p>
                  </div>

                  {/* Verification Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Identity</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          formData.verification.identityVerified
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {formData.verification.identityVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Verify your national ID or passport
                      </p>
                      {!formData.verification.identityVerified && (
                        <Button 
                          size="sm" 
                          onClick={() => handleVerificationRequest('identity')}
                          className="w-full"
                        >
                          Verify Identity
                        </Button>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          formData.verification.phoneVerified
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {formData.verification.phoneVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Confirm your phone number via SMS
                      </p>
                      {!formData.verification.phoneVerified && (
                        <Button 
                          size="sm" 
                          onClick={() => handleVerificationRequest('phone')}
                          className="w-full"
                        >
                          Verify Phone
                        </Button>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Address</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          formData.verification.addressVerified
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {formData.verification.addressVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Verify your business address
                      </p>
                      {!formData.verification.addressVerified && (
                        <Button 
                          size="sm" 
                          onClick={() => handleVerificationRequest('address')}
                          className="w-full"
                        >
                          Verify Address
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Verification Documents</h3>
                    <div className="space-y-3">
                      {formData.verification.documentsUploaded.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Uploaded: {doc.uploadDate} • Type: {doc.type}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            doc.status === 'verified'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : doc.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleDocumentUpload('identity')}
                        className="flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload ID Card
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDocumentUpload('business')}
                        className="flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Business License
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDocumentUpload('property')}
                        className="flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Property Documents
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Management Preferences Tab */}
              {activeTab === 'management' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Property Management Preferences
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Configure how you manage your properties and tenant interactions
                    </p>
                  </div>

                  {/* Management Settings */}
                  <div className="space-y-4">
                    {[
                      { key: 'allowOnlineBookings', label: 'Allow Online Bookings', description: 'Enable tenants to book property viewings online' },
                      { key: 'autoResponseEnabled', label: 'Auto-Response Messages', description: 'Automatically respond to initial inquiries' },
                      { key: 'screeningRequired', label: 'Tenant Screening Required', description: 'Require background checks for all applicants' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="checkbox"
                          name={`managementPreferences.${setting.key}`}
                          checked={formData.managementPreferences[setting.key]}
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

                  {/* Policy Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Deposit Policy
                      </label>
                      <select
                        name="managementPreferences.depositPolicy"
                        value={formData.managementPreferences.depositPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="standard">Standard (2-3 months)</option>
                        <option value="flexible">Flexible (negotiable)</option>
                        <option value="strict">Strict (fixed terms)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pet Policy
                      </label>
                      <select
                        name="managementPreferences.petPolicy"
                        value={formData.managementPreferences.petPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="allowed">Pets Allowed</option>
                        <option value="not-allowed">No Pets</option>
                        <option value="case-by-case">Case by Case</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Smoking Policy
                      </label>
                      <select
                        name="managementPreferences.smokingPolicy"
                        value={formData.managementPreferences.smokingPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="allowed">Smoking Allowed</option>
                        <option value="not-allowed">No Smoking</option>
                        <option value="outdoor-only">Outdoor Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Settings Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Financial Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Configure payment methods and financial policies
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Accepted Payment Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.financialSettings.preferredPaymentMethods.includes(method.value)}
                            onChange={() => handleArrayToggle('financialSettings', 'preferredPaymentMethods', method.value)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Financial Policies */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Security Deposit (Months)
                      </label>
                      <input
                        type="number"
                        name="financialSettings.securityDepositMonths"
                        value={formData.financialSettings.securityDepositMonths}
                        onChange={handleInputChange}
                        min="0"
                        max="6"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Advance Rent (Months)
                      </label>
                      <input
                        type="number"
                        name="financialSettings.advanceRentMonths"
                        value={formData.financialSettings.advanceRentMonths}
                        onChange={handleInputChange}
                        min="0"
                        max="12"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="financialSettings.lateFeePolicy"
                        checked={formData.financialSettings.lateFeePolicy}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                          Late Fee Policy
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Charge late fees for overdue rent
                        </p>
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
                      Save Business Profile
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

export default OwnerProfilePage;