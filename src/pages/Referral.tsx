import { useEffect, useState } from ‘react’;
import Navbar from ‘../components/Navbar’;
import { Copy, Gift, Share2, Star, Users, TrendingUp, Loader2 } from ‘lucide-react’;
import toast from ‘react-hot-toast’;
import { supabase } from ‘../lib/supabase’;

export default function Referral() {
const [loading, setLoading] = useState(true);
const [referralCode, setReferralCode] = useState(’’);
const [stats, setStats] = useState({
totalReferrals: 0,
pendingReferrals: 0,
earnedCredits: 0
});
const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
const [userName, setUserName] = useState(’’);

useEffect(() => {
loadReferralData();
}, []);

const loadReferralData = async () => {
try {
const { data: { user } } = await supabase.auth.getUser();

```
  if (!user) {
    toast.error("Vous devez être connecté");
    setLoading(false);
    return;
  }

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, referral_code')
    .eq('id', user.id)
    .single();

  if (profile) {
    setUserName(profile.full_name || 'Utilisateur');
    
    // Si pas de code de parrainage, en générer un
    if (profile.referral_code) {
      setReferralCode(profile.referral_code);
    } else {
      const newCode = generateReferralCode(profile.full_name || user.email);
      await createReferralCode(user.id, newCode);
      setReferralCode(newCode);
    }
  } else {
    // Créer le code depuis l'email
    const newCode = generateReferralCode(user.email);
    await createReferralCode(user.id, newCode);
    setReferralCode(newCode);
  }

  // Charger les stats de parrainage
  const { data: referrals } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false });

  if (referrals) {
    const completed = referrals.filter(r => r.status === 'completed');
    const pending = referrals.filter(r => r.status === 'pending');
    
    setStats({
      totalReferrals: referrals.length,
      pendingReferrals: pending.length,
      earnedCredits: completed.length * 10 // 10€ par filleul
    });

    setRecentReferrals(referrals.slice(0, 5));
  }

} catch (error) {
  console.error('Erreur chargement parrainage:', error);
  toast.error("Erreur de chargement");
} finally {
  setLoading(false);
}
```

};

const generateReferralCode = (name: string): string => {
const cleanName = name
.split(’@’)[0] // Enlever domain si email
.replace(/[^a-zA-Z]/g, ‘’) // Garder que lettres
.toUpperCase()
.slice(0, 6); // Max 6 caractères

```
const randomNum = Math.floor(1000 + Math.random() * 9000);
return `KILO-${cleanName}${randomNum}`;
```

};

const createReferralCode = async (userId: string, code: string) => {
try {
// Vérifier si user_profiles a la colonne referral_code
const { error } = await supabase
.from(‘user_profiles’)
.update({ referral_code: code })
.eq(‘id’, userId);

```
  if (error) {
    console.error('Erreur création code:', error);
  }
} catch (error) {
  console.error('Erreur création code:', error);
}
```

};

const copyCode = () => {
navigator.clipboard.writeText(referralCode);
toast.success(“Code copié !”);
};

const shareCode = async () => {
const shareText = `Rejoins-moi sur Kilolab et économise 10€ sur ta première commande avec mon code : ${referralCode}`;
const shareUrl = `https://kilolab.fr?ref=${referralCode}`;

```
if (navigator.share) {
  try {
    await navigator.share({
      title: 'Kilolab - Parrainage',
      text: shareText,
      url: shareUrl
    });
  } catch (error) {
    // Utilisateur a annulé ou erreur
    copyCode();
  }
} else {
  copyCode();
}
```

};

if (loading) {
return (
<div className="min-h-screen bg-slate-50 flex items-center justify-center">
<Loader2 className="animate-spin text-teal-600" size={48} />
</div>
);
}

return (
<div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
<Navbar />

```
  <div className="pt-32 px-4 max-w-4xl mx-auto">
    
    {/* HEADER */}
    <div className="text-center mb-12">
      <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <Gift size={40}/>
      </div>

      <h1 className="text-4xl font-black mb-4">
        Invitez un ami,<br/>
        Gagnez du linge propre.
      </h1>
      <p className="text-slate-500 text-lg mb-6 max-w-md mx-auto">
        Offrez <span className="font-bold text-slate-900">10€</span> à vos amis sur leur première commande.
        Recevez <span className="font-bold text-slate-900">10€</span> dès qu'ils commandent.
      </p>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-black text-teal-600">{stats.totalReferrals}</div>
          <div className="text-xs text-slate-500 font-bold">Filleuls</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-black text-orange-600">{stats.pendingReferrals}</div>
          <div className="text-xs text-slate-500 font-bold">En attente</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-black text-green-600">{stats.earnedCredits}€</div>
          <div className="text-xs text-slate-500 font-bold">Gagnés</div>
        </div>
      </div>
    </div>

    {/* CODE DE PARRAINAGE */}
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-8 mb-8 border-2 border-teal-200 shadow-xl">
      <h2 className="text-center text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
        Votre code de parrainage
      </h2>
      
      <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-between max-w-lg mx-auto mb-6">
        <div className="px-6 font-mono font-black text-2xl sm:text-3xl tracking-widest text-slate-900">
          {referralCode || 'CHARGEMENT...'}
        </div>
        <button 
          onClick={copyCode} 
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex gap-2 items-center"
        >
          <Copy size={18}/> Copier
        </button>
      </div>

      <button
        onClick={shareCode}
        className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-500 transition shadow-lg"
      >
        <Share2 size={20} />
        Partager avec mes amis
      </button>
    </div>

    {/* COMMENT ÇA MARCHE */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
          <Share2 size={24}/>
        </div>
        <h3 className="font-bold text-lg mb-2">1. Partagez</h3>
        <p className="text-sm text-slate-500">
          Envoyez votre code unique à vos proches par WhatsApp, SMS ou email.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
          <Star size={24}/>
        </div>
        <h3 className="font-bold text-lg mb-2">2. Ils commandent</h3>
        <p className="text-sm text-slate-500">
          Ils profitent de 10€ de réduction immédiate sur leur 1ère commande.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="bg-yellow-50 w-12 h-12 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
          <Gift size={24}/>
        </div>
        <h3 className="font-bold text-lg mb-2">3. Vous gagnez</h3>
        <p className="text-sm text-slate-500">
          Vos 10€ de crédit sont ajoutés automatiquement à votre compte.
        </p>
      </div>
    </div>

    {/* ACTIVITÉ RÉCENTE */}
    {recentReferrals.length > 0 && (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <Users size={20} className="text-teal-600" />
          Vos filleuls récents
        </h3>
        
        <div className="space-y-3">
          {recentReferrals.map((referral, idx) => (
            <div 
              key={referral.id || idx} 
              className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-sm">
                    Filleul #{referral.id?.slice(0, 6) || 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {referral.status === 'completed' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={12} />
                    +10€
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                    En attente
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* CTA FINAL */}
    {stats.totalReferrals === 0 && (
      <div className="mt-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-8 text-white text-center shadow-2xl">
        <h3 className="text-2xl font-black mb-3">
          Commencez à parrainer dès maintenant !
        </h3>
        <p className="text-teal-100 mb-6 max-w-md mx-auto">
          Plus vous parrainez, plus vous économisez. 
          Aucune limite au nombre de filleuls.
        </p>
        <button
          onClick={shareCode}
          className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg inline-flex items-center gap-2"
        >
          <Share2 size={20} />
          Partager mon code
        </button>
      </div>
    )}

  </div>
</div>
```

);
}