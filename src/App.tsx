import { Routes, Route, Outlet } from "react-router-dom";
// Componentes importados
import Navbar from "./components/layout/Navbar"; 
import ScrollToTop from "./components/layout/ScrollToTop";
import AdminLayout from "./components/layout/AdminLayout";
import Landing from "./pages/Landing";
import VoteForm from "./components/votacion/VoteForm";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard"; 
import DataUpload from "./components/admin/DataUpload";
import MetricsDashboard from "./components/admin/MetricsDashboard";
import PredictiveAnalytics from "./components/admin/PredictiveAnalytics";
import DataCleaning from "./components/admin/DataCleaning";
import ParaElectores from "./pages/ParaElectores";
import LoNuevo from "./pages/LoNuevo";
import Cronologia from "./pages/Cronologia";
import "bootstrap-icons/font/bootstrap-icons.css";

// 1. Componente de Layout Público. (ACTUALIZADO)
function PublicLayout() {
  const NAVBAR_HEIGHT_COMPENSATION = '85px'; 
  return (
    <>
      <Navbar /> 
      <div style={{ paddingTop: NAVBAR_HEIGHT_COMPENSATION }}>
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  return (
    <main> 
        <ScrollToTop /> 
        <Routes>
          
          {/* ----------------------------------------------------- */}
          {/* 1. GRUPO DE RUTAS PÚBLICAS (Funcionando con Navbar fijo) */}
          {/* ----------------------------------------------------- */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Landing />} /> 
            <Route path="votar" element={<VoteForm />} />
            <Route path="para-electores" element={<ParaElectores />} />
            <Route path="lo-nuevo" element={<LoNuevo />} />
            <Route path="cronologia" element={<Cronologia />} />
          </Route>
          
          {/* ----------------------------------------------------- */}
          {/* 2. RUTA DE LOGIN DE ADMINISTRADOR (Independiente) */}
          {/* ----------------------------------------------------- */}
             {/* 💡 CORRECCIÓN: Usamos la ruta simple '/admin' para el login. */}
             {/* Esta ruta NO está anidada en PublicLayout y NO tiene Navbar. */}
             <Route path="/admin-login" element={<AdminLogin />} />

          {/* ----------------------------------------------------- */}
          {/* 3. GRUPO DE RUTAS ADMINISTRATIVAS (Bajo AdminLayout) */}
          {/* ----------------------------------------------------- */}
             {/* 💡 CORRECCIÓN: Creamos un nuevo path padre: '/admin-dashboard' */}
             {/* Esto evita conflictos con el path de login simple '/admin' de arriba. */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="resultados" element={<AdminDashboard />} /> 
            <Route path="metrics" element={<MetricsDashboard />} /> 
            <Route path="upload" element={<DataUpload />} /> 
            <Route path="analytics" element={<PredictiveAnalytics />} /> 
            <Route path="cleaning" element={<DataCleaning />} /> 
          </Route>
          
        </Routes>
    </main>
  );
}