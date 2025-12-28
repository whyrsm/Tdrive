import { Link } from 'react-router-dom';
import { Cloud, Shield, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Cloud,
    title: 'Unlimited & Free',
    description: 'Store as many files as you want. No storage limits, no monthly fees, ever.',
  },
  {
    icon: Shield,
    title: 'Private by Design',
    description: 'Your files stay in your Telegram account. We never see or store your data.',
  },
  {
    icon: FolderOpen,
    title: 'Easy Organization',
    description: 'Create folders and organize files with a simple, familiar interface.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--text-primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-medium text-[var(--text-primary)]">Telebox</span>
          </div>
          <Link
            to="/login"
            className={cn(
              'px-4 py-1.5 rounded text-sm font-medium',
              'bg-[var(--text-primary)] text-white',
              'hover:opacity-85 transition-opacity'
            )}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
          Unlimited Free Storage
          <br />
          <span className="text-[var(--text-secondary)]">Private. Simple. Powered by Telegram.</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
          Store unlimited files for free using your Telegram account. 
          Easy to use, completely private.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/login"
            className={cn(
              'px-6 py-2.5 rounded text-sm font-medium',
              'bg-[var(--text-primary)] text-white',
              'hover:opacity-85 transition-opacity'
            )}
          >
            Get Started — It's Free
          </Link>
          <a
            href="#features"
            className={cn(
              'px-6 py-2.5 rounded text-sm font-medium',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              'hover:bg-[var(--bg-hover)] transition-colors'
            )}
          >
            See Features
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[var(--bg-secondary)] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center text-[var(--text-primary)] mb-12">
            Everything you need in a cloud drive
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] p-5"
              >
                <feature.icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-[var(--text-secondary)] mb-3"
                />
                <h3 className="font-medium text-[var(--text-primary)] mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center text-[var(--text-primary)] mb-12">
            How it works
          </h2>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Sign in with Telegram',
                description: 'Use your phone number to authenticate securely via Telegram.',
              },
              {
                step: '2',
                title: 'Upload your files',
                description: 'Drag and drop or select files. They\'re stored in your Telegram Saved Messages.',
              },
              {
                step: '3',
                title: 'Access anywhere',
                description: 'Your files are available in Telebox and directly in Telegram on any device.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
            Ready to get started?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Free unlimited storage. No credit card required.
          </p>
          <Link
            to="/login"
            className={cn(
              'inline-block px-6 py-2.5 rounded text-sm font-medium',
              'bg-[var(--text-primary)] text-white',
              'hover:opacity-85 transition-opacity'
            )}
          >
            Start Using Telebox
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-[var(--text-tertiary)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--text-primary)] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span>Telebox</span>
          </div>
          <p>Files stored securely in your Telegram account</p>
        </div>
      </footer>
    </div>
  );
}
