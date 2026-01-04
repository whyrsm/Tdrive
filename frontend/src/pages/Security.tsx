
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Key, Server, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';

export function SecurityPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border-color)]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>
                    <Link
                        to="/"
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] mb-6 border border-[var(--border-default)]">
                        <Shield size={14} />
                        <span className="text-xs font-medium uppercase tracking-wide">Security Architecture</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[var(--text-primary)]">
                        How we protect your data
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-16 text-lg max-w-2xl leading-relaxed">
                        We believe that security through transparency is better than security through obscurity.
                        Here is exactly how Telebox keeps your files private, even from us.
                    </p>

                    <div className="grid gap-8">

                        {/* Principle 1: Zero Knowledge */}
                        <section className="bg-white rounded-lg p-8 border border-[var(--border-default)]">
                            <div className="flex items-start gap-6">
                                <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] p-3 rounded-md shrink-0">
                                    <Key size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-3">We Can't See Your Data</h2>
                                    <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                                        Most cloud apps can peek at your files. <strong>We cannot.</strong> We designed Telebox so that we physically cannot read your files even if we wanted to.
                                    </p>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        Your encryption key is generated dynamically from your unique Telegram session. This means:
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                                            We cannot see your file names or folder structure.
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                                            If our database is stolen, the hackers see only scrambled nonsense.
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                                            You are the only one who can unlock your drive.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Principle 2: Telegram Storage */}
                        <section className="bg-white rounded-lg p-8 border border-[var(--border-default)]">
                            <div className="flex items-start gap-6">
                                <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] p-3 rounded-md shrink-0">
                                    <Server size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-3">Stored on Telegram</h2>
                                    <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                                        We don't store your actual files on our servers. When you upload a file, it goes directly to Telegram's secure cloud.
                                    </p>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        This offers you distinct advantages:
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                                            <strong>Proven Security:</strong> Telegram's MTProto encryption is battle-tested.
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                                            <strong>Redundancy:</strong> Your files are distributed across Telegram's global data centers.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Technical Detail: Metadata Encryption */}
                        <section className="bg-[var(--bg-secondary)] rounded-lg p-8 border border-[var(--border-default)]">
                            <div className="flex items-center gap-3 mb-6">
                                <Database size={20} className="text-[var(--text-secondary)]" />
                                <h3 className="text-lg font-semibold">Technical Deep Dive: The Metadata</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-medium mb-2 text-sm">What we store:</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                                        To make the app fast, we save a list of your files locally. But we don't save the names in plain text.
                                    </p>
                                    <div className="font-mono text-xs bg-[var(--bg-primary)] p-3 rounded border border-[var(--border-default)]">
                                        <div className="text-[var(--text-secondary)] line-through mb-1 opacity-50">"My Secret Project"</div>
                                        <div className="text-[var(--text-primary)]">"a7f3:9x82:1b4c..."</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 text-sm">How we encrypt it:</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        We use <strong>AES-256-GCM</strong>, the industry standard for secure data. Even better, we use a unique random "salt" (IV) for every single file.
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                                        Two folders named "Work" will look completely different in our database.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] py-12">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Logo size="sm" />
                    <div className="flex items-center gap-8 text-sm text-[var(--text-secondary)]">
                        <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
                        <Link to="/security" className="hover:text-[var(--text-primary)] transition-colors font-medium">Security</Link>
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
