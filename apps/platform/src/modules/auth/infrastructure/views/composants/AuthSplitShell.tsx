import React from 'react';

interface AuthSplitShellProps {
  children: React.ReactNode;
}

const MiniOverviewCard: React.FC = () => (
  <div
    className="absolute bottom-0 left-0 w-[340px] rounded-2xl bg-cream p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,.4)]"
    style={{ transform: 'rotate(-4deg)' }}
  >
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-danger/60" />
      <span className="size-2 rounded-full bg-amber/60" />
      <span className="size-2 rounded-full bg-admin-primary/60" />
    </div>
    <div className="mt-3 flex gap-2.5">
      <div className="flex-1 rounded-xl bg-card p-2.5">
        <div className="num text-[17px] font-bold text-ink">24/27</div>
        <div className="text-[9.5px] font-semibold text-ink-faint">Banques actives</div>
      </div>
      <div className="flex-1 rounded-xl bg-card p-2.5">
        <div className="num text-[17px] font-bold text-admin-primary">+11%</div>
        <div className="text-[9.5px] font-semibold text-ink-faint">Volume · mois</div>
      </div>
    </div>
    <div className="mt-2.5 flex h-10 items-end gap-1">
      {[45, 55, 62, 70, 78, 86, 95].map((height, index) => (
        <div key={index} className="flex-1 rounded-sm bg-admin-primary/70" style={{ height: `${height}%` }} />
      ))}
    </div>
  </div>
);

interface FloatingCardProps {
  title: string;
  subtitle: string;
  animationClassName: string;
  className: string;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ title, subtitle, animationClassName, className }) => (
  <div
    className={[
      'absolute w-[190px] rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md',
      animationClassName,
      className,
    ].join(' ')}
  >
    <div className="text-[12px] font-bold text-white">{title}</div>
    <div className="mt-0.5 text-[11px] font-medium text-white/70">{subtitle}</div>
  </div>
);

const MrrCard: React.FC = () => (
  <div className="animate-auth-float-c absolute top-6 right-2 w-[170px] rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
    <div className="text-[11.5px] font-bold text-white">MRR abonnements</div>
    <div className="mt-0.5 text-[11px] font-medium text-white/70">4,25 M FCFA · +6,2%</div>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
      <div className="h-full rounded-full bg-admin-accent" style={{ width: '78%' }} />
    </div>
  </div>
);

/**
 * Panneau de gauche du module auth platform — identité visuelle SOMBRE
 * distincte de bank (émeraude profond → anthracite/vert admin), même
 * grammaire d'animation (gradient, cartes flottantes) que le shell bank.
 */
export const AuthSplitShell: React.FC<AuthSplitShellProps> = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-cream p-6">
    <div className="flex h-[720px] w-[1180px] max-w-full overflow-hidden rounded-[20px] shadow-[0_50px_100px_-50px_rgba(0,0,0,.5)]">
      {/* Panneau de marque */}
      <div
        className="animate-auth-gradient relative hidden w-[55%] flex-none overflow-hidden md:block"
        style={{
          backgroundImage: 'linear-gradient(115deg, #13201B 0%, #0B1512 55%, #060B09 100%)',
          backgroundSize: '200% 200%',
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.1) 1.1px, transparent 1.1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div
          className="absolute -top-[90px] -left-[70px] size-[300px] rounded-full"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(95,214,165,.18), transparent 70%)' }}
        />

        <div className="relative flex h-full flex-col p-10">
          <div className="flex items-center gap-[11px]">
            <div className="flex size-[42px] items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
              <span className="num text-lg font-bold text-white">M</span>
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                Miya <span className="text-admin-accent">Admin</span>
              </div>
              <div className="text-[11px] font-semibold text-admin-muted">Console éditeur — accès restreint</div>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-[34px] leading-[1.12] font-extrabold tracking-[-0.025em] text-white">
              Le pilotage de la plateforme,
              <br />
              vue d&rsquo;ensemble.
            </div>
            <div className="mt-3.5 max-w-[340px] text-sm font-medium text-admin-item">
              Volume, abonnements et activité de chaque banque cliente, consolidés en temps réel.
            </div>
          </div>

          <div className="relative mt-auto h-[250px]">
            <MiniOverviewCard />
            <FloatingCard
              title="Nouvelle banque activée"
              subtitle="Union Financière de l'Ouest"
              animationClassName="animate-auth-slide-loop"
              className="top-2 left-6"
            />
            <FloatingCard
              title="Relance envoyée"
              subtitle="COOPEC Sahel · impayé 12 j"
              animationClassName="animate-auth-float-a"
              className="top-24 right-0"
            />
            <MrrCard />
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11.5px] font-semibold text-admin-muted">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1.5l4.5 1.8v3.1c0 2.9-1.9 4.3-4.5 4.9-2.6-.6-4.5-2-4.5-4.9V3.3L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Accès réservé aux super-administrateurs Miya
          </div>
        </div>
      </div>

      {/* Panneau de formulaire */}
      <div className="flex flex-1 items-center justify-center bg-cream px-8">
        <div className="w-full max-w-[360px]">{children}</div>
      </div>
    </div>
  </div>
);
