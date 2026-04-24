import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ExcelGeneration from "./pages/ExcelGeneration";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/excel" element={<ExcelGeneration />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;