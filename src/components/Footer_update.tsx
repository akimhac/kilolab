// Dans le Footer de LandingPage.tsx, remplacez la section Légal par :

<div>
  <h4 className="font-bold mb-4 text-lg">Légal</h4>
  <ul className="space-y-3 text-slate-400">
    <li>
      <button 
        onClick={() => navigate('/legal/cgu')}
        className="hover:text-white transition text-left"
      >
        CGU
      </button>
    </li>
    <li>
      <button 
        onClick={() => navigate('/legal/privacy')}
        className="hover:text-white transition text-left"
      >
        Confidentialité
      </button>
    </li>
    <li>
      <button 
        onClick={() => navigate('/legal/mentions-legales')}
        className="hover:text-white transition text-left"
      >
        Mentions légales
      </button>
    </li>
  </ul>
</div>
