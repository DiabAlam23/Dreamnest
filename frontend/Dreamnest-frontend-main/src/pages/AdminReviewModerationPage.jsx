import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AdminReviewModerationPage = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    category: 'all',
    search: ''
  });
  const [moderationStats, setModerationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0
  });
  const [moderationAction, setModerationAction] = useState({
    action: '',
    reason: '',
    notes: ''
  });

  // Mock data for reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReviews = [
        {
          id: 1,
          property: {
            id: 101,
            title: "Modern Downtown Apartment",
            address: "123 Main St, Downtown"
          },
          reviewer: {
            id: 201,
            name: "John Smith",
            email: "john.smith@email.com",
            avatar: "/api/placeholder/40/40",
            totalReviews: 12
          },
          rating: 5,
          title: "Perfect stay for business trip",
          content: "The apartment was exactly as described. Great location, clean, and modern amenities. Host was very responsive. Would definitely book again!",
          images: ["/api/placeholder/200/150", "/api/placeholder/200/150"],
          status: "pending",
          category: "property",
          flagged: false,
          flags: [],
          createdAt: "2024-01-15T10:30:00Z",
          moderatedAt: null,
          moderatedBy: null,
          moderationNotes: "",
          sentiment: "positive",
          authenticity: "verified"
        },
        {
          id: 2,
          property: {
            id: 102,
            title: "Cozy Beach House",
            address: "456 Ocean Drive, Beachfront"
          },
          reviewer: {
            id: 202,
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            avatar: "/api/placeholder/40/40",
            totalReviews: 8
          },
          rating: 1,
          title: "Terrible experience - avoid!",
          content: "This place was disgusting! Dirty sheets, broken appliances, and the host was completely unresponsive. The photos are totally misleading. Worst vacation rental ever!",
          images: [],
          status: "flagged",
          category: "property",
          flagged: true,
          flags: [
            { type: "inappropriate_language", reporter: "system", date: "2024-01-14T15:20:00Z" },
            { type: "false_claims", reporter: "host", date: "2024-01-14T16:45:00Z" }
          ],
          createdAt: "2024-01-14T14:15:00Z",
          moderatedAt: null,
          moderatedBy: null,
          moderationNotes: "",
          sentiment: "negative",
          authenticity: "suspicious"
        },
        {
          id: 3,
          property: {
            id: 103,
            title: "Family-Friendly Cabin",
            address: "789 Forest Lane, Mountain View"
          },
          reviewer: {
            id: 203,
            name: "Mike Wilson",
            email: "mike.w@email.com",
            avatar: "/api/placeholder/40/40",
            totalReviews: 25
          },
          rating: 4,
          title: "Great family getaway",
          content: "Nice cabin with plenty of space for our family. Kids loved the outdoor area. Only minor issue was the wifi being a bit slow, but that's expected in the mountains.",
          images: ["/api/placeholder/200/150"],
          status: "approved",
          category: "property",
          flagged: false,
          flags: [],
          createdAt: "2024-01-13T09:45:00Z",
          moderatedAt: "2024-01-13T11:30:00Z",
          moderatedBy: "Admin User",
          moderationNotes: "Genuine review, good detail",
          sentiment: "positive",
          authenticity: "verified"
        },
        {
          id: 4,
          property: {
            id: 104,
            title: "Luxury City Penthouse",
            address: "321 High St, Financial District"
          },
          reviewer: {
            id: 204,
            name: "Emma Davis",
            email: "emma.d@email.com",
            avatar: "/api/placeholder/40/40",
            totalReviews: 3
          },
          rating: 3,
          title: "Average stay",
          content: "The penthouse has amazing views but the service was lacking. Took forever to get responses from the host. Price was too high for what you get.",
          images: [],
          status: "rejected",
          category: "property",
          flagged: false,
          flags: [],
          createdAt: "2024-01-12T16:20:00Z",
          moderatedAt: "2024-01-12T18:45:00Z",
          moderatedBy: "Admin User",
          moderationNotes: "Violation of review guidelines - price complaints not relevant",
          sentiment: "neutral",
          authenticity: "verified"
        },
        {
          id: 5,
          service: {
            id: 301,
            name: "Clean & Bright Cleaning",
            category: "Cleaning Service"
          },
          reviewer: {
            id: 205,
            name: "Lisa Brown",
            email: "lisa.b@email.com",
            avatar: "/api/placeholder/40/40",
            totalReviews: 15
          },
          rating: 5,
          title: "Excellent cleaning service",
          content: "The cleaning team was punctual, thorough, and professional. My apartment has never looked better. Will definitely use them again!",
          images: ["/api/placeholder/200/150", "/api/placeholder/200/150"],
          status: "pending",
          category: "service",
          flagged: false,
          flags: [],
          createdAt: "2024-01-11T13:10:00Z",
          moderatedAt: null,
          moderatedBy: null,
          moderationNotes: "",
          sentiment: "positive",
          authenticity: "verified"
        }
      ];

      setReviews(mockReviews);
      
      // Calculate stats
      const stats = mockReviews.reduce((acc, review) => {
        acc[review.status] = (acc[review.status] || 0) + 1;
        if (review.flagged) acc.flagged = (acc.flagged || 0) + 1;
        return acc;
      }, {});
      
      setModerationStats(stats);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filters.status === 'all' || review.status === filters.status;
    const matchesRating = filters.rating === 'all' || review.rating.toString() === filters.rating;
    const matchesCategory = filters.category === 'all' || review.category === filters.category;
    const matchesSearch = !filters.search || 
      review.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      review.content.toLowerCase().includes(filters.search.toLowerCase()) ||
      review.reviewer.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesRating && matchesCategory && matchesSearch;
  });

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handleModerateReview = (review) => {
    setSelectedReview(review);
    setModerationAction({ action: '', reason: '', notes: '' });
    setShowModerationModal(true);
  };

  const handleModerationSubmit = async () => {
    if (!moderationAction.action || !moderationAction.reason) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update review status
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === selectedReview.id
          ? {
              ...review,
              status: moderationAction.action,
              moderatedAt: new Date().toISOString(),
              moderatedBy: user.name,
              moderationNotes: moderationAction.notes
            }
          : review
      )
    );
    
    // Update stats
    setModerationStats(prevStats => ({
      ...prevStats,
      [selectedReview.status]: prevStats[selectedReview.status] - 1,
      [moderationAction.action]: (prevStats[moderationAction.action] || 0) + 1
    }));
    
    setShowModerationModal(false);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'flagged': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Review Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor, moderate, and manage user reviews across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">{moderationStats.pending || 0}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-600">{moderationStats.approved || 0}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{moderationStats.rejected || 0}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">{moderationStats.flagged || 0}</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="property">Properties</option>
                <option value="service">Services</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Reviews
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, content, or reviewer..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reviews ({filteredReviews.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Property/Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {review.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {review.content}
                        </div>
                        {review.flagged && (
                          <div className="flex items-center gap-1 mt-1">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-red-600 font-medium">Flagged</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {review.property?.title || review.service?.name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {review.property?.address || review.service?.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.reviewer.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {review.reviewer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {review.reviewer.totalReviews} reviews
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {getRatingStars(review.rating)}
                        <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(review)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                        {review.status === 'pending' || review.status === 'flagged' ? (
                          <button
                            onClick={() => handleModerateReview(review)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            Moderate
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Moderated</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">No reviews found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Review Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Review Header */}
                <div className="flex items-center gap-4">
                  <img
                    src={selectedReview.reviewer.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {selectedReview.reviewer.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {getRatingStars(selectedReview.rating)}
                        <span className="ml-1 font-medium">{selectedReview.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedReview.reviewer.totalReviews} reviews • {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Property/Service Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                    {selectedReview.category === 'property' ? 'Property' : 'Service'}
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedReview.property?.title || selectedReview.service?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {selectedReview.property?.address || selectedReview.service?.category}
                  </p>
                </div>

                {/* Review Content */}
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                    {selectedReview.title}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedReview.content}
                  </p>
                </div>

                {/* Review Images */}
                {selectedReview.images.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Images</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedReview.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Flags */}
                {selectedReview.flags.length > 0 && (
                  <div>
                    <h5 className="font-medium text-red-600 mb-2">Flags</h5>
                    <div className="space-y-2">
                      {selectedReview.flags.map((flag, index) => (
                        <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-800 dark:text-red-200">
                              {flag.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-red-600">
                              by {flag.reporter} • {new Date(flag.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status & Moderation Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                      {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                    </span>
                  </div>
                  {selectedReview.moderatedAt && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Moderated by {selectedReview.moderatedBy} on {new Date(selectedReview.moderatedAt).toLocaleDateString()}</p>
                      {selectedReview.moderationNotes && (
                        <p className="mt-1"><strong>Notes:</strong> {selectedReview.moderationNotes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      {showModerationModal && selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModerationModal(false)}></div>
            
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Moderate Review
                </h3>
                <button
                  onClick={() => setShowModerationModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Action
                  </label>
                  <select
                    value={moderationAction.action}
                    onChange={(e) => setModerationAction(prev => ({ ...prev, action: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select action...</option>
                    <option value="approved">Approve Review</option>
                    <option value="rejected">Reject Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason
                  </label>
                  <select
                    value={moderationAction.reason}
                    onChange={(e) => setModerationAction(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select reason...</option>
                    {moderationAction.action === 'approved' && (
                      <>
                        <option value="genuine_review">Genuine review</option>
                        <option value="helpful_content">Helpful content</option>
                        <option value="follows_guidelines">Follows guidelines</option>
                      </>
                    )}
                    {moderationAction.action === 'rejected' && (
                      <>
                        <option value="inappropriate_content">Inappropriate content</option>
                        <option value="spam">Spam or fake review</option>
                        <option value="guidelines_violation">Guidelines violation</option>
                        <option value="irrelevant_content">Irrelevant content</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={moderationAction.notes}
                    onChange={(e) => setModerationAction(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any additional notes about this moderation decision..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowModerationModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModerationSubmit}
                    disabled={!moderationAction.action || !moderationAction.reason || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Submit Decision'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewModerationPage;