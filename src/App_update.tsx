// AJOUTEZ ces lignes dans vos imports
import CGU from './pages/legal/CGU';
import MentionsLegales from './pages/legal/MentionsLegales';
import Privacy from './pages/legal/Privacy';

// AJOUTEZ ces routes dans votre <Routes>
<Route path="/legal/cgu" element={<CGU />} />
<Route path="/legal/mentions-legales" element={<MentionsLegales />} />
<Route path="/legal/privacy" element={<Privacy />} />
