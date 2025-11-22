// Trouvez la section Hero (ligne ~50-100)
// Après la fermeture du </section> du Hero, AJOUTEZ CECI :

{/* BANNIÈRE PROMO 1 MOIS GRATUIT */}
<div className="max-w-4xl mx-auto px-4 -mt-16 mb-12 relative z-10">
  <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-3xl shadow-2xl p-6 md:p-8 text-white">
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
        <Gift className="w-5 h-5" />
        <span className="font-bold">OFFRE DE LANCEMENT</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black mb-3">
        🎁 1er mois GRATUIT 🎁
      </h2>
      <p className="text-xl text-green-100">
        Pour les 100 premiers pressings inscrits
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="font-semibold">0€ pendant 30 jours</span>
      </div>
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="font-semibold">Visibilité immédiate</span>
      </div>
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="font-semibold">Support 7j/7</span>
      </div>
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="font-semibold">Formation incluse</span>
      </div>
    </div>

    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <p className="text-lg mb-2">
        Après 30 jours : <strong>seulement 10% de commission</strong>
      </p>
      <p className="text-green-100 text-sm">
        ⚡ Places limitées • Déjà 23 inscrits • Il reste 77 places
      </p>
    </div>
  </div>
</div>
