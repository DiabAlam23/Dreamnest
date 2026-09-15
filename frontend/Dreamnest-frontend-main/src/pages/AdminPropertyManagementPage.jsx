import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container';
import Button from '../components/Button';

const AdminPropertyManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
      navigate('/unauthorized');
      return;
    }

    // Load property data
    const loadPropertyData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock property database with detailed information
      setProperties([
        {
          id: 1,
          title: 'Modern 3BR Apartment in Gulshan',
          address: 'Road 12, Gulshan 1, Dhaka',
          owner: 'Sarah Ahmed',
          ownerEmail: 'sarah.ahmed@example.com',
          price: 45000,
          bedrooms: 3,
          bathrooms: 2,
          area: 1200,
          status: 'active',
          verificationStatus: 'verified',
          listingDate: '2024-08-15',
          lastUpdated: '2024-09-20',
          views: 234,
          inquiries: 12,
          bookings: 3,
          images: 8,
          description: 'Beautiful modern apartment with city view, fully furnished, parking available.',
          amenities: ['Parking', 'Generator', 'Security', 'Gym'],
          issues: []
        },
        {
          id: 2,
          title: 'Cozy 2BR Flat in Dhanmondi',
          address: 'Road 8, Dhanmondi, Dhaka',
          owner: 'Dr. Rahman Khan',
          ownerEmail: 'rahman.khan@example.com',
          price: 32000,
          bedrooms: 2,
          bathrooms: 2,
          area: 950,
          status: 'pending',
          verificationStatus: 'pending',
          listingDate: '2024-09-25',
          lastUpdated: '2024-09-25',
          views: 45,
          inquiries: 2,
          bookings: 0,
          images: 5,
          description: 'Comfortable apartment near university, good transport links, quiet neighborhood.',
          amenities: ['Parking', 'Security'],
          issues: ['Missing verification documents', 'Incomplete property details']
        },
        {
          id: 3,
          title: 'Luxury 4BR Penthouse in Banani',
          address: 'Road 11, Banani, Dhaka',
          owner: 'Mr. Karim Hassan',
          ownerEmail: 'karim.hassan@example.com',
          price: 85000,
          bedrooms: 4,
          bathrooms: 3,
          area: 1800,
          status: 'active',
          verificationStatus: 'verified',
          listingDate: '2024-07-10',
          lastUpdated: '2024-09-15',
          views: 456,
          inquiries: 28,
          bookings: 8,
          images: 12,
          description: 'Premium penthouse with rooftop garden, modern amenities, prime location.',
          amenities: ['Parking', 'Generator', 'Security', 'Gym', 'Swimming Pool', 'Rooftop Garden'],
          issues: []
        },
        {
          id: 4,
          title: 'Studio Apartment Near Airport',
          address: 'Uttara Sector 7, Dhaka',
          owner: 'Ms. Fatima Ali',
          ownerEmail: 'fatima.ali@example.com',
          price: 18000,
          bedrooms: 1,
          bathrooms: 1,
          area: 450,
          status: 'suspended',
          verificationStatus: 'rejected',
          listingDate: '2024-09-01',
          lastUpdated: '2024-09-18',
          views: 89,
          inquiries: 3,
          bookings: 0,
          images: 3,
          description: 'Compact studio perfect for single professionals, close to airport.',
          amenities: ['Parking', 'Security'],
          issues: ['Misleading photos', 'Price discrepancy', 'Missing amenities']
        },
        {
          id: 5,
          title: 'Family Home in Bashundhara',
          address: 'Block E, Bashundhara R/A, Dhaka',
          owner: 'Mr. Ahmed Rahman',
          ownerEmail: 'ahmed.rahman@example.com',
          price: 65000,
          bedrooms: 4,
          bathrooms: 3,
          area: 1500,
          status: 'active',
          verificationStatus: 'verified',
          listingDate: '2024-06-20',
          lastUpdated: '2024-09-10',
          views: 312,
          inquiries: 18,
          bookings: 5,
          images: 10,
          description: 'Spacious family home with garden, quiet residential area, excellent schools nearby.',
          amenities: ['Parking', 'Garden', 'Security', 'Playground'],
          issues: []
        },
        {
          id: 6,
          title: 'Commercial Space in Motijheel',
          address: 'Dilkusha C/A, Motijheel, Dhaka',
          owner: 'Business Properties Ltd',
          ownerEmail: 'info@businessproperties.com',
          price: 55000,
          bedrooms: 0,
          bathrooms: 2,
          area: 800,
          status: 'under_review',
          verificationStatus: 'pending',
          listingDate: '2024-09-20',
          lastUpdated: '2024-09-22',
          views: 67,
          inquiries: 5,
          bookings: 0,
          images: 6,
          description: 'Prime commercial space in business district, suitable for offices or showrooms.',
          amenities: ['Parking', 'Generator', 'Security', 'Elevator'],
          issues: ['Zoning verification required', 'Commercial license pending']
        }
      ]);
      setLoading(false);
    };

    loadPropertyData();
  }, [user, navigate]);

  const handlePropertyAction = (action, propertyId) => {
    setProperties(properties.map(p => {
      if (p.id === propertyId) {
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

  const filteredProperties = properties.filter(property => {
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading property management...</span>
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Property Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Oversee and verify property listings
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {properties.filter(p => p.status === 'active').length}
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
                  {properties.filter(p => p.verificationStatus === 'pending').length}
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
                  {properties.filter(p => p.status === 'under_review').length}
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
                  {properties.filter(p => p.issues && p.issues.length > 0).length}
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
                  placeholder="Search properties by title, address, or owner..."
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

        {/* Property Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Owner</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Verification</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Activity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {property.title}
                          </p>
                          {property.issues && property.issues.length > 0 && (
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {property.address}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {property.bedrooms}BR • {property.bathrooms}BA • {property.area} sqft
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {property.owner}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {property.ownerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ৳{property.price.toLocaleString()}/mo
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {getStatusDisplayName(property.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(property.verificationStatus)}`}>
                        {property.verificationStatus.charAt(0).toUpperCase() + property.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.views} views
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {property.inquiries} inquiries • {property.bookings} bookings
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyModal(true);
                          }}
                        >
                          View
                        </Button>
                        {property.verificationStatus === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePropertyAction('approve', property.id)}
                              className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePropertyAction('reject', property.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {property.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePropertyAction('suspend', property.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                          >
                            Suspend
                          </Button>
                        )}
                        {property.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePropertyAction('activate', property.id)}
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

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">No properties found matching your criteria</p>
            </div>
          )}
        </div>
      </Container>

      {/* Property Detail Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedProperty.title}
                    </h3>
                    {selectedProperty.issues && selectedProperty.issues.length > 0 && (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{selectedProperty.address}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProperty.status)}`}>
                      {getStatusDisplayName(selectedProperty.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(selectedProperty.verificationStatus)}`}>
                      {selectedProperty.verificationStatus.charAt(0).toUpperCase() + selectedProperty.verificationStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPropertyModal(false)}
                  className="p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Property Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="font-bold text-gray-900 dark:text-white">৳{selectedProperty.price.toLocaleString()}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bedrooms:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bathrooms:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Area:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.area} sqft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Images:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.images} photos</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Owner Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.ownerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Listed:</span>
                        <span className="text-gray-900 dark:text-white">{new Date(selectedProperty.listingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                        <span className="text-gray-900 dark:text-white">{new Date(selectedProperty.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {selectedProperty.description}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity Stats */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Activity Statistics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProperty.views}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Inquiries</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProperty.inquiries}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProperty.bookings}</p>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {selectedProperty.issues && selectedProperty.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Issues Identified
                    </h4>
                    <div className="space-y-2">
                      {selectedProperty.issues.map((issue, index) => (
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
                    {selectedProperty.verificationStatus === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            handlePropertyAction('approve', selectedProperty.id);
                            setSelectedProperty({...selectedProperty, verificationStatus: 'verified', status: 'active'});
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve Property
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handlePropertyAction('reject', selectedProperty.id);
                            setSelectedProperty({...selectedProperty, verificationStatus: 'rejected', status: 'suspended'});
                          }}
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                        >
                          Reject Property
                        </Button>
                      </>
                    )}

                    {selectedProperty.status === 'active' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handlePropertyAction('suspend', selectedProperty.id);
                          setSelectedProperty({...selectedProperty, status: 'suspended'});
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                      >
                        Suspend Property
                      </Button>
                    )}

                    {selectedProperty.status === 'suspended' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handlePropertyAction('activate', selectedProperty.id);
                          setSelectedProperty({...selectedProperty, status: 'active'});
                        }}
                        className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
                      >
                        Reactivate Property
                      </Button>
                    )}

                    <Button variant="outline">
                      Contact Owner
                    </Button>

                    <Button variant="outline">
                      View Property Page
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

export default AdminPropertyManagementPage;