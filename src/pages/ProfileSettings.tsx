import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Save, User, Phone, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', address: '', email: '' });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return navigate('/login');
      supabase.from('user_profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setFormData({ full_name: data.full_name||'', phone: data.phone||'', address: data.address||'', email: user.email||'' });
        setLoading(false);
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('user_profiles').update({ full_name: formData.full_name, phone: formData.phone, address: formData.address }).eq('id', user.id);
      if (error) toast.error("Erreur sauvegarde"); else toast.success("Profil mis à jour !");
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-teal-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />
      <div className="pt-28 px-4 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-400 hover:text-white"><ArrowLeft className="mr-2"/> Retour</button>
        <h1 className="text-3xl font-bold mb-8">Mes Informations</h1>
        <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-slate-400 mb-2">Email</label><input disabled value={formData.email} className="w-full bg-slate-800 p-4 rounded-xl border border-white/5 opacity-50"/></div>
            <div><label className="block mb-2 flex gap-2"><User size={18}/> Nom</label><input value={formData.full_name} onChange={e=>setFormData({...formData, full_name:e.target.value})} className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10"/></div>
            <div><label className="block mb-2 flex gap-2"><Phone size={18}/> Téléphone</label><input value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10"/></div>
            <div><label className="block mb-2 flex gap-2"><MapPin size={18}/> Adresse</label><input value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10" placeholder="Votre adresse complète"/></div>
            <button type="submit" disabled={saving} className="w-full bg-teal-500 text-slate-900 font-bold py-4 rounded-xl hover:bg-teal-400 flex justify-center gap-2">{saving?<Loader2 className="animate-spin"/>:<Save/>} Enregistrer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
