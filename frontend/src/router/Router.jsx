import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts
import TaLayout from "../layout/TaLayout";
import BULayout from "../layout/BULayout";

// TA Components
import CandidateList from "../ta/CandidateList";
import HiredCandidates from "../ta/HiredCandidates";
import CandidateStatus from "../ta/CandidateStatus";

import AssignedCandidatePage from "../ta/AssignedPage";

import ActiveJobs from "../ta/ActiveJobs";
import ShortlistedHistory from "../ta/ShortlistedHistory";

// General Pages
import Unauthorized from "../pages/Unauthorized";
import LoginScreen from "../pages/authPage/Login";
import CandidateRegistration from "../pages/registration/Registrations";
import Feedback from "../pages/applications/Feedback";
import ScreeningFeedbackForm from "../pages/applications/ScreeningFeedbackForm ";
import TechnicalFeedbackForm from "../pages/applications/TechnicalFeedbackForm";
import ApplicationTracker from "../pages/applications/ApplicationTracker";
import UserPage from "../pages/user/User";
import Profile from "../pages/profile/Profile";
import FresherOnboardingForm from "../pages/onboardingForm/FresherOnboardingForm";
import ExperienceOnboardingForm from "../pages/onboardingForm/ExperienceOnboardingForm";
import OnboardingCandidates from "../ta/OnboardingCandidates";

// BU Components
import BUDashboard from "../bu/BUDashboard";
import ForgotPassword from "../components/ForgotPassword";
import ActiveJobsBu from "../BU/ActiveJobsBu";
// import Feeds from "../bu/Feeds";
import CandidateRegistrationDummy from "../pages/registration/Registration-dummy";
import JobDetailPage from "../components/JobDetailPage";
import OpeningJobCard from "../jobPost/OpeningJobCard";
import ViewCandidates from "../jobPost/ViewCandidates";

// Account Manager Components
import AccountDashboard from "../accounts/AccountDashboard";
import Invoice from "../accounts/Invoice";
import AccountLayout from "../layout/AccountLayout";
import InvoiceList from "../accounts/InvoiceList";
import Companies from "../accounts/Companies";
import CompanyInvoiceList from "../accounts/CompanyInvoiceList";
import FeedbackForm from "../feedback/FeedbackForm";

// Vendor Components
import VendorLayout from "../layout/VendorLayout";
import ApplicantsList from "../vendor/ApplicantsList";
import VendorDashboard from "../vendor/VendorDashboard";
import ActiveJobsVendor from "../vendor/ActiveJobsVendor";
import ProfileSubmissionForm from "../vendor/ProfileSubmissionForm";

// Sales Components
import SalesLayout from "../layout/SalesLayout";
import SalesDashboard from "../sales/SalesDashboard";
import CreatePostJob from "../sales/CreatePostJob";
import CreateCompany from "../sales/CreateCompany";
import Feeds from "../sales/Feeds";
import TaDashboard from "../ta/TaDashboard";
import ApplicantStatus from "../ta/ApplicantStatus";
import VendorCandidates from "../ta/VendorCandidates";
import AssignedVendorCandidates from "../ta/AssignedVendorCandidates";
import ReferredTalent from "../sales/ReferredTalent";
import ApproveCandidates from "../BU/ApproveCandidates";
import ReferredCandidates from "../BU/ReferredCandidates";
// import ShortlistedCandidateAllHR from "../hr/ShortlistedCandidateAllHR";

// Route Wrappers
const PrivateRoute = ({ isAuth }) =>
  isAuth ? <Outlet /> : <Navigate to="/login" replace />;
const PublicRoute = ({ isAuth }) =>
  !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
const AdminRoute = ({ user }) =>
  user?.role === "admin" || user?.role === "ta" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
const BURoute = ({ user }) =>
  user?.role === "bu" ? <Outlet /> : <Navigate to="/unauthorized" replace />;

const SalesRoute = ({ user }) =>
  user?.role === "sales" ? <Outlet /> : <Navigate to="/unauthorized" replace />;

const AccountManagerRoute = ({ user }) =>
  user?.role === "accounts" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );

const VendorRoute = ({ user }) =>
  user?.role === "vendor" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );

const AppRouter = ({ isAuth }) => {
  const user = useSelector((state) => state.user.userData);

  // Optional loading guard during initial Redux state setup
  if (isAuth && !user) return null;

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute isAuth={isAuth} />}>
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/candidate-registration"
          element={<CandidateRegistration />}
        />
        <Route
          path="/candidate-registration/form"
          element={<CandidateRegistrationDummy />}
        />
        <Route
          path="/fresher-onboarding-form/:candidateId"
          element={<FresherOnboardingForm />}
        />
        <Route
          path="/experienced-onboarding-form/:candidateId"
          element={<ExperienceOnboardingForm />}
        />
        <Route path="/feedback/:id" element={<Feedback />} />
        <Route
          path="/feedback-form/screening/:eventId"
          element={<ScreeningFeedbackForm />}
        />
        <Route
          path="/feedback-form/technical/:eventId"
          element={<TechnicalFeedbackForm />}
        />
        <Route path="/feedback" element={<FeedbackForm />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute isAuth={isAuth} />}>
        {/* HR/Admin Routes */}
        <Route element={<AdminRoute user={user} />}>
          <Route element={<TaLayout />}>
            <Route path="/dashboard/ta" element={<TaDashboard />} />
            <Route path="/applicants-Status" element={<ApplicantStatus />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />

            <Route path="/candidates-list" element={<CandidateList />} />
            <Route path="/profile/ta" element={<Profile />} />
            <Route
              path="/application-tracker_ta/:candidateId"
              element={<ApplicationTracker />}
            />
            <Route
              path="/assigned-candidates"
              element={<AssignedCandidatePage />}
            />

            <Route
              path="/shortlisted-candidates"
              element={<ShortlistedHistory />}
            />
            {/* <Route
              path="/shortlisted-candidate-all-hr"
              element={<ShortlistedCandidateAllHR />}
            /> */}

            <Route
              path="/onboarding-candidates"
              element={<OnboardingCandidates />}
            />
            <Route path="/hired-candidates" element={<HiredCandidates />} />
            <Route path="/candidates-status-ta" element={<CandidateStatus />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/vendor-candidates" element={<VendorCandidates />} />
            <Route
              path="/assigned-vendor-candidates"
              element={<AssignedVendorCandidates />}
            />
          </Route>
        </Route>

        {/* BU Routes */}
        <Route element={<BURoute user={user} />}>
          <Route element={<BULayout />}>
            <Route path="/dashboard/bu" element={<BUDashboard />} />

            <Route
              path="/application-tracker_bu/:candidateId"
              element={<ApplicationTracker />}
            />
            <Route path="/active-jobs-bu" element={<ActiveJobsBu />} />
            <Route path="/approve-candidates" element={<ApproveCandidates />} />
            <Route
              path="/referred-candidates_bu/:jobId"
              element={<ReferredCandidates />}
            />
            {/* <Route path="/post-new-job" element={<CreatePostJob />} />
            <Route path="/create-company" element={<CreateCompany />} />
            <Route path="/all-job-feeds" element={<Feeds />} />
            <Route path="/job-detail" element={<JobDetailPage />} />
            <Route
              path="/all-job-feeds/company/openings"
              element={<OpeningJobCard />}
            />
            <Route
              path="//approve-candidates/:jobId"
              element={<ViewCandidates />}
            /> */}
            <Route path="/candidates-status-bu" element={<CandidateStatus />} />
            <Route path="/profile/bu" element={<Profile />} />
          </Route>
        </Route>

        {/* Sales Routes */}
        <Route element={<SalesRoute user={user} />}>
          <Route element={<SalesLayout />}>
            <Route path="/dashboard/sales" element={<SalesDashboard />} />
            <Route
              path="/referred-all-candidates"
              element={<ReferredTalent />}
            />
            <Route
              path="/application-tracker_sales/:candidateId"
              element={<ApplicationTracker />}
            />
            <Route path="/post-new-job" element={<CreatePostJob />} />
            <Route path="/create-company" element={<CreateCompany />} />
            <Route path="/all-job-feeds" element={<Feeds />} />
            <Route path="/job-detail" element={<JobDetailPage />} />
            <Route
              path="/candidates-status-sales"
              element={<CandidateStatus />}
            />
            <Route
              path="/all-job-feeds/company/openings"
              element={<OpeningJobCard />}
            />
            <Route
              path="/view-candidates/:jobId"
              element={<ViewCandidates />}
            />

            {/* <Route path="/candidates-status-bu" element={<CandidateStatus />} /> */}
            <Route path="/profile/sales" element={<Profile />} />
          </Route>
        </Route>

        {/* Account Manager Routes */}
        <Route element={<AccountManagerRoute user={user} />}>
          <Route element={<AccountLayout />}>
            <Route path="/dashboard/accounts" element={<AccountDashboard />} />
            <Route path="/list-of-invoices" element={<InvoiceList />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route
              path="/company/invoice-list"
              element={<CompanyInvoiceList />}
            />
            <Route path="/profile/accounts" element={<Profile />} />
          </Route>
        </Route>

        {/* Vendor Routes */}
        <Route element={<VendorRoute user={user} />}>
          <Route element={<VendorLayout />}>
            <Route path="/dashboard/vendor" element={<VendorDashboard />} />
            <Route path="/profile/vendor" element={<Profile />} />
            <Route path="/applicants-list" element={<ApplicantsList />} />
            <Route
              path="/current-active-jobs-vendor"
              element={<ActiveJobsVendor />}
            />
            <Route
              path="/profile-submission-form"
              element={<ProfileSubmissionForm />}
            />
            <Route
              path="/candidates-status-vendor"
              element={<CandidateStatus />}
            />
            <Route
              path="/application-tracker_vendor/:candidateId"
              element={<ApplicationTracker />}
            />
          </Route>
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch-All: Redirect based on role */}
      <Route
        path="*"
        element={
          isAuth ? (
            user?.role === "ta" || user?.role === "admin" ? (
              <Navigate to="/dashboard/ta" replace />
            ) : user?.role === "bu" ? (
              <Navigate to="/dashboard/bu" replace />
            ) : user?.role === "accounts" ? (
              <Navigate to="/dashboard/accounts" replace />
            ) : user?.role === "sales" ? (
              <Navigate to="/dashboard/sales" replace />
            ) : user?.role === "vendor" ? (
              <Navigate to="/dashboard/vendor" replace />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRouter;
