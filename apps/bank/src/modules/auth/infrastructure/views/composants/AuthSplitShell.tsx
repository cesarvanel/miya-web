import React from 'react';

interface AuthSplitShellProps {
  children: React.ReactNode;
}

const MiniDashboardCard: React.FC = () => (
  <div
    className="absolute bottom-0 left-0 w-[340px] rounded-2xl bg-cream p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,.4)]"
    style={{ transform: 'rotate(-4deg)' }}
  >
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-danger/60" />
      <span className="size-2 rounded-full bg-amber/60" />
      <span className="size-2 rounded-full bg-primary/60" />
    </div>
    <div className="mt-3 flex gap-2.5">
      <div className="flex-1 rounded-xl bg-card p-2.5">
        <div className="num text-[17px] font-bold text-ink">214 700</div>
        <div className="text-[9.5px] font-semibold text-ink-faint">Collecté aujourd&rsquo;hui</div>
      </div>
      <div className="flex-1 rounded-xl bg-card p-2.5">
        <div className="num text-[17px] font-bold text-primary">92%</div>
        <div className="text-[9.5px] font-semibold text-ink-faint">Confirmation</div>
      </div>
    </div>
    <div className="mt-2.5 flex h-10 items-end gap-1">
      {[40, 65, 50, 80, 60, 90, 70].map((height, index) => (
        <div key={index} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${height}%` }} />
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
      'absolute w-[190px] rounded-2xl border border-white/25 bg-white/15 p-3 backdrop-blur-md',
      animationClassName,
      className,
    ].join(' ')}
  >
    <div className="text-[12px] font-bold text-white">{title}</div>
    <div className="mt-0.5 text-[11px] font-medium text-white/75">{subtitle}</div>
  </div>
);

const CapCard: React.FC = () => (
  <div className="animate-auth-float-c absolute top-6 right-2 w-[170px] rounded-2xl border border-white/25 bg-white/15 p-3 backdrop-blur-md">
    <div className="text-[11.5px] font-bold text-white">Plafond agent</div>
    <div className="mt-0.5 text-[11px] font-medium text-white/75">85 / 120k FCFA</div>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
      <div className="h-full rounded-full bg-primary-bright" style={{ width: '71%' }} />
    </div>
  </div>
);

/**
 * Panneau de gauche partagé par tous les écrans du module auth — gradient
 * animé, trame de points, mini-cartes flottantes. Maquette B1-B9.
 */
export const AuthSplitShell: React.FC<AuthSplitShellProps> = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-cream p-6">
    <div className="flex h-[720px] w-[1180px] max-w-full overflow-hidden rounded-[20px] shadow-[0_50px_100px_-50px_rgba(0,0,0,.5)]">
      {/* Panneau de marque */}
      <div
        className="animate-auth-gradient relative hidden w-[55%] flex-none overflow-hidden md:block"
        style={{
          backgroundImage: 'linear-gradient(115deg, #0A6B4E 0%, #0B3B2A 55%, #082A1E 100%)',
          backgroundSize: '200% 200%',
        }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.13) 1.1px, transparent 1.1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div
          className="absolute -top-[90px] -left-[70px] size-[300px] rounded-full"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(127,216,174,.22), transparent 70%)' }}
        />

        <div className="relative flex h-full flex-col p-10">
          <div className="flex items-center gap-[11px]">
            <div className="flex size-[42px] items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-sm">
              <span className="num text-lg font-bold text-white">M</span>
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                Miya <span className="text-primary-bright">Banque</span>
              </div>
              <div className="text-[11px] font-semibold text-[#8FC6AC]">MEC La Confiance</div>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-[34px] leading-[1.12] font-extrabold tracking-[-0.025em] text-white">
              La collecte journalière,
              <br />
              sans cahier.
            </div>
            <div className="mt-3.5 max-w-[340px] text-sm font-medium text-[#B7D6C8]">
              Chaque versement enregistré, tracé et reversé — du terrain au siège, en temps réel.
            </div>
          </div>

          <div className="relative mt-auto h-[250px]">
            <MiniDashboardCard />
            <FloatingCard
              title="Collecte confirmée"
              subtitle="Bernadette Ngo · 1 000 FCFA"
              animationClassName="animate-auth-slide-loop"
              className="top-2 left-6"
            />
            <FloatingCard
              title="Reversement validé"
              subtitle="Quittance émise · #4471"
              animationClassName="animate-auth-float-a"
              className="top-24 right-0"
            />
            <CapCard />
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11.5px] font-semibold text-[#8FC6AC]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1.5l4.5 1.8v3.1c0 2.9-1.9 4.3-4.5 4.9-2.6-.6-4.5-2-4.5-4.9V3.3L7 1.5z" stroke="#8FC6AC" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Plateforme sécurisée · Vos identifiants ne sont jamais partagés
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
