import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container';
import Button from '../components/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Renter specific
    preferences: {
      budgetRange: '',
      preferredArea: '',
      propertyType: '',
      moveInDate: ''
    },
    
    // Owner specific
    businessName: '',
    businessType: '',
    taxId: '',
    properties: [],
    
    // Service Provider specific
    companyName: '',
    serviceCategories: [],
    experience: '',
    certifications: [],
    serviceAreas: [],
    businessDescription: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    passwordsMatch: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Trigger password validation when passwords change
  useEffect(() => {
    if (formData.password || formData.confirmPassword) {
      validatePassword(formData.password, formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  // Password validation function
  const validatePassword = (password, confirmPassword) => {
    const validation = {
      hasMinLength: password.length >= 6,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      passwordsMatch: password && confirmPassword ? password === confirmPassword : false
    };
    setPasswordValidation(validation);
    return validation;
  };

  // Real-time password validation
  const validatePasswordFields = (field, value) => {
    if (field === 'password') {
      validatePassword(value, formData.confirmPassword);
    } else if (field === 'confirmPassword') {
      validatePassword(formData.password, value);
    }
  };

  const userTypes = [
    {
      id: 'renter',
      title: 'Renter',
      description: 'Find and rent properties, book services',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M12 17V3" />
        </svg>
      ),
      features: [
        'Search and browse properties',
        'Book cleaning and maintenance services',
        'Save favorite properties',
        'Write reviews and ratings'
      ]
    },
    {
      id: 'owner',
      title: 'Property Owner',
      description: 'List properties and manage rentals',
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      features: [
        'List and manage properties',
        'Screen and manage tenants',
        'Handle rental applications',
        'Track rental income and expenses'
      ]
    },
    {
      id: 'service_provider',
      title: 'Service Provider',
      description: 'Offer cleaning and maintenance services',
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      features: [
        'Create professional service profiles',
        'Manage bookings and schedules',
        'Build portfolio and reviews',
        'Set pricing and availability'
      ]
    }
  ];

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleInputChange = (field, value, nested = null) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Real-time password validation
    if (field === 'password' || field === 'confirmPassword') {
      validatePasswordFields(field, value);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 2) {
      // Common validation
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      else if (!/(?=.*[a-z])/.test(formData.password)) newErrors.password = 'Password must contain at least one lowercase letter';
      else if (!/(?=.*[A-Z])/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
      else if (!/(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain at least one number';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (step === 3) {
      // Role-specific validation
      if (userType === 'owner') {
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.businessType) newErrors.businessType = 'Business type is required';
      } else if (userType === 'service_provider') {
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (formData.serviceCategories.length === 0) newErrors.serviceCategories = 'Select at least one service category';
        if (!formData.experience) newErrors.experience = 'Experience level is required';
        if (!formData.businessDescription.trim()) newErrors.businessDescription = 'Business description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (userType === 'renter' && step === 2) {
        // Skip to step 4 for renters (they don't need step 3)
        setStep(4);
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (userType === 'renter' && step === 4) {
      setStep(2);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    
    try {
      // Use AuthContext register method
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: userType.toUpperCase(), // Convert to uppercase as expected by backend
        phone: formData.phone
        // Note: Role-specific data (businessName, serviceCategories, etc.) 
        // is not handled by the backend during registration
        // It should be collected through profile updates after registration
      };

      const user = await register(userData);
      
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'RENTER':
          navigate('/dashboard');
          break;
        case 'OWNER':
          navigate('/dashboard/owner');
          break;
        case 'SERVICE_PROVIDER':
          navigate('/dashboard/provider');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const totalSteps = userType === 'renter' ? 3 : 4;
    const currentStep = userType === 'renter' && step === 4 ? 3 : step;

    return (
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <React.Fragment key={i}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 <= currentStep 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                i + 1 < currentStep 
                  ? 'bg-primary-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderUserTypeSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Join DreamNest
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose your account type to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleUserTypeSelect(type.id)}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
          >
            <div className="text-center mb-4">
              <div className="inline-flex p-3 rounded-full bg-gray-50 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors mb-4">
                {type.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {type.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {type.description}
              </p>
            </div>
            
            <ul className="space-y-2 text-sm">
              {type.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about yourself
        </p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.firstName 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-200 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.lastName 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-200 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-200 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-200 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            placeholder="+880 1XXX-XXXXXX"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-200 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
            
            {/* Password validation indicators */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm">
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasMinLength 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {passwordValidation.hasMinLength ? '✓' : '○'}
                  </span>
                  <span className={passwordValidation.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasLowercase 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {passwordValidation.hasLowercase ? '✓' : '○'}
                  </span>
                  <span className={passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasUppercase 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {passwordValidation.hasUppercase ? '✓' : '○'}
                  </span>
                  <span className={passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasNumber 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {passwordValidation.hasNumber ? '✓' : '○'}
                  </span>
                  <span className={passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                    One number
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-200 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
            )}
            
            {/* Password match indicator */}
            {formData.confirmPassword && (
              <div className="mt-2">
                <div className="flex items-center text-sm">
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.passwordsMatch 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                  }`}>
                    {passwordValidation.passwordsMatch ? '✓' : '✗'}
                  </span>
                  <span className={passwordValidation.passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {passwordValidation.passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="secondary" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );

  const renderRoleSpecificInfo = () => {
    if (userType === 'owner') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us about your property business
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.businessName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-200 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                placeholder="Your business or legal entity name"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.businessType 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-200 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              >
                <option value="">Select business type</option>
                <option value="individual">Individual Property Owner</option>
                <option value="company">Property Management Company</option>
                <option value="investment">Investment/Development Company</option>
                <option value="cooperative">Housing Cooperative</option>
              </select>
              {errors.businessType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.businessType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax ID / Business Registration Number
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional - for business verification"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Verification Process
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    After registration, you&apos;ll need to verify your business documents and add your first property before you can start listing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit">
                Continue
              </Button>
            </div>
          </form>
        </div>
      );
    } else if (userType === 'service_provider') {
      const serviceCategories = [
        'Cleaning Services',
        'Plumbing',
        'Electrical',
        'Painting',
        'Carpentry',
        'HVAC',
        'Gardening/Landscaping',
        'Security Systems',
        'Appliance Repair',
        'General Maintenance'
      ];

      return (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Service Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us about your services
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company/Business Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.companyName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-200 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                placeholder="Your business name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Categories *
              </label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {serviceCategories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.serviceCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('serviceCategories', [...formData.serviceCategories, category]);
                        } else {
                          handleInputChange('serviceCategories', formData.serviceCategories.filter(c => c !== category));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
              {errors.serviceCategories && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serviceCategories}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Level *
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.experience 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-200 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              >
                <option value="">Select experience level</option>
                <option value="beginner">Less than 1 year</option>
                <option value="intermediate">1-5 years</option>
                <option value="experienced">5-10 years</option>
                <option value="expert">More than 10 years</option>
              </select>
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Description *
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.businessDescription 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-200 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                placeholder="Describe your services, specializations, and what makes your business unique"
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.businessDescription}</p>
              )}
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Profile Setup
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    After registration, you&apos;ll complete your profile with portfolio images, certifications, and service areas before going live.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit">
                Continue
              </Button>
            </div>
          </form>
        </div>
      );
    }

    return null;
  };

  const renderPreferences = () => {
    if (userType === 'renter') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Rental Preferences
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Help us show you the most relevant properties (optional)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.preferences.budgetRange}
                  onChange={(e) => handleInputChange('budgetRange', e.target.value, 'preferences')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Any budget</option>
                  <option value="0-15000">৳0 - ৳15,000</option>
                  <option value="15000-25000">৳15,000 - ৳25,000</option>
                  <option value="25000-40000">৳25,000 - ৳40,000</option>
                  <option value="40000-60000">৳40,000 - ৳60,000</option>
                  <option value="60000+">৳60,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Area
                </label>
                <select
                  value={formData.preferences.preferredArea}
                  onChange={(e) => handleInputChange('preferredArea', e.target.value, 'preferences')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Any area</option>
                  <option value="dhanmondi">Dhanmondi</option>
                  <option value="gulshan">Gulshan</option>
                  <option value="banani">Banani</option>
                  <option value="uttara">Uttara</option>
                  <option value="bashundhara">Bashundhara R/A</option>
                  <option value="mirpur">Mirpur</option>
                  <option value="mohammadpur">Mohammadpur</option>
                  <option value="wari">Wari</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.preferences.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value, 'preferences')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Any type</option>
                  <option value="studio">Studio Apartment</option>
                  <option value="1-bedroom">1 Bedroom</option>
                  <option value="2-bedroom">2 Bedroom</option>
                  <option value="3-bedroom">3 Bedroom</option>
                  <option value="4-bedroom">4+ Bedroom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Move-in Date
                </label>
                <input
                  type="date"
                  value={formData.preferences.moveInDate}
                  onChange={(e) => handleInputChange('moveInDate', e.target.value, 'preferences')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                    Smart Recommendations
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    These preferences help us show you the most relevant properties first. You can always change them later in your profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  disabled={loading}
                >
                  Skip Preferences
                </Button>
                <Button type="submit" loading={loading}>
                  Create Account
                </Button>
              </div>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Terms and Verification
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review and accept our terms to complete registration
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {userType.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Name:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.email}
              </span>
            </div>
            {userType === 'owner' && formData.businessName && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Business:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.businessName}
                </span>
              </div>
            )}
            {userType === 'service_provider' && formData.companyName && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Company:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.companyName}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 mt-1"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 mt-1"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              I would like to receive updates about new properties and services (optional)
            </span>
          </label>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                Verification Required
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {userType === 'owner' 
                  ? "You'll need to verify your identity and business documents before listing properties."
                  : userType === 'service_provider'
                  ? "You'll need to verify your identity and business credentials before offering services."
                  : "You'll receive an email verification link to activate your account."
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Create Account
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Container>
        {step > 1 && renderStepIndicator()}
        
        {step === 1 && renderUserTypeSelection()}
        {step === 2 && renderBasicInfo()}
        {step === 3 && renderRoleSpecificInfo()}
        {step === 4 && renderPreferences()}

        {step === 1 && (
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default RegisterPage;