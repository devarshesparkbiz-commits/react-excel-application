import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard       from "./pages/Dashboard";
import ExcelGeneration from "./pages/ExcelGeneration";
import WordGeneration  from "./pages/WordGeneration";
import TextConversion  from "./pages/TextConversion";
import FormsList       from "./pages/forms/FormsList";
import FormBuilder     from "./pages/forms/FormBuilder";
import XmlGeneration   from "./pages/XmlGeneration";
import JsonBeautifier   from "./pages/JsonBeautifier";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/excel"          element={<ExcelGeneration />} />
          <Route path="/word"           element={<WordGeneration />} />
          <Route path="/convert"        element={<TextConversion />} />
          <Route path="/forms"          element={<FormsList />} />
          <Route path="/forms/create"   element={<FormBuilder />} />
          <Route path="/forms/edit/:id" element={<FormBuilder />} />
          <Route path="/xml"            element={<XmlGeneration />} />
          <Route path="/json"           element={<JsonBeautifier />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;