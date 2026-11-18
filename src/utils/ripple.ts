/**
 * Material ripple for every button and link: an ink circle grows from the touch point and fades.
 * One delegated listener; the ink lives in its own clipped layer so badges and focus rings that
 * stick out of a button are not cut off. Add data-no-ripple to opt an element out.
 */
const TARGETS = 'button, a[href], [role="button"], [data-ripple]';

export const installRipple = () => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  document.addEventListener(
    'pointerdown',
    (e) => {
      if (reduce?.matches || e.button > 0) return;
      const el = (e.target as Element | null)?.closest?.(TARGETS) as HTMLElement | null;
      if (!el || el.hasAttribute('data-no-ripple') || (el as HTMLButtonElement).disabled) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

      const host = document.createElement('span');
      host.className = 'ripple-host';
      const ink = document.createElement('span');
      ink.className = 'ripple-ink';
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Big enough to reach the farthest corner from the touch point
      const size = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
      ink.style.width = ink.style.height = `${size}px`;
      ink.style.left = `${x - size / 2}px`;
      ink.style.top = `${y - size / 2}px`;
      host.appendChild(ink);
      el.appendChild(host);

      const fade = () => {
        host.classList.add('ripple-out');
        setTimeout(() => host.remove(), 420);
      };
      const release = () => {
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', release);
        // Let a quick tap show most of the spread before fading
        setTimeout(fade, 160);
      };
      window.addEventListener('pointerup', release);
      window.addEventListener('pointercancel', release);
      // Safety net if the release event is never delivered
      setTimeout(() => host.isConnected && fade(), 2500);
    },
    { passive: true }
  );
};
