import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import {
  AdminOnlyRoute,
  OwnerOnlyRoute,
  ProviderOnlyRoute,
  RenterOnlyRoute,
  AuthenticatedRoute,
} from "./components/ProtectedRoute.jsx";
import SmartDashboardRedirect from "./components/SmartDashboardRedirect.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ServiceCategoryPage from "./pages/ServiceCategoryPage.jsx";
import ServiceProviderProfilePage from "./pages/ServiceProviderProfilePage.jsx";
import ServiceBookingFormPage from "./pages/ServiceBookingFormPage.jsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.jsx";
import ReviewsOverviewPage from "./pages/ReviewsOverviewPage.jsx";
import PropertyReviewsPage from "./pages/PropertyReviewsPage.jsx";
import ServiceProviderReviewsPage from "./pages/ServiceProviderReviewsPage.jsx";
import WriteReviewPage from "./pages/WriteReviewPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import OwnerDashboardPage from "./pages/OwnerDashboardPage.jsx";
import ServiceProviderDashboardPage from "./pages/ServiceProviderDashboardPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminUserManagementPage from "./pages/AdminUserManagementPage.jsx";
import AdminPropertyManagementPage from "./pages/AdminPropertyManagementPage.jsx";
import AdminProviderManagementPage from "./pages/AdminProviderManagementPage.jsx";
import AdminReviewModerationPage from "./pages/AdminReviewModerationPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RenterProfilePage from "./pages/RenterProfilePage.jsx";
import OwnerProfilePage from "./pages/OwnerProfilePage.jsx";
import ProviderProfilePage from "./pages/ProviderProfilePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import CookiePage from "./pages/CookiePage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route
              path="/services/:category"
              element={<ServiceCategoryPage />}
            />
            <Route
              path="/services/:category/:providerId"
              element={<ServiceProviderProfilePage />}
            />
            <Route
              path="/properties/:id/reviews"
              element={<PropertyReviewsPage />}
            />
            <Route
              path="/services/:category/:providerId/reviews"
              element={<ServiceProviderReviewsPage />}
            />
            <Route path="/reviews" element={<ReviewsOverviewPage />} />

            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={<SmartDashboardRedirect />} />
            <Route
              path="/dashboard/renter"
              element={
                <RenterOnlyRoute>
                  <DashboardPage />
                </RenterOnlyRoute>
              }
            />
            <Route
              path="/dashboard/owner"
              element={
                <OwnerOnlyRoute>
                  <OwnerDashboardPage />
                </OwnerOnlyRoute>
              }
            />
            <Route
              path="/dashboard/provider"
              element={
                <ProviderOnlyRoute>
                  <ServiceProviderDashboardPage />
                </ProviderOnlyRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminOnlyRoute>
                  <AdminDashboardPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminOnlyRoute>
                  <AdminUserManagementPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <AdminOnlyRoute>
                  <AdminPropertyManagementPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/providers"
              element={
                <AdminOnlyRoute>
                  <AdminProviderManagementPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <AdminOnlyRoute>
                  <AdminReviewModerationPage />
                </AdminOnlyRoute>
              }
            />

            {/* Profile Routes - Role-specific */}
            <Route
              path="/profile"
              element={
                <AuthenticatedRoute>
                  <ProfilePage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/profile/renter"
              element={
                <RenterOnlyRoute>
                  <RenterProfilePage />
                </RenterOnlyRoute>
              }
            />
            <Route
              path="/profile/owner"
              element={
                <OwnerOnlyRoute>
                  <OwnerProfilePage />
                </OwnerOnlyRoute>
              }
            />
            <Route
              path="/profile/provider"
              element={
                <ProviderOnlyRoute>
                  <ProviderProfilePage />
                </ProviderOnlyRoute>
              }
            />

            {/* Booking and Review Routes - Require Authentication */}
            <Route
              path="/services/:category/:providerId/book"
              element={
                <AuthenticatedRoute>
                  <ServiceBookingFormPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/booking/confirmation/:bookingId"
              element={
                <AuthenticatedRoute>
                  <BookingConfirmationPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/reviews/write"
              element={
                <AuthenticatedRoute>
                  <WriteReviewPage />
                </AuthenticatedRoute>
              }
            />

            {/* Information & Support Routes */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Legal & Compliance Routes */}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePage />} />

            {/* System Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
