import { Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from './lib/store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plan from './pages/Plan';
import Study from './pages/Study';
import Simulados from './pages/Simulados';
import Progress from './pages/Progress';
import Couple from './pages/Couple';
import Settings from './pages/Settings';

export default function App() {
  const { me } = useStore();
  if (!me) return <Login />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="plano" element={<Plan />} />
        <Route path="estudo" element={<Study />} />
        <Route path="simulados" element={<Simulados />} />
        <Route path="progresso" element={<Progress />} />
        <Route path="casal" element={<Couple />} />
        <Route path="ajustes" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
