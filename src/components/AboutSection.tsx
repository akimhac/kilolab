import { Leaf, HeartHandshake } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-slate-900" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Bali Inspiration"
              className="relative rounded-3xl shadow-2xl z-10 border border-white/10 rotate-1 hover:rotate-0 transition duration-500"
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <span className="text-teal-400 font-bold tracking-wider uppercase text-sm">Notre Histoire</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2 leading-tight">
                Tout a commencé par un voyage à <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Bali</span>.
              </h2>
            </div>
            
            <div className="text-lg text-slate-300 space-y-6 leading-relaxed">
              <p>
                Lors d'un séjour en Indonésie, nous avons découvert une habitude locale fascinante : les <strong>"Kilo Laundry"</strong>. 
                Là-bas, personne ne compte ses chaussettes. On dépose son sac, on pèse, on paie au poids. Simple. Efficace.
              </p>
              <p>
                En rentrant en France, le choc : des pressings chers, complexes, élitistes. 
                Nous avons décidé d'importer ce modèle vertueux.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <Leaf className="text-teal-400 mb-3" size={28} />
                <h4 className="font-bold text-white text-lg">Écologique</h4>
                <p className="text-sm text-slate-400 mt-1">Machines optimisées, moins d'eau gâchée.</p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <HeartHandshake className="text-teal-400 mb-3" size={28} />
                <h4 className="font-bold text-white text-lg">Solidaire</h4>
                <p className="text-sm text-slate-400 mt-1">Soutient les artisans locaux.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
