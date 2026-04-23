import { Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import InvoiceListPage from "./pages/InvoiceListPage";
import DetailPage from "./pages/DetailPage";
import Sidebar from "./components/Sidebar";

function App() {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`} id="app" data-theme={theme}>
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<InvoiceListPage />} />
          <Route path="/invoices/:id" element={<DetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
