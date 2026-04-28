import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard       from "./pages/Dashboard";
import ExcelGeneration from "./pages/ExcelGeneration";
import WordGeneration  from "./pages/WordGeneration";
import TextConversion  from "./pages/TextConversion";
import FormsList       from "./pages/forms/FormsList";
import FormBuilder     from "./pages/forms/FormBuilder";
import XmlGeneration   from "./pages/XmlGeneration";
import JsonBeautifier   from "./pages/JsonBeautifier";
import TextDifferenceChecker    from "./pages/TextDifferenceChecker";
import DateTimeView from "./pages/datetime/DateTimeView";
import UnitConverter from "./pages/units/UnitConverter";
import Calculator from "./pages/calculator/Calculator";
import ColorPicker from "./pages/color/ColorPicker";

import { AuthProvider, useAuth } from "./theme/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminPlans from "./pages/admin/AdminPlans";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/landing" />;
  if (adminOnly && user.role !== 'ROLE_ADMIN') return <Navigate to="/" />;
  return children;
};

const ModuleRoute = ({ children, moduleId }) => {
  const { hasAccess, loading } = useAuth();
  if (loading) return null;
  if (!hasAccess(moduleId)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Persistent Layout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        
        <Route path="/excel" element={<ModuleRoute moduleId="excel"><ExcelGeneration /></ModuleRoute>} />
        <Route path="/word" element={<ModuleRoute moduleId="convert"><WordGeneration /></ModuleRoute>} />
        <Route path="/convert" element={<ModuleRoute moduleId="convert"><TextConversion /></ModuleRoute>} />
        
        <Route path="/forms" element={<ModuleRoute moduleId="forms"><FormsList /></ModuleRoute>} />
        <Route path="/forms/create" element={<ModuleRoute moduleId="forms"><FormBuilder /></ModuleRoute>} />
        <Route path="/forms/edit/:id" element={<ModuleRoute moduleId="forms"><FormBuilder /></ModuleRoute>} />
        
        <Route path="/xml" element={<ModuleRoute moduleId="xml"><XmlGeneration /></ModuleRoute>} />
        <Route path="/json" element={<ModuleRoute moduleId="json"><JsonBeautifier /></ModuleRoute>} />
        <Route path="/diff" element={<ModuleRoute moduleId="diff"><TextDifferenceChecker /></ModuleRoute>} />
        
        <Route path="/datetime" element={<ModuleRoute moduleId="datetime"><DateTimeView /></ModuleRoute>} />
        <Route path="/units" element={<ModuleRoute moduleId="units"><UnitConverter /></ModuleRoute>} />
        <Route path="/calculator" element={<ModuleRoute moduleId="calculator"><Calculator /></ModuleRoute>} />
        <Route path="/color" element={<ModuleRoute moduleId="color"><ColorPicker /></ModuleRoute>} />

        <Route path="/admin/plans" element={<ProtectedRoute adminOnly><AdminPlans /></ProtectedRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;