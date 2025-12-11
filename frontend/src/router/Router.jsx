import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts
import HrLayout from "../layout/HrLayout";
import DMPLayout from "../layout/DMPLayout";

// HR Components
import CandidateList from "../hr/CandidateList";
import HrSettings from "../hr/HrSetting";
import HrDashboard from "../hr/HrDashboard";
import AssignedCandidatePage from "../hr/AssignedPage";
import TeamsPage from "../hr/Teams";
import ActiveJobs from "../hr/ActiveJobs";
import ShortlistedHistory from "../hr/ShortlistedHistory";

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
import OnboardingCandidates from "../hr/OnboardingCandidates";

// Delivery Manager Components
import DMPDashboard from "../dmp/DMPDashboard";
import ShortlistedCandidates from "../dmp/ShortlistedCandidates";
import ForgotPassword from "../components/ForgotPassword";
import JobPostingForm from "../jobPost/JobPostingForm";
import Feeds from "../dmp/Feeds";
import CandidateRegistrationDummy from "../pages/registration/Registration-dummy";
import JobDetailPage from "../components/JobDetailPage";
import OpeningJobCard from "../jobPost/OpeningJobCard";
import ViewCandidates from "../jobPost/ViewCandidates";
import CreatePostJob from "../dmp/CreatePostJob";
import CreateCompany from "../dmp/CreateCompany";

// Account Manager Components
import AccountDashboard from "../accounts/AccountDashboard";
import Invoice from "../accounts/Invoice";
import AccountLayout from "../layout/AccountLayout";
import InvoiceList from "../accounts/InvoiceList";
import Companies from "../accounts/Companies";
import CompanyInvoiceList from "../accounts/CompanyInvoiceList";
import FeedbackForm from "../feedback/FeedbackForm";
import HiredCandidates from "../hr/HiredCandidates";

// Freelancer Components
import FreelancerLayout from "../layout/FreelancerLayout";
import ApplicantsList from "../freelancers/ApplicantsList";
import FreelancerDashboard from "../freelancers/FreelancerDashboard";
import ActiveJobsFreelancer from "../freelancers/ActiveJobsFreelancer";
import ProfileSubmissionForm from "../freelancers/ProfileSubmissionForm";
import FreelancerCandidates from "../hr/FreelancerCandidates";
import AssignedFreelancerCandidates from "../freelancers/AssignedFreelancerCandidates";
import CandidateStatus from "../hr/CandidateStatus";
// import ShortlistedCandidateAllHR from "../hr/ShortlistedCandidateAllHR";


// Route Wrappers
const PrivateRoute = ({ isAuth }) =>
  isAuth ? <Outlet /> : <Navigate to="/login" replace />;
const PublicRoute = ({ isAuth }) =>
  !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
const AdminRoute = ({ user }) =>
  user?.role === "admin" || user?.role === "hr" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
const DeliveryManagerRoute = ({ user }) =>
  user?.role === "delivery" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );

const AccountManagerRoute = ({ user }) =>
  user?.role === "accounts" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );

const FreelancerRoute = ({ user }) =>
  user?.role === "freelancer" ? (
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
          <Route element={<HrLayout />}>
            <Route path="/dashboard/hr" element={<HrDashboard />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />
            <Route path="/settings" element={<HrSettings />} />
            <Route path="/candidates-list" element={<CandidateList />} />
            <Route path="/profile/hr" element={<Profile />} />
            <Route
              path="/application-tracker_hr/:candidateId"
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
            <Route path="/candidates-status-hr" element={<CandidateStatus />} />
            <Route path="/user" element={<UserPage />} />
            <Route
              path="/freelancer-candidates"
              element={<FreelancerCandidates />}
            />
            <Route
              path="/assigned-freelancer-candidates"
              element={<AssignedFreelancerCandidates />}
            />
          </Route>
        </Route>

        {/* Delivery Manager Routes */}
        <Route element={<DeliveryManagerRoute user={user} />}>
          <Route element={<DMPLayout />}>
            <Route path="/dashboard/delivery" element={<DMPDashboard />} />
            <Route
              path="/shortlisted-all-candidates"
              element={<ShortlistedCandidates />}
            />
            <Route
              path="/application-tracker_dm/:candidateId"
              element={<ApplicationTracker />}
            />
            <Route path="/post-new-job" element={<CreatePostJob />} />
            <Route path="/create-company" element={<CreateCompany />} />
            <Route path="/all-job-feeds" element={<Feeds />} />
            <Route path="/job-detail" element={<JobDetailPage />} />
            <Route
              path="/all-job-feeds/company/openings"
              element={<OpeningJobCard />}
            />
            <Route
              path="/view-candidates/:jobId"
              element={<ViewCandidates />}
            />
            <Route path="/candidates-status-delivery" element={<CandidateStatus />} />
            <Route path="/profile/delivery" element={<Profile />} />
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

        {/* Freelancer Routes */}
        <Route element={<FreelancerRoute user={user} />}>
          <Route element={<FreelancerLayout />}>
            <Route
              path="/dashboard/freelancer"
              element={<FreelancerDashboard />}
            />
            <Route path="/profile/freelancer" element={<Profile />} />
            <Route path="/applicants-list" element={<ApplicantsList />} />
            <Route
              path="/current-active-jobs"
              element={<ActiveJobsFreelancer />}
            />
            <Route
              path="/profile-submission-form"
              element={<ProfileSubmissionForm />}
            />
            <Route
              path="/application-tracker_freelancer/:candidateId"
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
            user?.role === "hr" || user?.role === "admin" ? (
              <Navigate to="/dashboard/hr" replace />
            ) : user?.role === "delivery" ? (
              <Navigate to="/dashboard/delivery" replace />
            ) : user?.role === "accounts" ? (
              <Navigate to="/dashboard/accounts" replace />
            ) : user?.role === "freelancer" ? (
              <Navigate to="/dashboard/freelancer" replace />
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
