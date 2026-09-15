import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/Button';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Form state for profile data
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      district: '',
      postalCode: ''
    },
    
    // Profile Settings
    avatar: null,
    bio: '',
    
    // Contact Preferences
    contactPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      bookingReminders: true,
      propertyUpdates: true,
      serviceUpdates: true
    },
    
    // Privacy Settings
    privacySettings: {
      profileVisibility: 'public', // public, private, contacts-only
      showPhoneNumber: true,
      showEmail: false,
      showAddress: false
    },
    
    // Account Security
    security: {
      twoFactorEnabled: false,
      passwordLastChanged: null,
      loginNotifications: true
    }
  });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('dreamnest-user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Pre-populate form with existing user data
    setFormData(prev => ({
      ...prev,
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      dateOfBirth: parsedUser.dateOfBirth || '',
      bio: parsedUser.bio || '',
      address: {
        street: parsedUser.address?.street || '',
        city: parsedUser.address?.city || 'Dhaka',
        district: parsedUser.address?.district || '',
        postalCode: parsedUser.address?.postalCode || ''
      },
      contactPreferences: {
        ...prev.contactPreferences,
        ...parsedUser.contactPreferences
      },
      privacySettings: {
        ...prev.privacySettings,
        ...parsedUser.privacySettings
      },
      security: {
        ...prev.security,
        passwordLastChanged: parsedUser.passwordLastChanged || 'Never',
        twoFactorEnabled: parsedUser.twoFactorEnabled || false
      }
    }));
    
    setIsLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage with new data
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
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    // In a real app, this would open a password change modal or redirect
    alert('Password change functionality coming soon');
  };

  const handleEnable2FA = () => {
    // In a real app, this would open 2FA setup flow
    setFormData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled
      }
    }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the account
      alert('Account deletion functionality coming soon');
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
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role !== 'RENTER' && (
              <Button 
                variant="outline" 
                onClick={() => navigate(`/profile/${user.role}`)}
              >
                {user?.role === 'OWNER' ? 'Business Profile' : 
                 user?.role === 'SERVICE_PROVIDER' ? 'Professional Profile' : 
                 'Advanced Settings'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
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
                Profile updated successfully!
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'personal', name: 'Personal Info', icon: '👤' },
                { id: 'preferences', name: 'Preferences', icon: '⚙️' },
                { id: 'privacy', name: 'Privacy', icon: '🔒' },
                { id: 'security', name: 'Security', icon: '🛡️' }
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
              
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Update your personal details and profile information
                    </p>
                  </div>

                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {formData.avatar ? (
                        <img 
                          src={formData.avatar} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {formData.name.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89L8.93 4.89A2 2 0 0110.93 4h2.14a2 2 0 012 .89L16.07 6.11A2 2 0 0017.93 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Profile Photo</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Choose a profile picture to help others recognize you
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Recommended: Square image, at least 200x200 pixels
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="+880-XXXX-XXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Tell others about yourself..."
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="House/Building number, Street name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <select
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Comilla">Comilla</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          District/Area
                        </label>
                        <input
                          type="text"
                          name="address.district"
                          value={formData.address.district}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="District or area name"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Contact Preferences
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Choose how you want to be contacted and what notifications you receive
                    </p>
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                    
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive general notifications via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive important updates via SMS' },
                      { key: 'bookingReminders', label: 'Booking Reminders', description: 'Get reminders about your bookings and appointments' },
                      { key: 'propertyUpdates', label: 'Property Updates', description: 'Notifications about saved properties and new listings' },
                      { key: 'serviceUpdates', label: 'Service Updates', description: 'Updates about service bookings and provider messages' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="checkbox"
                          name={`contactPreferences.${setting.key}`}
                          checked={formData.contactPreferences[setting.key]}
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

                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <input
                        type="checkbox"
                        name="contactPreferences.marketingEmails"
                        checked={formData.contactPreferences.marketingEmails}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                          Marketing Emails
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive promotional offers, new features, and platform updates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Privacy Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Control who can see your information and how it&apos;s shared
                    </p>
                  </div>

                  {/* Profile Visibility */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
                      <div className="space-y-3">
                        {[
                          { value: 'public', label: 'Public', description: 'Anyone can see your basic profile information' },
                          { value: 'contacts-only', label: 'Contacts Only', description: 'Only people you&apos;ve interacted with can see your profile' },
                          { value: 'private', label: 'Private', description: 'Hide your profile from public searches' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            <input
                              type="radio"
                              name="privacySettings.profileVisibility"
                              value={option.value}
                              checked={formData.privacySettings.profileVisibility === option.value}
                              onChange={handleInputChange}
                              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {option.label}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {option.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information Visibility */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'showPhoneNumber', label: 'Show Phone Number', description: 'Allow others to see your phone number in your profile' },
                          { key: 'showEmail', label: 'Show Email Address', description: 'Display your email address publicly' },
                          { key: 'showAddress', label: 'Show Address', description: 'Show your general location (city/area only)' }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <input
                              type="checkbox"
                              name={`privacySettings.${setting.key}`}
                              checked={formData.privacySettings[setting.key]}
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
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Account Security
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Manage your account security settings and authentication preferences
                    </p>
                  </div>

                  {/* Password Section */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last changed: {formData.security.passwordLastChanged}
                        </p>
                      </div>
                      <Button onClick={handleChangePassword}>
                        Change Password
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>• Use a strong, unique password</p>
                      <p>• Include uppercase, lowercase, numbers, and special characters</p>
                      <p>• Change your password regularly</p>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          formData.security.twoFactorEnabled 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {formData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <Button 
                          variant={formData.security.twoFactorEnabled ? 'outline' : 'primary'}
                          onClick={handleEnable2FA}
                        >
                          {formData.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                    {formData.security.twoFactorEnabled && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        ✓ Your account is protected with two-factor authentication
                      </div>
                    )}
                  </div>

                  {/* Login Notifications */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <input
                      type="checkbox"
                      name="security.loginNotifications"
                      checked={formData.security.loginNotifications}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                        Login Notifications
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when someone logs into your account from a new device
                      </p>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-medium text-red-900 dark:text-red-300 mb-4">
                      Danger Zone
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-900 dark:text-red-300">
                            Delete Account
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={handleDeleteAccount}
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          Delete Account
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
                      Save Changes
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

export default ProfilePage;