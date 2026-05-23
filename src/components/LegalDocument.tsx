import React from 'react';

interface LegalDocumentProps {
    title: string;
    eyebrow?: string;
    intro?: React.ReactNode;
    children: React.ReactNode;
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({ title, eyebrow = 'Bluvi', intro, children }) => (
    <article className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8 sm:py-9">
        <header className="mb-8 border-b border-app-strong/40 pb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-app-accent">{eyebrow}</p>
            <h1 className="font-heading text-3xl font-bold text-app-primary sm:text-4xl">{title}</h1>
            {intro && (
                <div className="mt-4 max-w-2xl text-base leading-7 text-app-secondary">
                    {intro}
                </div>
            )}
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-app-secondary sm:text-base">
            {children}
        </div>
    </article>
);

interface LegalSectionProps {
    title: string;
    children: React.ReactNode;
    tone?: 'default' | 'warning';
}

export const LegalSection: React.FC<LegalSectionProps> = ({ title, children, tone = 'default' }) => (
    <section className="space-y-3">
        <h2 className={`font-heading text-xl font-semibold ${tone === 'warning' ? 'text-red-600' : 'text-app-primary'}`}>
            {title}
        </h2>
        {children}
    </section>
);

export const LegalCallout: React.FC<{ children: React.ReactNode; tone?: 'default' | 'warning' }> = ({
    children,
    tone = 'default',
}) => (
    <div
        className={`rounded-lg border p-4 ${
            tone === 'warning'
                ? 'border-red-200 bg-red-50 text-red-950'
                : 'border-app-strong/30 bg-app-surface-soft text-app-secondary'
        }`}
    >
        {children}
    </div>
);

