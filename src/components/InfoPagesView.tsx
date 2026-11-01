import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Mail, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Smartphone, 
  Lock, 
  AlertTriangle, 
  Building2, 
  Globe, 
  ArrowRight, 
  Check, 
  Copy, 
  CheckCheck, 
  AlertCircle, 
  Package, 
  Layers, 
  Calendar, 
  RotateCcw, 
  BookOpen, 
  ShoppingBag, 
  FileSpreadsheet, 
  Shield, 
  Heart, 
  ChevronDown, 
  Star, 
  Users, 
  Zap, 
  TrendingUp, 
  Plus 
} from 'lucide-react';
import { ViewMode, ConsumableItem } from '../types/consumable';
import { mapGuideToPreset } from '../data/replacementGuides';

export type InfoTab = 'about' | 'privacy' | 'terms' | 'contact';

interface InfoPagesViewProps {
  initialTab?: InfoTab;
  onNavigateToList: () => void;
  onTabChange?: (tab: InfoTab) => void;
  onAddPresetItem?: (preset: ConsumableItem) => void;
}

export const InfoPagesView: React.FC<InfoPagesViewProps> = ({
  initialTab = 'about',
  onNavigateToList,
  onTabChange,
  onAddPresetItem
}) => {
  const [activeTab, setActiveTab] = React.useState<InfoTab>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const handleSelectTab = (tab: InfoTab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('stoooone.studio@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateToList}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Torna ai miei articoli</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold tracking-wide">
          Guida e note legali di Replenish
        </span>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl shadow-emerald-950/10">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Guida ufficiale / Informações e aspetos legais</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
            Informazioni su Replenish
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Un gestore intelligente dei cicli dei materiali di consumo per la casa, che previene le scadenze e mantiene un ambiente domestico pulito e sano senza sprechi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-5 border-t border-emerald-700/50 flex flex-wrap gap-2 relative z-10">
          <button
            type="button"
            onClick={() => handleSelectTab('about')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 ${
              activeTab === 'about'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/15'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panoramica</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('privacy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 ${
              activeTab === 'privacy'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/15'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('terms')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 ${
              activeTab === 'terms'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/15'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Termini di servizio</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('contact')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 ${
              activeTab === 'contact'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/15'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contatti</span>
          </button>
        </div>
      </div>

      {/* Tab 1: About */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: The Core Problem */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Un dilemma quotidiano spesso trascurato</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Quando hai sostituito l'ultima volta la spugna da cucina o lo spazzolino da denti?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Molti articoli di uso quotidiano — filtri per l'acqua, testine per rasoio, filtri per cappe, cartucce di gas d'emergenza o portalenti — invecchiano gradualmente. Poiché esternamente sembrano ancora intatti, è facile dimenticarne la sostituzione. Tuttavia, si accumulano batteri invisibili o le prestazioni di filtraggio diminuiscono drasticamente.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Replenish</strong> prende in carico questa pianificazione: una volta impostato l'intervallo raccomandato, l'app calcola la data di scadenza successiva e invia promemoria tempestivi per il riordino.
            </p>
          </div>

          {/* Section 2: Key Features (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Calcolo automatico delle scadenze
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Imposta cicli flessibili in giorni, settimane, mesi o anni. Un clic su «Sostituito oggi» ricalcola istantaneamente il ciclo successivo.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Promemoria tempestivo di acquisto
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Ricevi notifiche con anticipo personalizzato (es. 7 giorni prima), per ordinare o acquistare il ricambio in tempo utile.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Privacy locale al 100%
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Nessuna registrazione, nessun login, nessun salvataggio sui server. Tutti i dati rimangono completamente al sicuro e riservati nel tuo browser.
              </p>
            </div>
          </div>

          {/* Section 3: FAQ */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Domande frequenti (FAQ)</span>
            </h3>

            <div className="space-y-3 pt-2">
              {[
                {
                  q: 'L\'utilizzo di Replenish è gratuito?',
                  a: 'Sì, Replenish è un\'applicazione web completamente gratuita. Tutte le funzionalità sono disponibili senza limitazioni.'
                },
                {
                  q: 'Dove vengono salvati i dati degli articoli inseriti?',
                  a: 'Esclusivamente in locale nel tuo browser (LocalStorage). Nessun dato personale viene trasmesso a server esterni.'
                },
                {
                  q: 'Come posso trasferire i miei dati su un altro dispositivo?',
                  a: 'Tramite la voce di menu «Dati» > «Backup e ripristino JSON», puoi esportare i dati in un file con un clic e importarli facilmente su un altro dispositivo.'
                },
                {
                  q: 'L\'app funziona anche offline?',
                  a: 'Sì. Una volta aperta o installata tramite «Aggiungi alla schermata Home», grazie alla moderna tecnologia PWA puoi utilizzare Replenish anche senza connessione a Internet.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
              Política de Privacidade
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Aggiornato al: 1 novembre 2026 | Editore: STONE PLANNING
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>1. Principi generali</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              STONE PLANNING («l'Editore») rispetta la privacy di tutti gli utenti dell'applicazione web «Replenish - Gestore cicli di consumo domestico» («il Servizio») e si impegna a proteggere i dati personali.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>2. Riservatezza e archiviazione locale al 100%</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              Tutti i dati registrati nel Servizio (nomi degli articoli, numeri di modello, cicli, cronologia e note) vengono salvati esclusivamente nella memoria locale del tuo browser (<code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">replenish_consumable_items_it_v1</code>). Non viene effettuata alcuna trasmissione o archiviazione sui server centrali di STONE PLANNING.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>3. Annunci pubblicitari (Google AdSense e altri)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              Il Servizio utilizza servizi pubblicitari di terze parti (incluso Google AdSense) per mostrare annunci. I fornitori terzi utilizzano cookie per pubblicare annunci basati sulle visite precedenti a questo o ad altri siti web. Puoi disattivare gli annunci personalizzati nelle impostazioni annunci di Google.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>4. Analisi web e cookie</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              Per migliorare costantemente il Servizio, possono essere utilizzati strumenti di analisi web standard. I dati raccolti sono anonimizzati e non consentono di risalire all'identità dell'utente.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>5. Modifiche a questa informativa sulla privacy</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              L'Editore si riserva il diritto di aggiornare la presente informativa in conformità a modifiche normative o tecniche. Le modifiche entrano in vigore al momento della loro pubblicazione su questa pagina.
            </p>
          </section>

          <section className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>6. Contatti e richieste di informazioni</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              Per qualsiasi domanda relativa a questa informativa sulla privacy, contattaci a:<br />
              Editore: STONE PLANNING<br />
              E-mail: <a href="mailto:stoooone.studio@gmail.com" className="text-emerald-700 underline font-semibold">stoooone.studio@gmail.com</a>
            </p>
          </section>
        </div>
      )}

      {/* Tab 3: Terms of Service & Disclaimer */}
      {activeTab === 'terms' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
              Termini di servizio e limitazione di responsabilità
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Aggiornato al: 1 novembre 2026 | Editore: STONE PLANNING
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>1. Ambito di applicazione</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              I presenti termini regolano l'utilizzo dell'applicazione web «Replenish» («il Servizio»), fornita da STONE PLANNING («l'Editore»). L'utilizzo del Servizio implica l'accettazione integrale di queste condizioni.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
              <span>2. Avviso importante sui cicli di sostituzione e consigli igienici</span>
            </h3>
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs text-amber-950 leading-relaxed ml-3.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Avviso importante: Carattere puramente informativo</span>
              </div>
              <p>
                Tutti gli intervalli di sostituzione, i consigli di igiene e le associazioni di modelli indicati nel Servizio costituiscono valori orientativi generali, basati su indicazioni dei produttori e standard igienici pubblici. Non garantiscono la durata esatta o la totale assenza di germi in condizioni d'uso specifiche, qualità dell'acqua o sollecitazioni individuali.
              </p>
              <p>
                Fanno sempre fede le istruzioni ufficiali per l'uso e le avvertenze di sicurezza dei rispettivi produttori. L'Editore non si assume alcuna responsabilità per danni o svantaggi derivanti dall'utilizzo dell'applicazione.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>3. Link esterni e terze parti</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              Il Servizio può contenere collegamenti a negozi online esterni (es. Amazon). L'Editore non ha alcun controllo su disponibilità, prezzi o consegne sulle piattaforme esterne. Per gli acquisti effettuati su siti esterni si applicano i rispettivi termini contrattuali.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>4. Modifica o interruzione del Servizio</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              L'Editore si riserva il diritto di modificare, estendere o interrompere il Servizio in qualsiasi momento.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>5. Proprietà intellettuale</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              Tutti i programmi, i design dell'interfaccia utente, i loghi, le illustrazioni e i testi di questo Servizio sono soggetti al diritto d'autore dell'Editore o dei rispettivi licenzianti. È vietata qualsiasi riproduzione o distribuzione non autorizzata.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <span>6. Legge applicabile e foro competente</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
              I presenti termini di servizio sono regolati dalla legge giapponese. Per qualsiasi controversia il foro competente esclusivo è quello della sede dell'Editore.
            </p>
          </section>
        </div>
      )}

      {/* Tab 4: Contact & Operator */}
      {activeTab === 'contact' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
              Note legali e contatti
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Contattaci per domande, segnalazioni di errori, suggerimenti di funzionalità o richieste di collaborazione.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Organizzazione / Editore</span>
                <span className="text-sm font-extrabold text-slate-900">STONE PLANNING</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Nome del servizio</span>
                <span className="text-sm font-extrabold text-slate-900">Replenish (Casa) — Gestore cicli di consumo domestico</span>
                <span className="text-xs text-slate-500 block mt-0.5 font-mono">https://rppt.easy-log.app</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-xs text-slate-400 block font-semibold">E-mail di contatto</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <a 
                    href="mailto:stoooone.studio@gmail.com" 
                    className="text-sm font-extrabold text-emerald-700 hover:underline"
                  >
                    stoooone.studio@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
                    title="Copia indirizzo e-mail"
                  >
                    {copiedEmail ? (
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Le richieste via e-mail vengono ricevute 24 ore su 24 e gestite tempestivamente.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-slate-700 space-y-2">
            <h3 className="font-extrabold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Consigli utili per le richieste</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed font-medium">
              <li>In caso di segnalazione errori, specifica il dispositivo (iPhone, Android, Windows, Mac, ecc.) e il browser utilizzato (Chrome, Safari, Firefox, ecc.).</li>
              <li>Siamo sempre felici di ricevere suggerimenti per nuovi modelli o argomenti di guida!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
