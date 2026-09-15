import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function ReviewsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('recent');

  // Mock data for recent reviews
  const mockReviews = [
    {
      id: 1,
      type: 'property',
      targetId: 'prop-1',
      targetName: 'Luxury Apartment in Dhanmondi',
      targetImage: '/images/properties/properties_4.jpg',
      author: 'Sarah Ahmed',
      authorInitials: 'SA',
      rating: 5,
      title: 'Perfect Home for Our Family',
      content: 'We absolutely love this apartment! The location is perfect with great access to schools and shopping. The landlord is very responsive and the building management is excellent. Clean, safe, and exactly what we were looking for.',
      date: '2 days ago',
      verified: true,
      helpful: 24,
      category: 'rental'
    },
    {
      id: 2,
      type: 'service',
      targetId: 'clean-pro-1',
      targetName: 'CleanPro Bangladesh',
      targetImage: '/images/services/services_15.jpg',
      author: 'Mohammad Rahman',
      authorInitials: 'MR',
      rating: 4.5,
      title: 'Excellent Cleaning Service',
      content: 'The team arrived on time and did a thorough job cleaning our office space. They used eco-friendly products as promised and were very professional throughout. Will definitely book again.',
      date: '5 days ago',
      verified: true,
      helpful: 18,
      category: 'cleaning'
    },
    {
      id: 3,
      type: 'property',
      targetId: 'prop-2',
      targetName: 'Modern Studio in Gulshan',
      targetImage: '/images/properties/properties_5.jpg',
      author: 'Fatima Khan',
      authorInitials: 'FK',
      rating: 4,
      title: 'Great Location, Minor Issues',
      content: 'The studio is in an excellent location with easy access to everything. The space is modern and well-designed. Had some minor maintenance issues initially but the property manager resolved them quickly.',
      date: '1 week ago',
      verified: true,
      helpful: 12,
      category: 'sale'
    },
    {
      id: 4,
      type: 'service',
      targetId: 'fix-masters-1',
      targetName: 'FixMasters',
      targetImage: '/images/services/services_18.jpg',
      author: 'Ahmed Hassan',
      authorInitials: 'AH',
      rating: 5,
      title: 'Quick and Professional Repair',
      content: 'Had an urgent plumbing issue and they responded within an hour. The technician was knowledgeable, fixed the problem quickly, and explained everything clearly. Fair pricing and excellent service.',
      date: '1 week ago',
      verified: true,
      helpful: 31,
      category: 'maintenance'
    },
    {
      id: 5,
      type: 'property',
      targetId: 'prop-3',
      targetName: 'Family House in Uttara',
      targetImage: '/images/properties/properties_7.jpg',
      author: 'Rashida Begum',
      authorInitials: 'RB',
      rating: 4.5,
      title: 'Wonderful Family Home',
      content: 'This house has been perfect for our growing family. Spacious rooms, good natural light, and a lovely garden for the kids. The neighborhood is quiet and safe. Very happy with our choice.',
      date: '2 weeks ago',
      verified: false,
      helpful: 8,
      category: 'rental'
    },
    {
      id: 6,
      type: 'service',
      targetId: 'paint-experts-1',
      targetName: 'Paint Experts',
      targetImage: '/images/services/services_19.jpg',
      author: 'Nasir Khan',
      authorInitials: 'NK',
      rating: 4.5,
      title: 'Beautiful Interior Painting',
      content: 'The team did an amazing job painting our living room and bedrooms. Very neat work, protected all furniture properly, and finished exactly on schedule. The color consultation was also very helpful.',
      date: '2 weeks ago',
      verified: true,
      helpful: 15,
      category: 'painting'
    }
  ];

  // Mock featured testimonials
  const mockTestimonials = [
    {
      id: 1,
      author: 'Dr. Karim Abdullah',
      role: 'Medical Professional',
      avatar: '/images/avatars/avatars_1.jpg',
      content: 'DreamNest made finding our dream home incredibly easy. The platform is intuitive, the property listings are detailed and accurate, and the service providers they connect you with are top-notch.',
      rating: 5,
      propertyType: 'Luxury Villa Purchase'
    },
    {
      id: 2,
      author: 'Ms. Taslima Rahman',
      role: 'Business Owner',
      avatar: '/images/avatars/avatars_3.jpg',
      content: 'As a busy professional, I needed reliable service providers for my properties. DreamNest&apos;s service marketplace has been a game-changer - verified providers, transparent pricing, and consistent quality.',
      rating: 5,
      propertyType: 'Commercial Space Management'
    },
    {
      id: 3,
      author: 'Mr. Rezaul Karim',
      role: 'IT Executive',
      avatar: '/images/avatars/avatars_25.jpg',
      content: 'The rental process was smooth and transparent. Great selection of verified properties, and the integrated service providers made setting up our new home effortless. Highly recommend!',
      rating: 5,
      propertyType: 'Apartment Rental'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setReviews(mockReviews);
      setFeaturedTestimonials(mockTestimonials);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filterCategories = [
    { id: 'all', label: 'All Reviews', count: mockReviews.length },
    { id: 'property', label: 'Properties', count: mockReviews.filter(r => r.type === 'property').length },
    { id: 'service', label: 'Services', count: mockReviews.filter(r => r.type === 'service').length },
    { id: 'rental', label: 'Rentals', count: mockReviews.filter(r => r.category === 'rental').length },
    { id: 'sale', label: 'Sales', count: mockReviews.filter(r => r.category === 'sale').length }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'helpful', label: 'Most Helpful' },
    { id: 'rating', label: 'Highest Rated' }
  ];

  const getFilteredReviews = () => {
    let filtered = [...reviews];

    // Apply filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'property' || activeFilter === 'service') {
        filtered = filtered.filter(review => review.type === activeFilter);
      } else {
        filtered = filtered.filter(review => review.category === activeFilter);
      }
    }

    // Apply sort
    switch (activeSort) {
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
      default:
        // Already in recent order
        break;
    }

    return filtered;
  };

  const StarRating = ({ rating, size = 'sm' }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className={`relative ${starSize}`}>
          <svg className={`absolute ${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <svg className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return (
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-96 mx-auto"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-[600px] mx-auto"></div>
            </div>

            {/* Testimonials skeleton */}
            <div className="mb-16">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                ))}
              </div>
            </div>

            {/* Filters skeleton */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
              ))}
            </div>

            {/* Reviews skeleton */}
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const filteredReviews = getFilteredReviews();

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Community Reviews
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover what our community says about properties and services. Real experiences from real people.
          </p>
        </div>

        {/* Featured Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-800"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={testimonial.rating} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.propertyType}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Review Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {reviews.length}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Reviews
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              4.7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Rating
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              95%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Verified Reviews
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              24h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Response Time
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">
          <div className="flex flex-wrap gap-3">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
          
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reviews Feed */}
        <div className="space-y-6 mb-12">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Property/Service Image */}
                <img
                  src={review.targetImage}
                  alt={review.targetName}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {review.title}
                        </h3>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <Link
                        to={review.type === 'property' ? `/properties/${review.targetId}` : `/services/cleaning/${review.targetId}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                      >
                        {review.targetName}
                      </Link>
                    </div>
                    
                    <div className="text-right">
                      <StarRating rating={review.rating} />
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {review.date}
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {review.content}
                  </p>
                  
                  {/* Review Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold">
                          {review.authorInitials}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.author}
                        </span>
                      </div>
                      
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full capitalize">
                        {review.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful ({review.helpful})
                      </button>
                      
                      <button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Help others make informed decisions by sharing your experience with properties and services on DreamNest.
          </p>
          <Link to="/reviews/write">
            <Button variant="outline" className="bg-white text-primary-600 border-white hover:bg-primary-50">
              Write a Review
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}