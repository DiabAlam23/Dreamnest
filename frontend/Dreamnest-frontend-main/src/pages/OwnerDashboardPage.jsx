import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/Button';

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Mock properties data
  const properties = [
    {
      id: 1,
      title: "Modern 2BR in Dhanmondi",
      location: "Dhanmondi 15, Dhaka",
      rent: 25000,
      status: "occupied",
      tenant: "Ahmed Hassan",
      tenantPhone: "+880-1234-567890",
      occupancyDate: "2024-06-01",
      nextRentDue: "2025-11-01",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1350,
      rating: 4.8,
      totalReviews: 12
    },
    {
      id: 2,
      title: "Luxury 3BR Apartment",
      location: "Gulshan 2, Dhaka",
      rent: 45000,
      status: "occupied",
      tenant: "Sarah Khan",
      tenantPhone: "+880-1987-654321",
      occupancyDate: "2024-03-15",
      nextRentDue: "2025-11-15",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      rating: 4.9,
      totalReviews: 8
    },
    {
      id: 3,
      title: "Studio Near University",
      location: "Mohakhali, Dhaka",
      rent: 15000,
      status: "vacant",
      tenant: null,
      tenantPhone: null,
      occupancyDate: null,
      nextRentDue: null,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      rating: 4.2,
      totalReviews: 15,
      vacantSince: "2025-10-15"
    },
    {
      id: 4,
      title: "Family House in Uttara",
      location: "Uttara Sector 7, Dhaka",
      rent: 35000,
      status: "occupied",
      tenant: "Rahman Family",
      tenantPhone: "+880-1555-123456",
      occupancyDate: "2024-01-10",
      nextRentDue: "2025-11-10",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      rating: 4.6,
      totalReviews: 6
    }
  ];

  // Mock rental applications
  const rentalApplications = [
    {
      id: 1,
      propertyId: 3,
      propertyTitle: "Studio Near University",
      applicantName: "Fatima Ahmed",
      applicantPhone: "+880-1777-888999",
      applicationDate: "2025-10-25",
      preferredMoveIn: "2025-11-01",
      monthlyIncome: 45000,
      status: "pending"
    },
    {
      id: 2,
      propertyId: 3,
      propertyTitle: "Studio Near University", 
      applicantName: "Mohammad Ali",
      applicantPhone: "+880-1666-777888",
      applicationDate: "2025-10-23",
      preferredMoveIn: "2025-11-05",
      monthlyIncome: 50000,
      status: "pending"
    }
  ];

  // Mock maintenance requests
  const maintenanceRequests = [
    {
      id: 1,
      propertyId: 1,
      propertyTitle: "Modern 2BR in Dhanmondi",
      tenant: "Ahmed Hassan",
      issue: "Air conditioner not cooling properly",
      priority: "medium",
      status: "in-progress",
      reportedDate: "2025-10-20",
      description: "The main bedroom AC unit is running but not cooling effectively"
    },
    {
      id: 2,
      propertyId: 2,
      propertyTitle: "Luxury 3BR Apartment",
      tenant: "Sarah Khan",
      issue: "Kitchen sink faucet leaking",
      priority: "low",
      status: "pending",
      reportedDate: "2025-10-22",
      description: "Kitchen sink faucet has a slow drip that needs repair"
    },
    {
      id: 3,
      propertyId: 4,
      propertyTitle: "Family House in Uttara",
      tenant: "Rahman Family",
      issue: "Main gate lock broken",
      priority: "high",
      status: "pending",
      reportedDate: "2025-10-26",
      description: "Front gate electronic lock is not responding, security concern"
    }
  ];

  // Mock recent payments
  const recentPayments = [
    {
      id: 1,
      propertyTitle: "Modern 2BR in Dhanmondi",
      tenant: "Ahmed Hassan",
      amount: 25000,
      date: "2025-10-01",
      type: "rent",
      status: "received"
    },
    {
      id: 2,
      propertyTitle: "Luxury 3BR Apartment", 
      tenant: "Sarah Khan",
      amount: 45000,
      date: "2025-10-15",
      type: "rent",
      status: "received"
    },
    {
      id: 3,
      propertyTitle: "Family House in Uttara",
      tenant: "Rahman Family",
      amount: 35000,
      date: "2025-10-10",
      type: "rent",
      status: "received"
    }
  ];

  // Mock reviews needing response
  const reviewsNeedingResponse = [
    {
      id: 1,
      propertyId: 1,
      propertyTitle: "Modern 2BR in Dhanmondi",
      reviewer: "Previous Tenant",
      rating: 4,
      comment: "Great location and modern amenities. Only issue was occasional water pressure problems in the shower.",
      date: "2025-10-18"
    },
    {
      id: 2,
      propertyId: 2,
      propertyTitle: "Luxury 3BR Apartment",
      reviewer: "Sarah Khan",
      rating: 5,
      comment: "Excellent property with top-notch maintenance. Very responsive landlord. Highly recommend!",
      date: "2025-10-20"
    }
  ];

  // Calculate totals
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const totalMonthlyRevenue = properties.filter(p => p.status === 'occupied').reduce((sum, p) => sum + p.rent, 0);
  const avgRating = properties.reduce((sum, p) => sum + p.rating, 0) / properties.length;
  const vacantProperties = properties.filter(p => p.status === 'vacant').length;

  useEffect(() => {
    // Check if user is logged in and has owner role
    const userData = localStorage.getItem('dreamnest-user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'OWNER') {
      navigate('/dashboard');
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleApproveApplication = (applicationId) => {
    // In a real app, this would make an API call
    alert(`Application ${applicationId} approved`);
  };

  const handleRejectApplication = (applicationId) => {
    // In a real app, this would make an API call
    alert(`Application ${applicationId} rejected`);
  };

  const handleUpdateMaintenance = (requestId, newStatus) => {
    // In a real app, this would make an API call
    alert(`Maintenance request ${requestId} updated to ${newStatus}`);
  };

  const handleRespondToReview = (reviewId) => {
    // In a real app, this would open a response modal
    alert(`Opening response form for review ${reviewId}`);
  };

  if (!user) {
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
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Property Owner Dashboard
              {user.businessName && <span> • {user.businessName}</span>}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalProperties}
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Properties
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {occupiedProperties} occupied • {vacantProperties} vacant
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ৳{totalMonthlyRevenue.toLocaleString()}
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Monthly Revenue
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              From {occupiedProperties} occupied units
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {rentalApplications.length}
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rental Applications
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Pending review
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {avgRating.toFixed(1)}
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Rating
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Across all properties
            </div>
          </div>
        </div>

        {/* Property Portfolio & Rental Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property Portfolio */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Property Portfolio ({totalProperties})
              </h2>
              <Button 
                size="sm"
                onClick={() => alert('Add new property functionality coming soon')}
              >
                Add Property
              </Button>
            </div>
            
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {property.location} • {property.bedrooms}BR/{property.bathrooms}BA • {property.sqft} sqft
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ৳{property.rent.toLocaleString()}/mo
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'occupied' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {property.status === 'occupied' ? (
                        <span>Tenant: {property.tenant}</span>
                      ) : (
                        <span>Vacant since: {property.vacantSince}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{property.rating} ({property.totalReviews})</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {property.status === 'occupied' && property.tenantPhone && (
                        <a 
                          href={`tel:${property.tenantPhone}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          📞 Call
                        </a>
                      )}
                      <button className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Rental Applications ({rentalApplications.length})
              </h2>
            </div>
            
            {rentalApplications.length > 0 ? (
              <div className="space-y-4">
                {rentalApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {application.applicantName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {application.propertyTitle}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div>📅 Applied: {application.applicationDate}</div>
                      <div>🏠 Move-in: {application.preferredMoveIn}</div>
                      <div>💰 Income: ৳{application.monthlyIncome.toLocaleString()}</div>
                      <div>📞 {application.applicantPhone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveApplication(application.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectApplication(application.id)}
                      >
                        Reject
                      </Button>
                      <a 
                        href={`tel:${application.applicantPhone}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-auto"
                      >
                        📞 Call Applicant
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No pending applications
              </p>
            )}
          </div>
        </div>

        {/* Maintenance Requests & Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Maintenance Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Maintenance Requests ({maintenanceRequests.length})
              </h2>
            </div>
            
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {request.issue}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.propertyTitle} • {request.tenant}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : request.priority === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      }`}>
                        {request.priority} priority
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mb-3">
                    {request.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Reported: {request.reportedDate}
                    </p>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateMaintenance(request.id, 'in-progress')}
                        >
                          Start Work
                        </Button>
                      )}
                      {request.status === 'in-progress' && (
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateMaintenance(request.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Payments
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Full payment history coming soon')}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {payment.propertyTitle}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.tenant} • {payment.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      +৳{payment.amount.toLocaleString()}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Management */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Reviews Needing Response
            </h2>
            {reviewsNeedingResponse.length > 0 && (
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs px-2 py-1 rounded-full">
                {reviewsNeedingResponse.length} pending
              </span>
            )}
          </div>
          
          {reviewsNeedingResponse.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviewsNeedingResponse.map((review) => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {review.propertyTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.reviewer} • {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mb-3">
                    &quot;{review.comment}&quot;
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleRespondToReview(review.id)}
                  >
                    Respond to Review
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No reviews pending response
            </p>
          )}
        </div>

        {/* Property Management Tools */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Property Management Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => alert('Property listing management coming soon')}
            >
              <div className="flex flex-col items-start gap-2">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <div className="font-medium">Manage Listings</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Edit property details</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => alert('Financial reporting coming soon')}
            >
              <div className="flex flex-col items-start gap-2">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <div className="font-medium">Financial Reports</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Revenue & expenses</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => alert('Tenant management coming soon')}
            >
              <div className="flex flex-col items-start gap-2">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <div className="font-medium">Tenant Relations</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Communication tools</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => navigate('/reviews')}
            >
              <div className="flex flex-col items-start gap-2">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.438l-3.832 1.279a1 1 0 01-1.279-1.279L5.262 15.73A8.959 8.959 0 113 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                <div>
                  <div className="font-medium">All Reviews</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">View property feedback</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OwnerDashboardPage;