import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function ServiceBookingFormPage() {
  const { category, providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get('service');
  
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    selectedDate: '',
    selectedTime: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    specialRequests: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock provider data (same as in profile page)
  const mockProvider = {
    id: 'clean-pro-1',
    name: 'CleanPro Bangladesh',
    image: '/images/services/services_29.jpg',
    services: [
      {
        id: 'deep-cleaning',
        name: 'Deep Cleaning',
        description: 'Comprehensive deep cleaning service for your entire home',
        price: 3500,
        duration: '4-6 hours',
        includes: ['All rooms cleaning', 'Kitchen deep clean', 'Bathroom sanitization', 'Window cleaning', 'Appliance cleaning']
      },
      {
        id: 'regular-cleaning',
        name: 'Regular Cleaning',
        description: 'Weekly or bi-weekly maintenance cleaning',
        price: 2500,
        duration: '2-3 hours',
        includes: ['Dusting and vacuuming', 'Kitchen cleaning', 'Bathroom cleaning', 'Floor mopping', 'Trash removal']
      },
      {
        id: 'office-cleaning',
        name: 'Office Cleaning',
        description: 'Professional office and commercial space cleaning',
        price: 4000,
        duration: '3-5 hours',
        includes: ['Desk and surface cleaning', 'Floor maintenance', 'Restroom sanitization', 'Common area cleaning', 'Trash management']
      },
      {
        id: 'post-construction',
        name: 'Post Construction Cleaning',
        description: 'Specialized cleaning after construction or renovation',
        price: 5500,
        duration: '6-8 hours',
        includes: ['Debris removal', 'Dust elimination', 'Surface polishing', 'Window and fixture cleaning', 'Final touch-ups']
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProvider(mockProvider);
      
      const service = mockProvider.services.find(s => s.id === serviceId) || mockProvider.services[0];
      setSelectedService(service);
      
      setLoading(false);
    };

    fetchData();
  }, [providerId, serviceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ value: time24, label: time12 });
    }
    return slots;
  };

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    
    const basePrice = selectedService.price;
    const urgencyMultiplier = formData.urgency === 'urgent' ? 1.5 : 1;
    
    return Math.round(basePrice * urgencyMultiplier);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock booking ID
    const bookingId = 'BK' + Date.now().toString().slice(-6);
    
    // Navigate to confirmation page
    navigate(`/booking/confirmation/${bookingId}`, {
      state: {
        provider,
        service: selectedService,
        formData,
        total: calculateTotal(),
        bookingId
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="animate-pulse max-w-4xl mx-auto">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2 mb-6">
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  {i < 3 && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-64"></div>

            {/* Form skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
              <div>
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!provider || !selectedService) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The service you&apos;re trying to book doesn&apos;t exist.
          </p>
          <Button onClick={() => navigate('/services')}>
            Back to Services
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <button onClick={() => navigate('/services')} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Services
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => navigate(`/services/${category}`)} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Cleaning Services
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => navigate(`/services/${category}/${providerId}`)} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {provider.name}
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">
              Book Service
            </span>
          </nav>

          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Book {selectedService.name}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  {/* Service Selection */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Selected Service
                    </h2>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {selectedService.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {selectedService.description}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            Duration: {selectedService.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            ৳{selectedService.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          What&apos;s Included:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {selectedService.includes.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Schedule Service
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Preferred Date *
                        </label>
                        <select
                          name="selectedDate"
                          value={formData.selectedDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select a date</option>
                          {getNextAvailableDates().map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Preferred Time *
                        </label>
                        <select
                          name="selectedTime"
                          value={formData.selectedTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select a time</option>
                          {generateTimeSlots().map((slot) => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Urgency Level
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="urgency"
                            value="normal"
                            checked={formData.urgency === 'normal'}
                            onChange={handleInputChange}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Normal Service
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Standard pricing
                            </div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="urgency"
                            value="urgent"
                            checked={formData.urgency === 'urgent'}
                            onChange={handleInputChange}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Urgent Service
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +50% rush fee
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="+880 1234 567890"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Service Address *
                        </label>
                        <textarea
                          name="customerAddress"
                          value={formData.customerAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="Enter the complete address where service is needed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Additional Information
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Special Requests or Instructions
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Any specific requirements, areas of focus, or special instructions for the service provider..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Booking Summary
                  </h2>
                  
                  {/* Provider Info */}
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Available Now
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Service:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedService.name}
                      </span>
                    </div>
                    
                    {formData.selectedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(formData.selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    
                    {formData.selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {generateTimeSlots().find(slot => slot.value === formData.selectedTime)?.label}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedService.duration}
                      </span>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                      <span className="text-gray-900 dark:text-white">
                        ৳{selectedService.price.toLocaleString()}
                      </span>
                    </div>
                    
                    {formData.urgency === 'urgent' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rush Fee (50%):</span>
                        <span className="text-gray-900 dark:text-white">
                          ৳{Math.round(selectedService.price * 0.5).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-600 pt-2">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        ৳{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    You&apos;ll receive a confirmation email after booking
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}