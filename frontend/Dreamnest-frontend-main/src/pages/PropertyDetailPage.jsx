import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import OpenStreetMap from '../components/OpenStreetMap.jsx';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const apiCall = async (endpoint, options = {}) => {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const token = localStorage.getItem('dreamnest-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    let mounted = true;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall(`/properties/${id}`);

        if (!mounted) return;

        if (response?.status === 'success' && response?.data?.property) {
          setProperty(response.data.property);
        } else {
          throw new Error(response?.message || 'Failed to fetch property details');
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching property:', err);
          setError(err.message || 'Failed to load property');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchProperty();
    return () => { mounted = false; };
  }, [id]);

  // Normalize API data so missing optional fields never crash the page.
  const safeProperty = useMemo(() => {
    if (!property) return null;

    const rawImages = Array.isArray(property.images) ? property.images : [];
    const images = rawImages.map((image) => {
      if (typeof image === 'string') return image;
      if (image && typeof image === 'object') {
        return image.url || image.src || image.imageUrl || null;
      }
      return null;
    }).filter(Boolean);

    const features = Array.isArray(property.features)
      ? property.features
      : Array.isArray(property.amenities) ? property.amenities : [];

    const nearbyPlaces = Array.isArray(property.nearbyPlaces)
      ? property.nearbyPlaces : [];

    const monthlyRent = Number(
      property.monthlyRent ?? property.price ?? property.rent ?? 0
    );

    const securityDeposit = Number(
      property.securityDeposit ?? property.deposit ?? 0
    );

    const contact = property.contact && typeof property.contact === 'object'
      ? property.contact : {};

    return {
      ...property,
      images,
      features,
      nearbyPlaces,
      monthlyRent,
      securityDeposit,
      contact,
      title: property.title || 'Property',
      location: property.location || property.address || 'Location not available',
      description: property.description || 'No description available.',
      bedrooms: property.bedrooms ?? 0,
      bathrooms: property.bathrooms ?? 0,
      sqft: property.sqft ?? property.area ?? 0,
      floor: property.floor ?? 'N/A',
      rating: Number(property.rating || 0),
      totalReviews: Number(property.totalReviews || 0),
    };
  }, [property]);

  const images = safeProperty?.images || [];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [safeProperty?.id]);

  const nextImage = () => {
    if (images.length) setCurrentImageIndex((p) => (p + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length) {
      setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
    }
  };

  const formatMoney = (value) => Number(value || 0).toLocaleString('en-BD');

  const formatDate = (value) => {
    if (!value) return 'Not specified';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Not specified' : d.toLocaleDateString();
  };

  const StarRating = ({ rating = 0, totalReviews = 0, clickable = false, onClick }) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(safeRating);
    const empty = 5 - full;

    const content = (
      <div className="flex items-center gap-1">
        <div className="flex">
          {Array.from({ length: full }).map((_, i) => (
            <span key={`f${i}`} className="w-5 h-5 text-yellow-400">★</span>
          ))}
          {Array.from({ length: empty }).map((_, i) => (
            <span key={`e${i}`} className="w-5 h-5 text-gray-300">★</span>
          ))}
        </div>
        {totalReviews > 0 && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {safeRating.toFixed(1)} ({totalReviews})
          </span>
        )}
      </div>
    );

    return clickable && onClick ? (
      <button type="button" onClick={onClick} className="p-1 rounded">
        {content}
      </button>
    ) : content;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Container className="py-8">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Container className="py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Property
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => window.location.reload()}>Try Again</Button>
              <Button variant="outline" onClick={() => navigate('/properties')}>
                Browse Properties
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!safeProperty) {
    return (
      <Container className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Property Not Found</h2>
        <Button onClick={() => navigate('/properties')}>Browse All Properties</Button>
      </Container>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen">
      {showLightbox && currentImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            className="absolute top-5 right-5 text-white text-3xl"
          >×</button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-5 text-white text-4xl">‹</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-5 text-white text-4xl">›</button>
            </>
          )}
          <img
            src={currentImage}
            alt={safeProperty.title}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Container className="py-8">
        <Button variant="outline" onClick={() => navigate('/properties')} className="mb-6">
          ← Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="relative h-96 lg:h-[500px] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              {currentImage ? (
                <button type="button" className="w-full h-full"
                  onClick={() => setShowLightbox(true)}>
                  <img src={currentImage} alt={safeProperty.title}
                    className="w-full h-full object-cover" />
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No images available
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button type="button" onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 text-2xl">
                    ‹
                  </button>
                  <button type="button" onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 text-2xl">
                    ›
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-6 gap-2 mt-4">
                {images.slice(0, 6).map((image, index) => (
                  <button type="button" key={`${image}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-16 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                    }`}>
                    <img src={image} alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {safeProperty.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                📍 {safeProperty.location}
              </p>
              <StarRating
                rating={safeProperty.rating}
                totalReviews={safeProperty.totalReviews}
                clickable={safeProperty.totalReviews > 0}
                onClick={() => navigate(`/properties/${safeProperty.id}/reviews`)}
              />
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-5">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ৳{formatMoney(safeProperty.monthlyRent)}
                <span className="text-base font-normal"> /month</span>
              </div>
              {safeProperty.originalPrice != null &&
                Number(safeProperty.originalPrice) > safeProperty.monthlyRent && (
                <div className="text-sm text-gray-500 line-through mt-1">
                  ৳{formatMoney(safeProperty.originalPrice)}
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Security Deposit: ৳{formatMoney(safeProperty.securityDeposit)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['🛏️', safeProperty.bedrooms, 'Bedrooms'],
                ['🚿', safeProperty.bathrooms, 'Bathrooms'],
                ['📐', safeProperty.sqft, 'sqft'],
                ['🏢', safeProperty.floor, 'Floor'],
              ].map(([icon, value, label]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-xl">{icon}</div>
                  <div className="font-bold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line">
                {safeProperty.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Features
              </h2>
              {safeProperty.features.length ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {safeProperty.features.slice(0, 12).map((feature, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm">
                      ✓ {typeof feature === 'string'
                        ? feature
                        : feature?.name || feature?.title || 'Feature'}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No feature information available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Location
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{safeProperty.location}</p>
              <div className="h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <OpenStreetMap
                  location={safeProperty.location}
                  latitude={safeProperty.latitude}
                  longitude={safeProperty.longitude}
                />
              </div>
            </div>

            {safeProperty.nearbyPlaces.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Nearby Places
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safeProperty.nearbyPlaces.map((place, index) => (
                    <div key={index}
                      className="flex justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div>
                        <div className="font-medium">{place?.name || place?.title || 'Nearby place'}</div>
                        {place?.type && <div className="text-sm text-gray-500">{place.type}</div>}
                      </div>
                      {place?.distance && (
                        <div className="text-sm text-primary-600">{place.distance}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-primary-900/20 rounded-2xl border-2 border-primary-100 dark:border-primary-800 p-6 shadow-lg">
              <div className="text-center mb-5">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{formatMoney(safeProperty.monthlyRent)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">per month</div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Security Deposit</span>
                  <span className="font-medium">৳{formatMoney(safeProperty.securityDeposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Available from</span>
                  <span className="font-medium">{formatDate(safeProperty.availableFrom)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last updated</span>
                  <span className="font-medium">{formatDate(safeProperty.lastUpdated)}</span>
                </div>
              </div>

              {user?.role === 'owner' ? (
                <div className="space-y-3">
                  <Button className="w-full" size="lg" variant="outline">Edit Property</Button>
                  <Button variant="secondary" className="w-full">View Analytics</Button>
                </div>
              ) : user?.role === 'admin' ? (
                <div className="space-y-3">
                  <Button className="w-full" size="lg" variant="outline">Verify Property</Button>
                  <Button variant="secondary" className="w-full">Manage Listing</Button>
                </div>
              ) : isAuthenticated ? (
                <Button className="w-full" size="lg">Contact Owner</Button>
              ) : (
                <Button className="w-full" size="lg" onClick={() => navigate('/login')}>
                  Login to Contact Owner
                </Button>
              )}

              {safeProperty.totalReviews > 0 && (
                <Button variant="outline" className="w-full mt-3"
                  onClick={() => navigate(`/properties/${safeProperty.id}/reviews`)}>
                  View All Reviews ({safeProperty.totalReviews})
                </Button>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">{safeProperty.contact.name || 'Property Owner'}</div>
                  <div className="text-sm text-gray-500">Property Agent</div>
                </div>
                {safeProperty.contact.phone && <div>📞 {safeProperty.contact.phone}</div>}
                {safeProperty.contact.email && <div className="break-all">✉️ {safeProperty.contact.email}</div>}
                {safeProperty.contact.whatsapp && <div>WhatsApp: {safeProperty.contact.whatsapp}</div>}
                {!safeProperty.contact.phone && !safeProperty.contact.email &&
                  !safeProperty.contact.whatsapp && (
                    <p className="text-sm text-gray-500">Contact information is not available.</p>
                  )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Property Stats
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Bedrooms</span><span>{safeProperty.bedrooms}</span></div>
                <div className="flex justify-between"><span>Bathrooms</span><span>{safeProperty.bathrooms}</span></div>
                <div className="flex justify-between"><span>Area</span><span>{safeProperty.sqft} sqft</span></div>
                <div className="flex justify-between"><span>Floor</span><span>{safeProperty.floor}</span></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
