'use client';

import { useEffect, useState } from 'react';
import type { Content } from '@/content/types';
import { ButtonLink } from './Button';
import styles from './MobileBar.module.css';

/** "Apply to speak" CTA that slides in on small screens once the hero CTA is out of view. */
export function MobileBar({ c }: { c: Pick<Content, 'mobileBar' | 'ctaApply'> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const form = document.getElementById('apply');
    if (!hero) return;
    let heroOut = false;
    let formIn = false;
    const update = () => setVisible(heroOut && !formIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOut = !e.isIntersecting;
        if (e.target === form) formIn = e.isIntersecting;
      }
      update();
    });
    io.observe(hero);
    if (form) io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ''}`} aria-hidden={!visible} inert={!visible}>
      <span className={styles.text}>{c.mobileBar.text}</span>
      <ButtonLink href="#apply" size="small">
        {c.ctaApply}
      </ButtonLink>
    </div>
  );
}
