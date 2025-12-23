import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, MapPin, ArrowRight, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function FindPressing() {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if(search.length < 2) return;
    setIsSearching(true);
    setSearchDone(false);
    
    // Simulation délai radar
    setTimeout(() => {
        setIsSearching(false);
        setSearchDone(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">Trouvez votre artisan</h1>
        
        {/* BARRE DE RECHERCHE */}
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex gap-2 mb-12 relative z-20">
            <div className="relative flex-1">
                 <Search className="absolute left-4 top-4 text-slate-400" size={20}/>
                 <input 
                    type="text" 
                    placeholder="Ville, code postal (ex: Paris)" 
                    className="w-full p-4 pl-12 outline-none text-lg font-bold bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <button onClick={handleSearch} disabled={!search || isSearching} className="bg-slate-900 text-white px-8 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50">
                {isSearching ? <Loader2 className="animate-spin"/> : 'Chercher'}
            </button>
        </div>

        {/* ZONE RADAR / MAP */}
        <div className="relative bg-slate-200 rounded-3xl overflow-hidden h-[400px] shadow-inner border border-slate-300">
            {/* IMAGE DE FOND MAP */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale hover:grayscale-0 transition duration-1000"></div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
                
                {!isSearching && !searchDone && (
                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full font-bold text-slate-600 flex items-center gap-2 shadow-lg animate-bounce">
                        <MapPin size={20} className="text-teal-500"/>
                        Entrez votre ville pour scanner la zone.
                    </div>
                )}

                {isSearching && (
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="w-6 h-6 bg-teal-500 rounded-full z-20 relative shadow-[0_0_20px_rgba(20,184,166,1)]"></div>
                            <div className="absolute w-32 h-32 bg-teal-500/30 rounded-full animate-ping opacity-75 z-10"></div>
                            <div className="absolute w-64 h-64 bg-teal-500/10 rounded-full animate-ping opacity-50 animation-delay-500 z-0"></div>
                        </div>
                        <p className="font-bold text-xl text-slate-900 bg-white/80 px-6 py-2 rounded-full backdrop-blur-md">Recherche des artisans...</p>
                    </div>
                )}

                {searchDone && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
                         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32}/>
                         </div>
                         <h3 className="text-2xl font-extrabold mb-2">Zone Couverte !</h3>
                         <p className="text-slate-500 mb-6">Nous avons des partenaires disponibles à <span className="font-bold text-slate-900 capitalize">{search}</span>.</p>
                         
                         <div className="bg-slate-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-100">
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase">Tarif Premium</p>
                                <p className="font-extrabold text-xl text-slate-900">3.00 € <span className="text-sm font-normal text-slate-500">/kg</span></p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Dispo</span>
                         </div>

                         <button onClick={() => navigate('/new-order')} className="w-full py-4 bg-teal-500 text-slate-900 font-bold rounded-xl hover:bg-teal-400 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
                            Commander maintenant <ArrowRight size={18}/>
                         </button>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
