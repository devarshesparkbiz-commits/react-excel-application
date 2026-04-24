import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ExcelGeneration from "./pages/ExcelGeneration";
import WordGeneration from "./pages/WordGeneration";
import TextConversion from "./pages/TextConversion";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/excel"   element={<ExcelGeneration />} />
          <Route path="/word"    element={<WordGeneration />} />
          <Route path="/convert" element={<TextConversion />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;