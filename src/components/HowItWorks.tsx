import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const STEPS = [
    {
      number: '01', title: t('howItWorks.step1Title'), subtitle: t('howItWorks.step1Subtitle'),
      description: t('howItWorks.step1Desc'),
      color: 'from-teal-400 to-cyan-400', accent: '#14b8a6',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <rect x="8" y="12" width="48" height="36" rx="6" fill="#14b8a6" opacity="0.15"/>
          <rect x="12" y="16" width="40" height="28" rx="4" fill="#14b8a6" opacity="0.25"/>
          <rect x="16" y="20" width="32" height="4" rx="2" fill="white" opacity="0.8"/>
          <rect x="16" y="28" width="20" height="3" rx="1.5" fill="white" opacity="0.5"/>
          <rect x="16" y="34" width="14" height="3" rx="1.5" fill="white" opacity="0.4"/>
          <circle cx="44" cy="44" r="10" fill="#10b981"/>
          <path d="M40 44l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      number: '02', title: t('howItWorks.step2Title'), subtitle: t('howItWorks.step2Subtitle'),
      description: t('howItWorks.step2Desc'),
      color: 'from-violet-400 to-purple-500', accent: '#8b5cf6',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <circle cx="32" cy="28" r="14" fill="#8b5cf6" opacity="0.15"/>
          <circle cx="32" cy="28" r="8" fill="#8b5cf6" opacity="0.3"/>
          <circle cx="32" cy="28" r="4" fill="#8b5cf6" opacity="0.7"/>
          <path d="M32 10L32 18M32 38L32 46M10 28L18 28M46 28L54 28" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
          <circle cx="32" cy="28" r="1.5" fill="white"/>
          <path d="M20 48 Q32 40 44 48" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
      ),
    },
    {
      number: '03', title: t('howItWorks.step3Title'), subtitle: t('howItWorks.step3Subtitle'),
      description: t('howItWorks.step3Desc'),
      color: 'from-cyan-400 to-teal-400', accent: '#06b6d4',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <rect x="12" y="16" width="40" height="32" rx="8" fill="#06b6d4" opacity="0.15"/>
          <circle cx="32" cy="32" r="10" fill="none" stroke="#06b6d4" strokeWidth="3"/>
          <circle cx="32" cy="32" r="5" fill="#06b6d4" opacity="0.4"/>
          <path d="M20 20 Q32 14 44 20" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="20" cy="22" r="2.5" fill="#14b8a6"/>
          <circle cx="44" cy="22" r="2.5" fill="#14b8a6"/>
          <path d="M16 44 L48 44M22 50 L42 50" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
        </svg>
      ),
    },
    {
      number: '04', title: t('howItWorks.step4Title'), subtitle: t('howItWorks.step4Subtitle'),
      description: t('howItWorks.step4Desc'),
      color: 'from-emerald-400 to-green-500', accent: '#10b981',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <path d="M12 40 L32 18 L52 40 L44 40 L44 52 L20 52 L20 40 Z" fill="#10b981" opacity="0.15" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round"/>
          <rect x="26" y="38" width="12" height="14" rx="2" fill="#10b981" opacity="0.4"/>
          <circle cx="48" cy="20" r="8" fill="#10b981"/>
          <path d="M44.5 20L47 22.5L51.5 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      setActiveStep(Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="comment-ca-marche" className="relative bg-[#080e1d]" style={{ minHeight: '220vh' }}>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="sticky top-0 min-h-screen flex items-center overflow-hidden py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">

            {/* LEFT */}
            <div className="lg:w-5/12 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> {t('howItWorks.badge')}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight mb-4">
                <span className="block">{t('howItWorks.titleLine1')}</span>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{t('howItWorks.titleLine2')}</span>
              </h2>
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 lg:mb-8">{t('howItWorks.subtitle')}</p>
              <div className="space-y-3 mb-8 lg:mb-10">
                {STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-all duration-300 cursor-pointer ${i === activeStep ? 'opacity-100' : 'opacity-30'}`}
                    onClick={() => setActiveStep(i)}>
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-xs font-black text-white flex-shrink-0 transition-transform duration-300 ${i === activeStep ? 'scale-110 shadow-lg' : 'scale-90'}`}>
                      {i < activeStep ? '\u2713' : i + 1}
                    </div>
                    <span className={`text-sm font-bold transition-colors duration-300 ${i === activeStep ? 'text-white' : 'text-white/30'}`}>{step.title}</span>
                    {i === activeStep && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-bold" style={{ color: step.accent }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: step.accent }} /> {t('howItWorks.active')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <Link to="/new-order" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5">
                {t('howItWorks.cta')} <ArrowRight size={16} />
              </Link>
            </div>

            {/* RIGHT — Active card */}
            <div className="lg:w-7/12 w-full relative" style={{ minHeight: 220 }}>
              {STEPS.map((step, i) => (
                <div key={i} className={`transition-all duration-500 ${i === activeStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0'}`}
                  style={{ position: i === activeStep ? 'relative' : 'absolute', top: 0, left: 0, right: 0 }}>
                  <div className="relative bg-[#0f1729] border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl"
                    style={{ boxShadow: `0 0 80px ${step.accent}20` }}>
                    <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-10"
                      style={{ backgroundImage: `linear-gradient(${step.accent}33 1px, transparent 1px), linear-gradient(90deg, ${step.accent}33 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
                    <div className="absolute inset-0 rounded-3xl" style={{ background: `radial-gradient(ellipse at 20% 50%, ${step.accent}18 0%, transparent 65%)` }} />
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20 blur-xl`} />
                        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 shadow-xl`}>
                          <div className="w-full h-full rounded-2xl bg-[#0f1729] flex items-center justify-center p-3">{step.icon}</div>
                        </div>
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white bg-gradient-to-br ${step.color} shadow-lg`}>
                          {step.number.slice(1)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-black tracking-widest uppercase bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>{t('howItWorks.step')} {step.number}</span>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mt-1 mb-1">{step.title}</h3>
                        <p className="text-sm font-semibold mb-3" style={{ color: step.accent }}>{step.subtitle}</p>
                        <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-6 sm:mt-8 pt-6 border-t border-white/[0.08]">
                      <div className="flex gap-2">
                        {STEPS.map((_, di) => (
                          <div key={di} className={`rounded-full transition-all duration-300 ${di === activeStep ? 'w-6 h-2' : 'w-2 h-2'}`}
                            style={{ background: di === activeStep ? step.accent : 'rgba(255,255,255,0.15)' }} />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
                          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition disabled:opacity-20">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} disabled={activeStep === STEPS.length - 1}
                          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition disabled:opacity-20">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
