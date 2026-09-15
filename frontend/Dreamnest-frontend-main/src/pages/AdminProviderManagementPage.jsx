import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container';
import Button from '../components/Button';

const AdminProviderManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderModal, setShowProviderModal] = useState(false);
  
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
      navigate('/unauthorized');
      return;
    }

    // Load provider data
    const loadProviderData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock service provider database with detailed information
      setProviders([
        {
          id: 1,
          name: 'CleanPro Services',
          email: 'info@cleanpro.com',
          phone: '+880 1716-789012',
          address: 'Wari, Dhaka',
          services: ['House Cleaning', 'Deep Cleaning', 'Office Cleaning'],
          status: 'active',
          verificationStatus: 'verified',
          joinDate: '2024-01-08',
          lastActive: '2024-09-27',
          rating: 4.8,
          totalReviews: 32,
          completedJobs: 45,
          activeJobs: 3,
          earnings: 125000,
          certifications: ['Cleaning Certificate', 'Safety Training'],
          businessLicense: 'DH-2024-001234',
          description: 'Professional cleaning services with 5+ years experience. Trained staff, eco-friendly products.',
          issues: [],
          performance: {
            responseTime: '2 hours',
            completionRate: 98,
            customerSatisfaction: 4.8,
            repeatCustomers: 65
          }
        },
        {
          id: 2,
          name: 'TechFix Solutions',
          email: 'contact@techfix.com',
          phone: '+880 1717-890123',
          address: 'Gulshan, Dhaka',
          services: ['Electronics Repair', 'AC Maintenance', 'Appliance Repair'],
          status: 'active',
          verificationStatus: 'verified',
          joinDate: '2024-02-15',
          lastActive: '2024-09-26',
          rating: 4.6,
          totalReviews: 28,
          completedJobs: 38,
          activeJobs: 2,
          earnings: 95000,
          certifications: ['Electronics Technician', 'AC Repair Specialist'],
          businessLicense: 'DH-2024-002456',
          description: 'Expert electronics and appliance repair services. Quick response, quality work guaranteed.',
          issues: [],
          performance: {
            responseTime: '4 hours',
            completionRate: 95,
            customerSatisfaction: 4.6,
            repeatCustomers: 58
          }
        },
        {
          id: 3,
          name: 'GreenThumb Gardening',
          email: 'info@greenthumb.com',
          phone: '+880 1718-901234',
          address: 'Dhanmondi, Dhaka',
          services: ['Garden Maintenance', 'Landscaping', 'Plant Care'],
          status: 'pending',
          verificationStatus: 'pending',
          joinDate: '2024-09-20',
          lastActive: '2024-09-25',
          rating: 0,
          totalReviews: 0,
          completedJobs: 0,
          activeJobs: 0,
          earnings: 0,
          certifications: ['Horticulture Diploma'],
          businessLicense: 'DH-2024-003789',
          description: 'New gardening service provider specializing in residential garden maintenance and landscaping.',
          issues: ['Missing insurance documents', 'Incomplete portfolio'],
          performance: {
            responseTime: 'N/A',
            completionRate: 0,
            customerSatisfaction: 0,
            repeatCustomers: 0
          }
        },
        {
          id: 4,
          name: 'HandyPro Maintenance',
          email: 'service@handypro.com',
          phone: '+880 1719-012345',
          address: 'Uttara, Dhaka',
          services: ['Plumbing', 'Electrical Work', 'Home Maintenance'],
          status: 'suspended',
          verificationStatus: 'rejected',
          joinDate: '2024-08-10',
          lastActive: '2024-09-15',
          rating: 3.2,
          totalReviews: 15,
          completedJobs: 12,
          activeJobs: 0,
          earnings: 35000,
          certifications: ['Basic Plumbing'],
          businessLicense: 'EXPIRED-2024-001',
          description: 'General maintenance services for residential properties.',
          issues: ['Expired business license', 'Multiple customer complaints', 'Poor service quality'],
          performance: {
            responseTime: '12 hours',
            completionRate: 75,
            customerSatisfaction: 3.2,
            repeatCustomers: 20
          }
        },
        {
          id: 5,
          name: 'SecureGuard Services',
          email: 'admin@secureguard.com',
          phone: '+880 1720-123456',
          address: 'Banani, Dhaka',
          services: ['Security Services', 'CCTV Installation', 'Access Control'],
          status: 'under_review',
          verificationStatus: 'pending',
          joinDate: '2024-09-10',
          lastActive: '2024-09-27',
          rating: 4.5,
          totalReviews: 8,
          completedJobs: 5,
          activeJobs: 1,
          earnings: 45000,
          certifications: ['Security License', 'CCTV Training'],
          businessLicense: 'DH-2024-004567',
          description: 'Professional security services with trained personnel and modern equipment.',
          issues: ['Background verification pending'],
          performance: {
            responseTime: '1 hour',
            completionRate: 100,
            customerSatisfaction: 4.5,
            repeatCustomers: 75
          }
        },
        {
          id: 6,
          name: 'FoodCraft Catering',
          email: 'orders@foodcraft.com',
          phone: '+880 1721-234567',
          address: 'Bashundhara, Dhaka',
          services: ['Event Catering', 'Home Chef', 'Food Delivery'],
          status: 'active',
          verificationStatus: 'verified',
          joinDate: '2024-03-22',
          lastActive: '2024-09-27',
          rating: 4.9,
          totalReviews: 42,
          completedJobs: 55,
          activeJobs: 8,
          earnings: 185000,
          certifications: ['Food Safety Certificate', 'Culinary Arts Diploma'],
          businessLicense: 'DH-2024-005678',
          description: 'Premium catering services for all occasions. Fresh ingredients, expert chefs, timely delivery.',
          issues: [],
          performance: {
            responseTime: '30 minutes',
            completionRate: 99,
            customerSatisfaction: 4.9,
            repeatCustomers: 80
          }
        }
      ]);
      setLoading(false);
    };

    loadProviderData();
  }, [user, navigate]);

  const handleProviderAction = (action, providerId) => {
    setProviders(providers.map(p => {
      if (p.id === providerId) {
        switch (action) {
          case 'approve':
            return { ...p, verificationStatus: 'verified', status: 'active' };
          case 'reject':
            return { ...p, verificationStatus: 'rejected', status: 'suspended' };
          case 'suspend':
            return { ...p, status: 'suspended' };
          case 'activate':
            return { ...p, status: 'active' };
          case 'review':
            return { ...p, status: 'under_review' };
          default:
            return p;
        }
      }
      return p;
    }));
  };

  const filteredProviders = providers.filter(provider => {
    const matchesStatus = selectedStatus === 'all' || provider.status === selectedStatus;
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'suspended': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'under_review': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'under_review': return 'Under Review';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading provider management...</span>
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
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="p-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Service Provider Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Verify and monitor service providers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Providers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{providers.length}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {providers.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {providers.filter(p => p.verificationStatus === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {providers.filter(p => p.status === 'under_review').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {providers.filter(p => p.issues && p.issues.length > 0).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search providers by name, email, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Provider Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Services</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Verification</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Performance</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {provider.name}
                            </p>
                            {provider.issues && provider.issues.length > 0 && (
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {provider.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {provider.services.slice(0, 2).map((service, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs mr-1">
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{provider.services.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {provider.rating > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {getRatingStars(provider.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {provider.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({provider.totalReviews})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No reviews</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                        {getStatusDisplayName(provider.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(provider.verificationStatus)}`}>
                        {provider.verificationStatus.charAt(0).toUpperCase() + provider.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {provider.completedJobs} completed
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {provider.performance.completionRate}% success rate
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setShowProviderModal(true);
                          }}
                        >
                          View
                        </Button>
                        {provider.verificationStatus === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProviderAction('approve', provider.id)}
                              className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProviderAction('reject', provider.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {provider.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProviderAction('suspend', provider.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                          >
                            Suspend
                          </Button>
                        )}
                        {provider.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProviderAction('activate', provider.id)}
                            className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">No service providers found matching your criteria</p>
            </div>
          )}
        </div>
      </Container>

      {/* Provider Detail Modal */}
      {showProviderModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedProvider.name}
                    </h3>
                    {selectedProvider.issues && selectedProvider.issues.length > 0 && (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{selectedProvider.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProvider.status)}`}>
                      {getStatusDisplayName(selectedProvider.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(selectedProvider.verificationStatus)}`}>
                      {selectedProvider.verificationStatus.charAt(0).toUpperCase() + selectedProvider.verificationStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowProviderModal(false)}
                  className="p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Provider Details */}
              <div className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProvider.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Address:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProvider.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                        <span className="text-gray-900 dark:text-white">{new Date(selectedProvider.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Active:</span>
                        <span className="text-gray-900 dark:text-white">{new Date(selectedProvider.lastActive).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Business License:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProvider.businessLicense}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Business Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Earnings:</span>
                        <span className="font-bold text-gray-900 dark:text-white">৳{selectedProvider.earnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Completed Jobs:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProvider.completedJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Active Jobs:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProvider.activeJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {getRatingStars(selectedProvider.rating)}
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            {selectedProvider.rating > 0 ? `${selectedProvider.rating.toFixed(1)} (${selectedProvider.totalReviews} reviews)` : 'No reviews'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {selectedProvider.description}
                  </p>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedProvider.performance.responseTime}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedProvider.performance.completionRate}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedProvider.performance.customerSatisfaction}/5</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Repeat Customers</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedProvider.performance.repeatCustomers}%</p>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {selectedProvider.issues && selectedProvider.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Issues Identified
                    </h4>
                    <div className="space-y-2">
                      {selectedProvider.issues.map((issue, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <p className="text-red-800 dark:text-red-200">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Admin Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProvider.verificationStatus === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            handleProviderAction('approve', selectedProvider.id);
                            setSelectedProvider({...selectedProvider, verificationStatus: 'verified', status: 'active'});
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve Provider
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleProviderAction('reject', selectedProvider.id);
                            setSelectedProvider({...selectedProvider, verificationStatus: 'rejected', status: 'suspended'});
                          }}
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                        >
                          Reject Provider
                        </Button>
                      </>
                    )}

                    {selectedProvider.status === 'active' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleProviderAction('suspend', selectedProvider.id);
                          setSelectedProvider({...selectedProvider, status: 'suspended'});
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                      >
                        Suspend Provider
                      </Button>
                    )}

                    {selectedProvider.status === 'suspended' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleProviderAction('activate', selectedProvider.id);
                          setSelectedProvider({...selectedProvider, status: 'active'});
                        }}
                        className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
                      >
                        Reactivate Provider
                      </Button>
                    )}

                    <Button variant="outline">
                      Contact Provider
                    </Button>

                    <Button variant="outline">
                      View Provider Profile
                    </Button>

                    <Button variant="outline">
                      Performance Report
                    </Button>

                    <Button variant="outline">
                      Activity Log
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProviderManagementPage;