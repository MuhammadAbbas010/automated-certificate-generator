import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CertificatesProvider, useCertificates } from "./context/CertificatesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./routes/LoginPage";
import { WizardPage } from "./routes/WizardPage";
import { DashboardPage } from "./routes/DashboardPage";
import { PlaceholderPage } from "./routes/PlaceholderPage";

function DashboardIndexRedirect() {
  const { certificates } = useCertificates();
  if (certificates.length === 0) return <Navigate to="/new-certificate" replace />;
  return <Navigate to={`/dashboard/${certificates[0].id}`} replace />;
}

export function App() {
  return (
    <AuthProvider>
      <CertificatesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardIndexRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:certId"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-certificate"
              element={
                <ProtectedRoute>
                  <WizardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Templates" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Settings" />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </CertificatesProvider>
    </AuthProvider>
  );
}
