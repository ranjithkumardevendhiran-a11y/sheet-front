import { useMemo } from 'react';

const variants = [
  {
    name: 'sunrise',
    gradient: ['#ff8a00', '#e52e71'],
    animation: 'pulseGlow',
  },
  {
    name: 'ocean',
    gradient: ['#38bdf8', '#0ea5e9'],
    animation: 'slideWave',
  },
  {
    name: 'forest',
    gradient: ['#34d399', '#16a34a'],
    animation: 'rotateAura',
  },
  {
    name: 'violet',
    gradient: ['#a855f7', '#f43f5e'],
    animation: 'pulseGlow',
  },
  {
    name: 'midnight',
    gradient: ['#2563eb', '#7c3aed'],
    animation: 'slideWave',
  },
];

function seedFromString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function ProfileAvatar({ user }) {
  const { initials, variant } = useMemo(() => {
    if (!user?.email) {
      return { initials: 'AG', variant: variants[0] };
    }

    const name = user.name || user.email;
    const parts = name.trim().split(/\s+/);
    const initialsString = parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);

    const seed = seedFromString(user.email);
    const chosen = variants[seed % variants.length];

    return { initials: initialsString.toUpperCase(), variant: chosen };
  }, [user]);

  return (
    <div className={`profile-avatar profile-avatar-${variant.name}`} style={{ animationName: variant.animation }}>
      <span>{initials}</span>
    </div>
  );
}
