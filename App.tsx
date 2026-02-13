
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Heart, Sparkles, Flame, Cloud, Stars, ChevronDown, Cat, PawPrint, Ghost } from 'lucide-react';

// --- Specialized Components ---

const SparkleTrail = () => {
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newSparkle = { id: Date.now(), x: e.clientX, y: e.clientY };
      setTrail((prev) => [...prev.slice(-15), newSparkle]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        {trail.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: sparkle.y + 20 }}
            exit={{ opacity: 0 }}
            className="absolute text-pink-200/60"
            style={{ left: sparkle.x, top: sparkle.y }}
          >
            <PawPrint size={14} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const RosePetals = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: `${Math.random() * 100}%`, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [`${Math.random() * 100}%`, `${(Math.random() * 100) + 10}%`, `${Math.random() * 100}%`],
            rotate: 360
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute text-rose-500/20"
        >
          <div className="w-4 h-6 bg-rose-400/30 rounded-full blur-[1px] rotate-45 shadow-inner" />
        </motion.div>
      ))}
    </div>
  );
};

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0c]">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%),radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.1),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.3, 0.3, 0],
            x: `${(Math.random() * 100) + (Math.sin(i) * 15)}vw`
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear"
          }}
          className="absolute text-pink-300/10"
        >
          {i % 5 === 0 ? <Cat size={Math.random() * 10 + 8} /> : 
           i % 3 === 0 ? <Heart size={Math.random() * 8 + 4} fill="currentColor" /> : 
           <div className="w-1 h-1 bg-white rounded-full blur-[1px]" />}
        </motion.div>
      ))}
    </div>
  );
};

const Typewriter = ({ text, delay = 60, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay, onComplete]);
  return <span className="inline-block">{displayedText}</span>;
};

const TimelineNode = ({ milestone, isLeft }: { milestone: any; isLeft: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative flex items-center justify-between mb-12 w-full ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className="w-[42%] md:w-[45%]">
        <motion.div 
          layout
          onClick={() => setIsOpen(!isOpen)}
          className="glass p-5 rounded-2xl cursor-pointer hover:border-pink-500/30 transition-colors group"
        >
          <span className="text-[10px] text-pink-400 font-mono tracking-[0.2em] uppercase mb-1 block">{milestone.date}</span>
          <h4 className="serif text-lg md:text-xl mb-1 text-pink-50 group-hover:text-pink-300 transition-colors">{milestone.title}</h4>
          <AnimatePresence>
            {isOpen && (
              <motion.p 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-sm text-pink-200/60 leading-relaxed mt-3 pt-3 border-t border-white/5"
              >
                {milestone.content}
              </motion.p>
            )}
          </AnimatePresence>
          {!isOpen && <p className="text-[10px] text-pink-400/40 mt-2 italic">Tap to reveal memory...</p>}
        </motion.div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] z-10 flex items-center justify-center">
        <PawPrint size={8} className="text-white" />
      </div>
      <div className="w-[42%] md:w-[45%]" />
    </motion.div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [scene, setScene] = useState<'question' | 'transition' | 'experience'>('question');
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ top: '50%', left: '70%' });
  const [questionStep, setQuestionStep] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [heartClicks, setHeartClicks] = useState(0);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const noPhrases = [
    "Are you sure, Hafsa?",
    "Hafsa, think again...",
    "Meow? You don't mean that 😌",
    "My tiny kitten heart can't take this...",
    "Don't make me hiss... last chance!",
    "You know you want to say yes, my queen ❤️"
  ];

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    const x = Math.random() * 60 + 20;
    const y = Math.random() * 60 + 20;
    setNoPosition({ top: `${y}%`, left: `${x}%` });
  };

  const handleYesClick = () => {
    setScene('transition');
    setTimeout(() => setScene('experience'), 2000);
  };

  useEffect(() => {
    if (heartClicks >= 5) setEasterEgg(true);
  }, [heartClicks]);

  return (
    <div className="relative min-h-screen w-full selection:bg-pink-500/30">
      <Background />
      <SparkleTrail />

      {scene === 'experience' && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-pink-500 z-[100] origin-left"
          style={{ scaleX }}
        />
      )}

      <AnimatePresence mode="wait">
        {scene === 'question' && (
          <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen px-4">
            <motion.div className="glass p-10 md:p-14 rounded-[2rem] max-w-xl w-full text-center relative overflow-hidden" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 1 }}>
              <div className="absolute top-0 left-0 w-full h-1 shimmer" />
              <motion.div 
                animate={{ rotate: [-10, 10, -10], scale: [1, 1.05, 1] }} 
                transition={{ duration: 4, repeat: Infinity }} 
                className="text-pink-400 mb-8 flex justify-center"
              >
                <Cat size={60} strokeWidth={1.5} />
              </motion.div>
              <h2 className="serif text-3xl md:text-5xl mb-8 text-pink-50 leading-tight">
                {questionStep === 0 && <Typewriter text="Hi Hafsa... There’s something I’ve been wanting to ask you…" onComplete={() => setTimeout(() => setQuestionStep(1), 1200)} />}
                {questionStep === 1 && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{noCount < noPhrases.length ? "Will you be my Valentine?" : noPhrases[noPhrases.length - 1]}</motion.div>}
              </h2>
              {questionStep === 1 && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6">
                  <motion.button
                    onClick={handleYesClick}
                    style={{ scale: 1 + (noCount * 0.15) }}
                    className="px-10 py-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full font-semibold text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all z-10 flex items-center gap-2"
                    whileHover={{ scale: 1.1 + (noCount * 0.15) }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart size={18} fill="currentColor" /> Yes, I will!
                  </motion.button>
                  {noCount < 12 && (
                    <motion.button
                      onClick={handleNoClick}
                      className={`px-8 py-3 glass rounded-full font-medium text-pink-200/60 hover:text-pink-100 transition-all ${noCount > 0 ? 'fixed' : ''}`}
                      style={{ 
                        top: noCount > 0 ? noPosition.top : 'auto', 
                        left: noCount > 0 ? noPosition.left : 'auto',
                        scale: Math.max(0.3, 1 - (noCount * 0.1)),
                        opacity: Math.max(0.1, 1 - (noCount * 0.1))
                      }}
                    >
                      {noCount === 0 ? "😏 No" : noPhrases[Math.min(noCount - 1, noPhrases.length - 2)]}
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {scene === 'transition' && (
          <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 2, 50] }} transition={{ duration: 2 }} className="text-pink-500">
               <Cat size={80} fill="currentColor" />
            </motion.div>
            <div className="absolute inset-0">
               {[...Array(40)].map((_, i) => (
                 <motion.div key={i} initial={{ x: '50vw', y: '50vh' }} animate={{ x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, opacity: 0, scale: Math.random() * 3 }} transition={{ duration: 1.8, ease: "circOut" }} className="absolute text-yellow-400"><PawPrint size={24} /></motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {scene === 'experience' && (
          <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {/* Section 1 */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
                <div className="flex justify-center mb-6 text-pink-400">
                   <Cat size={48} />
                </div>
                <h1 className="serif text-5xl md:text-7xl text-pink-100 mb-8 max-w-4xl">Hafsa, you just made me the happiest person alive.</h1>
                <p className="max-w-2xl text-xl text-pink-200/60 leading-relaxed font-light italic">
                  "From the moment I met you, my world gained a color I never knew existed. You are the purr-fect magic in my noisy life, the warmth on my coldest days, and the person I want to wake up next to (and maybe pet some cats with) every single morning."
                </p>
                <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-20 text-pink-400/40 flex flex-col items-center gap-2">
                   <ChevronDown size={24} />
                   <p className="text-[10px] uppercase tracking-[0.3em]">Scroll for our story</p>
                </motion.div>
              </motion.div>
            </section>

            {/* Section 2: Reasons */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
              <motion.h2 className="serif text-4xl md:text-5xl text-center mb-20 text-pink-100" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Reasons I Love You, Hafsa</motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Your soul", icon: <Sparkles />, desc: "Beautiful and glowing, just like you." },
                  { title: "Your energy", icon: <Flame />, desc: "The warmth you bring to my life every day." },
                  { title: "Your kindness", icon: <Cat />, desc: "How gentle and caring you are with everyone." },
                  { title: "Your strength", icon: <Stars />, desc: "You inspire me to be better every single day." },
                  { title: "Your comfort", icon: <Cloud />, desc: "The safe haven I find in your arms." },
                  { title: "Your eyes", icon: <Stars />, desc: "I could get lost in them for lifetimes." },
                  { title: "Your laugh", icon: <Heart />, desc: "My absolute favorite sound in the world." },
                  { title: "Just You", icon: <Cat />, desc: "Because there is nobody like Hafsa." },
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }} className="glass p-10 rounded-3xl text-center group">
                    <div className="text-pink-400 mb-6 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                    <h3 className="serif text-2xl mb-3 text-pink-50">{item.title}</h3>
                    <p className="text-sm text-pink-200/40 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section 3: Timeline */}
            <section className="py-24 px-6 overflow-hidden">
              <motion.h2 className="serif text-4xl md:text-5xl text-center mb-24 text-pink-100" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>Our Journey</motion.h2>
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-pink-500/20 to-transparent -translate-x-1/2" />
                {[
                  { date: "Day Zero", title: "When Hafsa entered my life", content: "I remember exactly where we were. The world felt like it shifted just a little bit, making room for us." },
                  { date: "The Connection", title: "Our First Deep Chat", content: "That effortless flow where we realized our souls spoke the same language. I never wanted it to end." },
                  { date: "The Spark", title: "The First Time We Laughed", content: "When I knew that making you happy would be my life's favorite mission. Your joy is infectious." },
                  { date: "The Heart", title: "That Favorite Day", content: "That time we lost track of everything except each other. The perfect afternoon that I keep in my heart." },
                  { date: "Forever", title: "Today ❤️", content: "Each day with you, Hafsa, is a new chapter in the most beautiful story ever written." },
                ].map((milestone, idx) => <TimelineNode key={idx} milestone={milestone} isLeft={idx % 2 === 0} />)}
              </div>
            </section>

            {/* Section 4: Promises */}
            <section className="py-32 px-6">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h2 className="serif text-4xl md:text-5xl mb-16 text-pink-100" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>Hafsa, I promise to...</motion.h2>
                <div className="space-y-8">
                  {[
                    "Always choose you, through every sunrise and sunset.",
                    "Be the place you can always come home to.",
                    "Protect your heart as if it were my own soul.",
                    "Keep finding new reasons to fall for you (and more cat videos to show you).",
                    "Walk beside you, whatever the path may bring.",
                    "Love you more today than yesterday, but less than tomorrow."
                  ].map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-2xl md:text-3xl text-pink-200/70 font-light leading-snug">
                      {p}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final Scene */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-gradient-to-t from-pink-950/20 to-transparent">
              <RosePetals />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="z-10">
                <h2 className="serif text-5xl md:text-8xl text-pink-50 mb-12 drop-shadow-2xl">This is just the beginning of our forever, Hafsa.</h2>
                <button onClick={() => setHeartClicks(h => h + 1)} className="relative group p-6 transition-transform hover:scale-110 active:scale-95">
                  <motion.div className="text-pink-500 animate-heartbeat relative z-10 filter drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    <Cat size={140} strokeWidth={1} fill="currentColor" />
                  </motion.div>
                  <div className="absolute inset-0 bg-pink-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                </button>
                <div className="mt-16">
                  <p className="text-2xl md:text-3xl serif italic text-pink-100">Happy Valentine’s Day, my love ❤️</p>
                  <p className="text-[10px] mt-6 text-pink-400 font-bold tracking-[0.5em] uppercase opacity-60">Meow & Forever • Hafsa</p>
                </div>
                <AnimatePresence>
                  {easterEgg && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 glass py-4 px-8 rounded-full text-pink-100 text-sm italic shadow-2xl">
                      “Hafsa, you found my secret. I love you more than all the stars in the sky.”
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            <footer className="py-16 text-center text-pink-400/20 text-[10px] tracking-[0.3em] uppercase">
              Dedicated to Hafsa • An Eternal Valentine • 2024
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
