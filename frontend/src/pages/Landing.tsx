
import { Link } from 'react-router-dom';
import {
  Cloud,
  Shield,
  FolderOpen,
  ArrowRight,
  Upload,
  Menu,
  X,
  Users,
  Github,
  Lock,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-md border-b border-[var(--border-color)]" : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">How it Works</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors">
              Log in
            </Link>
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[var(--text-primary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-[var(--border-color)] overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">How it Works</a>
              <hr className="border-[var(--border-color)]" />
              <Link to="/login" className="text-sm font-medium">Log in</Link>
              <Link to="/login" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium text-center">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] mb-6 border border-[var(--border-default)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
              <span className="text-xs font-medium uppercase tracking-wide">Powered by Telegram</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[var(--text-primary)] leading-[1.1]">
              Unlimited Free Storage.<br className="hidden md:block" />
              <span className="text-[var(--text-secondary)]">Private. Simple.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-4 leading-relaxed">
              Stop deleting photos to clear space. <br className="hidden md:block" />
              Get <strong>True Unlimited Cloud Storage</strong> for free, leveraging the power of Telegram.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
              <Link
                to="/login"
                className="bg-black text-white h-12 px-8 rounded-md font-medium text-base hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="bg-transparent hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] h-12 px-8 rounded-md font-medium text-base transition-colors flex items-center border border-transparent hover:border-[var(--border-color)]"
              >
                How It Works
              </a>
            </div>

            {/* Architecture Visual in Hero */}
            <div className="relative max-w-4xl mx-auto mt-16">
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-8 md:p-12 overflow-hidden relative">
                <div className="text-center mb-12">
                  <h3 className="text-lg font-semibold mb-2">No Middlemen. Just You and Telegram.</h3>
                  <p className="text-sm text-[var(--text-secondary)]">We don't store your files on our servers. We just help you manage them.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative z-10 max-w-3xl mx-auto">

                  {/* Telebox Side */}
                  <div className="w-full md:w-1/3 bg-white rounded-xl border border-[var(--border-color)] p-6 shadow-sm text-center relative z-20">
                    <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/10">
                      <Cloud size={24} fill="currentColor" />
                    </div>
                    <h4 className="font-semibold mb-1">Telebox</h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Your beautiful interface to organize folders and files.
                    </p>
                  </div>

                  {/* Connection Animation */}
                  <div className="flex-1 flex flex-row md:flex-col items-center justify-center relative w-full h-12 md:h-24">
                    {/* Horizontal Line for Desktop */}
                    <div className="hidden md:block w-full h-[2px] bg-[var(--border-strong)] relative rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-repeating-linear-gradient-to-r from-transparent via-[var(--border-color)] to-transparent w-full h-full" />

                      {/* Packets moving right (Upload) */}
                      <motion.div
                        className="absolute top-0 bottom-0 w-8 bg-black/80 rounded-full"
                        animate={{ x: ["-100%", "400%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                      {/* Packets moving left (Download) */}
                      <motion.div
                        className="absolute top-0 bottom-0 w-8 bg-[#229ED9] rounded-full"
                        animate={{ x: ["400%", "-100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
                      />
                    </div>

                    {/* Vertical Line for Mobile */}
                    <div className="md:hidden h-full w-[2px] bg-[var(--border-strong)] relative rounded-full overflow-hidden my-4">
                      <motion.div
                        className="absolute left-0 right-0 h-4 bg-black/80 rounded-full"
                        animate={{ y: ["-100%", "400%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    <div className="absolute bg-[var(--bg-secondary)] px-3 py-1 text-[10px] font-mono text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-full z-10">
                      TELEGRAM API
                    </div>
                  </div>

                  {/* Telegram Side */}
                  <div className="w-full md:w-1/3 bg-white border border-[#229ED9]/20 p-6 rounded-xl shadow-sm text-center relative z-20">
                    <img src="/telegram_logo.svg" alt="Telegram" className="w-12 h-12 mx-auto mb-4" />
                    <h4 className="font-semibold mb-1">Telegram Cloud</h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Unlimited storage. Encrypted by Telegram.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="max-w-5xl mx-auto px-6 mb-32">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
            <p className="text-[var(--text-secondary)]">Powerful features wrapped in a simple interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Unlimited */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg border border-[var(--border-default)] p-8 hover:bg-[var(--bg-secondary)] transition-all group flex flex-col"
            >
              <div className="w-10 h-10 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md flex items-center justify-center mb-6">
                <Cloud size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Unlimited & Free</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                We leverage Telegram's unlimited cloud infrastructure to give you infinite space for your files. No 15GB limits. No monthly subscriptions.
              </p>
            </motion.div>

            {/* Card 2: Secure */}
            <Link to="/security" className="block h-full">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg border border-[var(--border-default)] p-8 hover:bg-[var(--bg-secondary)] transition-all group flex flex-col h-full cursor-pointer"
              >
                <div className="w-10 h-10 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md flex items-center justify-center mb-6">
                  <Shield size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-2">
                  Secure
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--text-tertiary)]" />
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                  <strong>100% Private.</strong> We technically can't read your files or see your folder names. Only you have access to your data.
                </p>
                <div className="mt-auto text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  Learn how it works →
                </div>
              </motion.div>
            </Link>

            {/* Card 3: Organization */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg border border-[var(--border-default)] p-8 hover:bg-[var(--bg-secondary)] transition-all group flex flex-col"
            >
              <div className="w-10 h-10 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md flex items-center justify-center mb-6">
                <FolderOpen size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Easy to Organize</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                Turn your chaotic chat history into a structured drive. Create folders, subfolders, and search your files just like on your computer.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-semibold tracking-tight mb-4 text-[var(--text-primary)]">How it works</h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto text-lg">
              Four simple steps to unlimited freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="group">
              <div className="bg-white border border-[var(--border-default)] rounded-xl p-6 h-64 mb-6 relative overflow-hidden flex flex-col items-center justify-center transition-all hover:border-[var(--border-strong)]">
                {/* Visual: Login Form */}
                <div className="w-40 bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-default)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm">
                  <div className="w-8 h-8 bg-[#229ED9] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                  </div>
                  <div className="h-2 bg-[var(--border-default)] rounded w-full mb-2"></div>
                  <div className="h-8 bg-[var(--text-primary)] rounded w-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-0.5 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-0.5 animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-0.5 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Connect Telegram</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Log in with your existing Telegram account to authenticate and create your vault.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group">
              <div className="bg-white border border-[var(--border-default)] rounded-xl p-6 h-64 mb-6 relative overflow-hidden flex flex-col items-center justify-center transition-all hover:border-[var(--border-strong)]">
                {/* Visual: Upload */}
                <div className="w-40 h-32 border-2 border-dashed border-[var(--border-default)] rounded-lg flex flex-col items-center justify-center relative bg-[var(--bg-secondary)]/30">
                  <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  <Upload size={24} className="text-[var(--text-tertiary)] mb-2" />
                  <div className="text-[10px] text-[var(--text-tertiary)]">Drop files here</div>

                  {/* Floating file */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bg-white border border-[var(--border-default)] p-2 rounded shadow-sm top-4 right-4"
                  >
                    <div className="w-6 h-8 bg-red-100 rounded-sm"></div>
                  </motion.div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Upload Files</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Drag and drop your photos and documents. We process them locally on your device.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-white border border-[var(--border-default)] rounded-xl p-6 h-64 mb-6 relative overflow-hidden flex flex-col items-center justify-center transition-all hover:border-[var(--border-strong)]">
                {/* Visual: Security */}
                <div className="w-40 h-32 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-10">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-[var(--text-primary)] rounded-full w-1 h-1"></div>
                    ))}
                  </div>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-[var(--border-default)] shadow-sm z-10">
                    <Lock size={24} className="text-[var(--text-primary)]" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-[#229ED9]/20 rounded-lg"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Encrypted & Safe</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Every file is encrypted with a unique key. Only you have access to your data.
              </p>
              <Link to="/security" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 mt-1">
                Learn about our security →
              </Link>
            </div>

            {/* Step 4 */}
            <div className="group">
              <div className="bg-white border border-[var(--border-default)] rounded-xl p-6 h-64 mb-6 relative overflow-hidden px-8 py-10 transition-all hover:border-[var(--border-strong)]">
                {/* Visual: Folders */}
                <div className="w-full h-full bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)] p-4 space-y-3 shadow-inner">
                  <div className="flex gap-2">
                    <div className="w-16 h-4 bg-white rounded border border-[var(--border-default)]"></div>
                    <div className="w-16 h-4 bg-white rounded border border-[var(--border-default)]"></div>
                  </div>
                  <div className="h-[1px] bg-[var(--border-default)] w-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white rounded w-3/4 border border-[var(--border-default)] flex items-center px-2">
                      <div className="w-2 h-2 bg-indigo-100 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-white rounded w-1/2 border border-[var(--border-default)] flex items-center px-2">
                      <div className="w-2 h-2 bg-emerald-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Organized Forever</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Your files are indexed and sorted. Access them from any device, anytime.
              </p>
            </div>
          </div>
        </section>


        {/* Open Source Section */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="bg-[#191919] rounded-lg p-8 md:p-12 text-white border border-[#333]">

            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-neutral-300 mb-6 border border-white/5">
                  <Github size={14} />
                  <span className="text-xs font-medium">Open Source</span>
                </div>

                <h2 className="text-3xl font-semibold mb-6 tracking-tight text-white">
                  Transparent.<br />
                  <span className="text-neutral-500">Community Driven.</span>
                </h2>

                <p className="text-neutral-400 leading-relaxed mb-8 text-lg">
                  Aligned with Telegram's mission, Telebox is an open-source project built for user freedom. We stand firmly against data selling and commercial surveillance.
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3 text-neutral-300">
                    <Shield size={16} className="text-neutral-500 shrink-0" />
                    <span className="text-sm">Privacy-first architecture</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-300">
                    <Users size={16} className="text-neutral-500 shrink-0" />
                    <span className="text-sm">Driven by the community</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-300">
                    <Lock size={16} className="text-neutral-500 shrink-0" />
                    <span className="text-sm">No ads, no tracking</span>
                  </div>
                </div>

                <a
                  href="https://github.com/whyrsm/telebox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-medium hover:bg-neutral-200 transition-colors text-sm"
                >
                  <Github size={16} />
                  Star on GitHub
                </a>
              </div>

              {/* Right Side Visual - Simplified */}
              <div className="hidden md:block flex-1 border border-white/10 rounded-lg p-8 bg-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -tranaslate-y-1/2 translate-x-1/2"></div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <FileText size={18} className="text-neutral-400" />
                    <div className="text-sm text-neutral-300 font-mono">mission.md</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">No Hidden Code</div>
                        <div className="text-neutral-500 text-xs mt-0.5">You don't have to trust us. You can verify us.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Zero Data Selling</div>
                        <div className="text-neutral-500 text-xs mt-0.5">We are funded by donations, not your data.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Community Audited</div>
                        <div className="text-neutral-500 text-xs mt-0.5">Security researchers review every update.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-20 bg-white border-y border-[var(--border-color)]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-[var(--text-primary)]">
              Ready to free your files?
            </h2>
            <p className="text-[var(--text-secondary)] mb-2">
              No sign-up fees, no storage limits. Just connect and start uploading.
            </p>
            <p className="text-sm text-[var(--text-tertiary)] mb-8">
              Free forever. Community-driven.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size="sm" />

          <div className="flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
            <Link to="/security" className="hover:text-[var(--text-primary)] transition-colors">Security</Link>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </div>

          <div className="text-sm text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} Telebox. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
