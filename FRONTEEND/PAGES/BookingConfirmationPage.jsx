import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get booking data from navigation state or fetch from API
    if (location.state) {
      setBookingData(location.state);
    } else {
      // In a real app, fetch booking data by ID from API
      // For now, we'll show a generic confirmation
      setBookingData({
        bookingId,
        provider: { name: 'Service Provider' },
        service: { name: 'Service' },
        total: 0
      });
    }
  }, [bookingId, location.state]);

  if (!bookingData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Container className="flex-1 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const { provider, service, formData, total } = bookingData;

  return (
    <div className="flex flex-col min-h-screen">
      <Container className="flex-1 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your service has been successfully booked
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Booking Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
                <span className="font-mono font-semibold text-primary-600 dark:text-primary-400">
                  {bookingId}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Service Provider:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {provider.name}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Service:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {service.name}
                </span>
              </div>

              {formData?.selectedDate && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(formData.selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {formData?.selectedTime && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(() => {
                      const [hour, minute] = formData.selectedTime.split(':');
                      const hourNum = parseInt(hour);
                      const period = hourNum >= 12 ? 'PM' : 'AM';
                      const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
                      return `${displayHour}:${minute} ${period}`;
                    })()}
                  </span>
                </div>
              )}

              {formData?.customerName && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.customerName}
                  </span>
                </div>
              )}

              {formData?.customerPhone && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.customerPhone}
                  </span>
                </div>
              )}

              {formData?.customerAddress && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">
                    {formData.customerAddress}
                  </span>
                </div>
              )}

              {total && (
                <div className="flex justify-between py-3 border-t-2 border-gray-200 dark:border-gray-600">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                What happens next?
              </h3>
            </div>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>You&apos;ll receive a confirmation email with all booking details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>The service provider will contact you within their response time to confirm details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>The service team will arrive at your specified date and time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>After completion, you can rate and review the service</span>
              </li>
            </ul>
          </div>

          {/* Contact Provider */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Need to Contact the Provider?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Provider
              </Button>
              <Button variant="outline" className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Message
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/services" className="flex-1">
              <Button variant="outline" className="w-full">
                Book Another Service
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Need help with your booking?
            </p>
            <Button variant="ghost" size="sm">
              Contact Customer Support
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}