/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import supabase from '../supabase.js';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Heart, 
  Home as HomeIcon, 
  Users, 
  Sparkles, 
  Brain, 
  Briefcase, 
  Stethoscope, 
  BookOpen, 
  MessageCircle, 
  Cross,
  Menu,
  X,
  Play
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Page = 'home' | 'diagnosis' | 'result' | 'sales';

interface DiagnosisData {
  espiritual: number;
  casamento: number;
  filhos: number;
  lar: number;
  saude: number;
  mente: number;
  intelectual: number;
  profissional: number;
  social: number;
  relacionamentos: number;
}

const INITIAL_DIAGNOSIS: DiagnosisData = {
  espiritual: 5,
  casamento: 5,
  filhos: 5,
  lar: 5,
  saude: 5,
  mente: 5,
  intelectual: 5,
  profissional: 5,
  social: 5,
  relacionamentos: 5,
};

const AREAS = [
  { id: 'espiritual', label: 'Espiritual', icon: Cross },
  { id: 'casamento', label: 'Casamento', icon: Heart },
  { id: 'filhos', label: 'Filhos', icon: Users },
  { id: 'lar', label: 'Lar', icon: HomeIcon },
  { id: 'saude', label: 'Saúde / Autocuidado', icon: Stethoscope },
  { id: 'mente', label: 'Mente', icon: Brain },
  { id: 'intelectual', label: 'Intelectual', icon: BookOpen },
  { id: 'profissional', label: 'Profissional', icon: Briefcase },
  { id: 'social', label: 'Social', icon: Sparkles },
  { id: 'relacionamentos', label: 'Relacionamentos', icon: MessageCircle },
];

const LOGO_URL = "https://lh3.googleusercontent.com/d/1lPbdKYASJpvvSoWq0jsuCCIOotF6FiAa";
const LOGO_WHITE_URL = "https://lh3.googleusercontent.com/d/1t8qAj0MkyynCrs5lxmnEk7OB2rPrG-tc";
const LOGO_TEXT_URL = "https://lh3.googleusercontent.com/d/1vCAD1c5fwycHPGNhuNtOaQiIFQ5v_lMi";
const LOGO_TEXT_ONLY_URL = "https://lh3.googleusercontent.com/d/1eIGKF8RosYrR0NAiCFs5rkvHmuexSkHA";
const SONJA_PHOTO = "https://lh3.googleusercontent.com/d/1a-HFeGkgBDyUCAty8tIJSoUvIv4CkBVv";

// --- Components ---

const BackgroundElements = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
    <motion.div 
      animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 left-[10%]"
    ><Cross size={120} /></motion.div>
    
    <motion.div 
      animate={{ y: [0, 20, 0], rotate: [-12, -15, -12] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-40 right-[15%]"
    ><Heart size={80} /></motion.div>
    
    <motion.div 
      animate={{ x: [0, 30, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[60%] left-[5%]"
    ><ArrowRight size={100} className="rotate-[-45deg]" /></motion.div>
    
    <motion.div 
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[80%] right-[10%]"
    ><Users size={90} /></motion.div>
    
    <motion.div 
      animate={{ rotate: [12, 0, 12] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-20 left-[20%]"
    ><HomeIcon size={110} /></motion.div>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
      <div className="relative w-[800px] h-[800px]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2"><Stethoscope size={60} /></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2"><Brain size={60} /></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2"><BookOpen size={60} /></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2"><Briefcase size={60} /></div>
        <div className="absolute top-[15%] left-[15%]"><Sparkles size={60} /></div>
        <div className="absolute top-[15%] right-[15%]"><MessageCircle size={60} /></div>
      </div>
    </div>
  </div>
);

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const variants = {
    primary: 'bg-olive text-beige hover:bg-opacity-90 shadow-lg',
    secondary: 'gold-gradient text-olive font-bold hover:scale-105 transition-transform shadow-xl',
    outline: 'border-2 border-olive text-olive hover:bg-olive hover:text-beige',
  };

  return (
    <button 
      className={cn(
        'px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const SectionHeading = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="text-center mb-16 px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn("w-12 h-[1px] mx-auto mb-6", light ? "bg-gold" : "bg-gold")}
    />
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight", light ? "text-beige" : "text-olive")}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn("text-lg md:text-xl max-w-2xl mx-auto opacity-80 font-light leading-relaxed", light ? "text-beige" : "text-olive")}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// --- Pages ---

const Home = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {

  return (
    <div className="bg-texture relative">
      <BackgroundElements />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-10 pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-olive/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block"
          >
            <div className="space-y-4">
              <img 
                src={LOGO_TEXT_ONLY_URL} 
                alt="Maternidade com Propósito" 
                className="h-24 md:h-40 mx-auto mb-0 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="w-16 h-[1px] bg-gold/30 mx-auto" />
              <span className="block text-[10px] md:text-xs text-olive/60 tracking-[0.2em] uppercase max-w-xs mx-auto leading-relaxed">
                Somos arqueiros que precisamos ser preparados para formar flechas
              </span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[50px] leading-[49px] font-serif font-normal text-olive mb-8 tracking-tight"
          >
            Aprenda a fortalecer sua casa e formar filhos com <span className="font-bold text-gold">valores e direção</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[19px] font-normal text-olive/80 max-w-2xl mx-auto mb-6 leading-relaxed tracking-wide"
          >
            Você não está cansada da rotina.<br />
            Você está cansada de sustentar tudo<br />
            <span className="font-bold">sem estrutura</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button variant="secondary" onClick={onStartDiagnosis} className="text-lg px-12 py-6 tracking-widest">
              FAZER MEU DIAGNÓSTICO <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="py-24 bg-olive text-beige">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="A exaustão que ninguém vê" 
            subtitle="O peso que você carrega não é falta de amor, é falta de um centro."
            light
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sobrecarga Invisível",
                desc: "Você sente que se parar por um segundo, tudo desmorona. O peso da gestão emocional da casa está drenando sua energia."
              },
              {
                title: "Desorganização da Alma",
                desc: "Não é sobre gavetas arrumadas. É sobre sentir que seus dias passam e você não está construindo nada eterno."
              },
              {
                title: "Falta de Direção",
                desc: "Você ama seus filhos, mas teme que eles estejam crescendo sem os valores que você tanto preza, por falta de estrutura."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-10 rounded-3xl border border-beige/10 bg-beige/5 backdrop-blur-sm hover:bg-beige/10 transition-all duration-500 group"
              >
                <div className="w-10 h-[1px] bg-gold mb-6 group-hover:w-20 transition-all duration-500" />
                <h3 className="text-xl font-serif mb-6 text-gold tracking-widest uppercase">{item.title}</h3>
                <p className="text-beige/70 leading-relaxed tracking-wide text-sm font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center max-w-4xl mx-auto"
          >
            <p className="text-2xl md:text-3xl font-serif italic text-gold leading-relaxed">
              "O problema não é sua rotina. É que você está tentando sustentar sua vida sem um centro."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <SectionHeading 
                title="O Método: Roda do Propósito" 
                subtitle="Existem 10 áreas que sustentam a sua vida. Quando uma falha, o peso recai sobre todas as outras."
              />
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <CheckCircle2 />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Diagnóstico Preciso</h4>
                    <p className="text-olive/70">Identifique exatamente onde está o vazamento de energia da sua casa.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <CheckCircle2 />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Estrutura de Sustentação</h4>
                    <p className="text-olive/70">Aprenda a colocar Deus no centro e organizar as outras 9 áreas ao redor Dele.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <CheckCircle2 />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Legado para os Filhos</h4>
                    <p className="text-olive/70">Forme filhos com valores inabaláveis através de uma mãe estruturada.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 bg-gold p-6 rounded-2xl shadow-xl text-olive max-w-[280px] relative z-10">
                <p className="font-bold text-sm uppercase tracking-wider mb-2">Área Crítica</p>
                <p className="text-xs opacity-80">Descubra qual área está te esgotando hoje através do nosso diagnóstico exclusivo.</p>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square bg-white rounded-full shadow-2xl p-8 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={AREAS.map(a => ({ subject: a.label, A: 80 }))}>
                    <PolarGrid stroke="#556B2F" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#556B2F', fontSize: 10 }} />
                    <Radar
                      name="Ideal"
                      dataKey="A"
                      stroke="#D4AF37"
                      fill="#D4AF37"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-beige border-y border-gold/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Pronta para parar de apenas <span className="italic">sobreviver</span>?</h2>
          <p className="text-xl text-olive/70 mb-12 max-w-2xl mx-auto">
            O diagnóstico é o primeiro passo para a liberdade. Descubra sua pontuação e receba seu direcionamento.
          </p>
          <div className="flex justify-center">
            <Button variant="outline" onClick={onStartDiagnosis} className="text-xl px-16 py-8">
              FAZER DIAGNÓSTICO GRATUITO
            </Button>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="relative group">
                <motion.div 
                  initial={{ rotate: 6 }}
                  whileHover={{ rotate: 0 }}
                  className="absolute -inset-4 border border-gold/20 rounded-3xl transition-all duration-700" 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <img 
                    src={SONJA_PHOTO} 
                    alt="Sonja - Fundadora MCP" 
                    className="relative rounded-3xl shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 w-full object-cover aspect-[4/5]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-dark rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-beige text-sm font-serif italic">"Sua casa é o seu maior projeto."</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4">Quem te guia</h3>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Eu sei o que é carregar o mundo nas costas.</h2>
              <div className="space-y-6 text-lg text-olive/80 leading-relaxed font-serif italic">
                <p>
                  "Por muito tempo, acreditei que ser uma 'boa mãe' era sinônimo de exaustão. Que o cansaço era o preço a se pagar pelo amor."
                </p>
                <p>
                  "Mas descobri que Deus não nos chamou para o esgotamento, mas para a <span className="font-bold text-gold">plenitude com ordem</span>. O MCP™ nasceu da necessidade de dar às mulheres uma estrutura que sustente sua fé, sua casa e seu futuro."
                </p>
                <p>
                  "Não sou uma coach de produtividade. Sou uma mãe que encontrou o centro e quer te ajudar a fazer o mesmo."
                </p>
              </div>
              <div className="mt-10 h-[1px] w-24 bg-gold/30" />
              <div className="mt-6">
                <p className="text-gold font-bold text-lg">Sonja Chacon</p>
                <p className="text-[10px] tracking-widest uppercase opacity-50">Fundadora do Maternidade com Propósito</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const Diagnosis = ({ onComplete, onStartDiagnosis, onLeadCreated }: { onComplete: (data: DiagnosisData, formData?: { name: string; email: string; whatsapp: string }) => void, onStartDiagnosis?: () => void, onLeadCreated?: (lead: any) => void }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [scores, setScores] = useState<DiagnosisData>(INITIAL_DIAGNOSIS);

  const isFormValid = formData.name.length > 2 && formData.email.includes('@') && formData.whatsapp.length > 8;

  const handleNext = () => {
    if (step < AREAS.length) {
      setStep(step + 1);
    } else {
      // On final step (step 10), pass both scores and form data
      onComplete(scores, formData);
    }
  };

  const handleInscricao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    const { data, error } = await supabase
      .from('LEADS')
      .insert([
        { nome: formData.name, email: formData.email, whatsApp: formData.whatsapp },
      ]);

    if (error) {
      console.log(error);
      window.alert(error.message || JSON.stringify(error));
      return;
    }

    if (data && data[0]) {
      if (onLeadCreated) onLeadCreated(data[0]);
      try {
        // persist lead id locally so it can be used later when updating scores
        const createdId = data[0].id;
        if (createdId) {
          localStorage.setItem('leadId', String(createdId));
        }
      } catch (err) {
        console.warn('Could not persist lead id to localStorage', err);
      }
    }

    window.alert('Sucesso!');
    // proceed to next step/screen
    handleNext();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentArea = AREAS[step - 1];

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundElements />
      <motion.div 
        layout
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-gold/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gold/5">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (AREAS.length + 1)) * 100}%` }}
          />
        </div>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-serif mb-4 tracking-tight">Comece seu Diagnóstico</h2>
                <p className="text-olive/60 tracking-wide">Precisamos saber quem você é para gerar seu resultado personalizado.</p>
              </div>
              <form onSubmit={handleInscricao} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Seu Nome</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl border border-olive/10 focus:border-gold outline-none transition-all duration-300 bg-beige/30"
                    placeholder="Como quer ser chamada?"
                    name="nome"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Seu Melhor E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl border border-olive/10 focus:border-gold outline-none transition-all duration-300 bg-beige/30"
                    placeholder="Onde enviaremos seu resultado?"
                    name="email"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Seu WhatsApp</label>
                  <input 
                    type="tel" 
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl border border-olive/10 focus:border-gold outline-none transition-all duration-300 bg-beige/30"
                    placeholder="(00) 00000-0000"
                    name="whatsapp"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-6 tracking-[0.2em]"
                  disabled={!isFormValid}
                >
                  INICIAR TESTE <ChevronRight />
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Área {step} de 10</span>
                <div className="flex gap-1">
                  {AREAS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-6 h-1 rounded-full transition-all duration-500",
                        i < step ? "bg-gold" : "bg-olive/10"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                  <currentArea.icon size={32} />
                </div>
                <h2 className="text-3xl font-serif mb-4 tracking-tight">{currentArea.label}</h2>
                <p className="text-olive/60 italic text-sm tracking-wide">
                  "Não responda com quem você gostaria de ser.<br />
                  Responda com quem você foi nos últimos 30 dias."
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex justify-between text-[10px] font-bold text-olive/40 uppercase tracking-[0.2em]">
                  <span>Extremo Negativo (0)</span>
                  <span>Extremo Positivo (10)</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={scores[currentArea.id as keyof DiagnosisData]}
                  onChange={e => setScores({...scores, [currentArea.id]: parseInt(e.target.value)})}
                  className="w-full h-1 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="text-center text-6xl font-serif text-gold opacity-80">
                  {scores[currentArea.id as keyof DiagnosisData]}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 py-4 text-[10px] tracking-widest" onClick={handlePrev}>
                  Voltar
                </Button>
                <Button variant="primary" className="flex-[2] py-4 text-[10px] tracking-widest" onClick={handleNext}>
                  {step === 10 ? 'VER MEU DIAGNÓSTICO' : 'PRÓXIMA ÁREA'} <ChevronRight />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Result = ({ data, onGoToSales }: { data: DiagnosisData, onGoToSales: () => void }) => {
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Score saving is now handled only at form submission with name/email/whatsapp

  const handleDownload = async () => {
    if (!resultRef.current) {
      console.error('❌ Result ref is not available');
      window.alert('Erro: Não foi possível capturar a imagem. Tente novamente.');
      return;
    }
    try {
      console.log('📸 Starting capture from resultRef...');
      // Wait for Radar chart to fully render before capturing
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Waited for render, now capturing...');
      
      const canvas = await html2canvas(resultRef.current as HTMLElement, { 
        useCORS: true, 
        scale: 2,
        backgroundColor: '#f5f0e8',
        logging: true,
        allowTaint: false
      });
      console.log('📸 Canvas capture successful, dimensions:', canvas.width, 'x', canvas.height);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const watermark = '@sonjachacon';
        const padding = 16 * (window.devicePixelRatio || 1);
        ctx.font = `${24 * (window.devicePixelRatio || 1)}px sans-serif`;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        const textMetrics = ctx.measureText(watermark);
        const x = canvas.width - padding - textMetrics.width;
        const y = canvas.height - padding / 2;
        ctx.fillText(watermark, x, y);
        console.log('✅ Watermark added');
      }

      const url = canvas.toDataURL('image/png');
      console.log('✅ Image generated, size:', url.length, 'bytes');
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'meu_resultado.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('✅ Download triggered successfully');
    } catch (err) {
      console.error('❌ Download error:', err);
      console.error('Error type:', err instanceof Error ? err.message : String(err));
      window.alert('Erro ao baixar imagem. Tente novamente ou clique e segure na imagem para salvar.');
    }
  };
  const chartData = useMemo(() => {
    return AREAS.map(area => ({
      subject: area.label,
      A: data[area.id as keyof DiagnosisData] * 10,
    }));
  }, [data]);

  const criticalArea = useMemo(() => {
    const sorted = [...AREAS].sort((a, b) => 
      data[a.id as keyof DiagnosisData] - data[b.id as keyof DiagnosisData]
    );
    return sorted[0];
  }, [data]);

  return (
    <div className="min-h-screen bg-beige py-12 px-4 relative overflow-hidden">
      <BackgroundElements />
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 text-center"
        >
          <h2 className="text-gold font-bold tracking-widest uppercase text-sm mb-4">Seu Diagnóstico foi gerado</h2>
          <h1 className="text-4xl md:text-6xl font-serif mb-12">O retrato da sua <span className="italic">estrutura atual</span></h1>
          
          <div ref={resultRef}>
            <div className="aspect-square max-w-md mx-auto mb-12 relative">
              <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl animate-pulse" />
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#542916" strokeOpacity={0.1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#542916', fontSize: 10, fontWeight: 300 }} />
                  <Radar
                    name="Você"
                    dataKey="A"
                    stroke="#c1884a"
                    fill="#c1884a"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-olive/5 p-8 rounded-2xl mb-8 text-left border border-olive/10">
              <h3 className="text-2xl font-serif mb-4 flex items-center gap-2">
                <span className="text-gold"><Sparkles /></span> Área Crítica: {criticalArea.label}
              </h3>
              <p className="text-olive/80 leading-relaxed tracking-wide">
                Sua pontuação nesta área indica que ela é o principal ponto de vazamento de energia na sua vida hoje. Quando o <span className="font-bold">{criticalArea.label}</span> está desestruturado, ele sobrecarrega todas as outras áreas, criando o ciclo de exaustão que você sente.
              </p>
              <p className="text-olive/60 text-sm mt-6 italic">
                Área Crítica: <span className="font-bold">{criticalArea.label}</span> - Tire um print/printscreen desta tela para guardar o seu resultado.
              </p>
            </div>
          </div>

          <div className="space-y-8 max-w-2xl mx-auto">
            <div>
              <p className="text-2xl font-serif italic text-olive/60 leading-relaxed mb-3">
                "Visualizar o problema é o primeiro passo,
              </p>
              <p className="text-3xl font-serif italic font-bold text-olive leading-relaxed">
                mas visualizar não resolve."
              </p>
            </div>
            <a 
              href="https://pay.hotmart.com/O104824255V?bid=1774973353512"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block w-full px-8 py-8 rounded-2xl text-center",
                "bg-olive text-beige font-medium transition-all duration-300",
                "hover:bg-olive/90 text-xl tracking-widest",
                "no-underline"
              )}
            >
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <span className="text-sm font-semibold leading-tight">LIVE DE APROFUNDAMENTO MCP</span>
                <span className="text-xs opacity-90 mt-1">Sábado, 11 de Abril, às 20h (Horário de Brasília)</span>
                <span className="text-base font-bold mt-2">GARANTIR MINHA VAGA ✨</span>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Sales = () => {

  return (
    <div className="min-h-screen bg-beige pt-20 relative">
      <BackgroundElements />
      
      {/* Hero Sales */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 border border-gold/10"
          >
            <h2 className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-6">Convite Exclusivo</h2>
            <h1 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              A estrutura que falta para você <span className="italic text-gold">deixar de apenas sobreviver</span>
            </h1>
            <p className="text-xl text-olive/70 mb-12 leading-relaxed max-w-2xl mx-auto tracking-wide">
              O diagnóstico mostrou onde você está perdendo energia. Agora, eu vou te mostrar como fechar esses vazamentos e construir um alicerce inabalável.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
              <div className="bg-beige/30 p-8 rounded-2xl border border-gold/5">
                <h3 className="font-serif text-xl mb-4 text-olive">O que você vai aprender:</h3>
                <ul className="space-y-4 text-sm text-olive/70">
                  <li className="flex items-start gap-3"><span className="text-gold">✓</span> A Geometria do Propósito</li>
                  <li className="flex items-start gap-3"><span className="text-gold">✓</span> Como blindar sua rotina sem ser rígida</li>
                  <li className="flex items-start gap-3"><span className="text-gold">✓</span> O segredo das mães que não vivem exaustas</li>
                </ul>
              </div>
              <div className="bg-beige/30 p-8 rounded-2xl border border-gold/5">
                <h3 className="font-serif text-xl mb-4 text-olive">Detalhes da Aula:</h3>
                <ul className="space-y-4 text-sm text-olive/70">
                  <li className="flex items-start gap-3"><span className="text-gold">📅</span> Sábado, 11 de Abril</li>
                  <li className="flex items-start gap-3"><span className="text-gold">⏰</span> Às 19h (Horário de Brasília)</li>
                  <li className="flex items-start gap-3"><span className="text-gold">📍</span> Transmissão Online</li>
                </ul>
              </div>
            </div>

            <a
              href="https://pay.hotmart.com/O104824255V?bid=1774973353512"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block w-full px-8 py-8 rounded-2xl text-center",
                "bg-olive text-beige font-medium transition-all duration-300",
                "hover:bg-olive/90 text-2xl tracking-[0.2em]",
                "no-underline"
              )}
            >
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-sm font-semibold leading-tight">LIVE DE APROFUNDAMENTO MCP</span>
                <span className="text-xs opacity-90 mt-1">Sábado, 11 de Abril, às 20h (Horário de Brasília)</span>
                <span className="text-base font-bold mt-2">GARANTIR MINHA VAGA ✨</span>
              </div>
            </a>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-olive/40">Vagas limitadas para garantir a qualidade da interação</p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-olive text-beige overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="relative">
              <div className="absolute -inset-4 border border-gold/20 rounded-2xl rotate-6" />
              <div className="w-72 h-96 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src={SONJA_PHOTO} 
                  alt="Sonja" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="space-y-8 flex-1">
              <h2 className="text-4xl font-serif tracking-tight">Sobre a Mentoria <span className="text-gold">MCP™</span></h2>
              <div className="space-y-6 text-lg text-beige/70 leading-relaxed italic font-serif">
                <p>"Minha missão é ajudar mães a entenderem que o cansaço não é o destino final."</p>
                <p>"Existe uma estrutura, baseada em princípios eternos, que devolve a paz e o propósito para o lar."</p>
              </div>
              <div className="h-[1px] w-24 bg-gold/30" />
              <div>
                <p className="text-gold font-bold text-lg mb-1">Sonja Chacon</p>
                <p className="text-[10px] tracking-widest uppercase opacity-50">Fundadora do Maternidade com Propósito</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [lead, setLead] = useState<any | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const startDiagnosis = () => setCurrentPage('diagnosis');
  const completeDiagnosis = async (data: DiagnosisData, formData?: { name: string; email: string; whatsapp: string }) => {
    setDiagnosisData(data);
    console.log('📈 Diagnosis completed - transitioning to Result screen');
    console.log('Form data:', formData);
    console.log('Note: Scores are not persisted to Supabase per requirements. Lead data (name/email/whatsapp) saved during form submission.');
    
    setCurrentPage('result');
  };
  const goToSales = () => setCurrentPage('sales');

  return (
    <div className="min-h-screen selection:bg-gold selection:text-olive">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-beige/80 backdrop-blur-md border-b border-gold/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="cursor-pointer flex items-center"
            onClick={() => setCurrentPage('home')}
          >
            <img 
              src={LOGO_TEXT_URL} 
              alt="Maternidade com Propósito" 
              className="h-8 md:h-12 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="flex items-center gap-6">
            {currentPage === 'home' && (
              <Button variant="outline" onClick={startDiagnosis} className="px-6 py-2 text-[10px] tracking-widest">
                DIAGNÓSTICO
              </Button>
            )}
            <Button variant="primary" onClick={goToSales} className="px-6 py-2 text-[10px] tracking-widest">
              AULA AO VIVO
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Home onStartDiagnosis={startDiagnosis} />
            </motion.div>
          )}

          {currentPage === 'diagnosis' && (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Diagnosis onComplete={completeDiagnosis} onStartDiagnosis={startDiagnosis} onLeadCreated={(l) => setLead(l)} />
            </motion.div>
          )}

          {currentPage === 'result' && diagnosisData && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Result data={diagnosisData} onGoToSales={goToSales} />
            </motion.div>
          )}

          {currentPage === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sales />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentPage !== 'diagnosis' && (
        <footer className="py-16 bg-olive text-beige/50 text-center border-t border-beige/10">
          <div className="flex flex-col items-center gap-6 mb-8">
            <img 
              src={LOGO_TEXT_URL} 
              alt="Maternidade com Propósito" 
              className="h-16 md:h-20 object-contain opacity-80 brightness-0 invert"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2">
              <span className="block font-serif tracking-[0.4em] text-gold text-lg">MATERNIDADE COM PROPÓSITO</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase opacity-60 max-w-xs mx-auto">
                Somos arqueiros que precisamos ser preparados para formar flechas
              </span>
            </div>
          </div>
          <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-8" />
          <p className="text-[10px] tracking-widest uppercase opacity-40">© 2026 Maternidade com Propósito (MCP™). Todos os direitos reservados.</p>
        </footer>
      )}
    </div>
  );
}

