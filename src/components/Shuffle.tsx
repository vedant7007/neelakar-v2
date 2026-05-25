import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'random' | 'evenodd';
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Shuffle: React.FC<ShuffleProps> = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  maxDelay = 0,
  ease = 'power3.out',
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onShuffleComplete,
  shuffleTimes = 1,
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = '',
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true
}) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const splitRef = useRef<GSAPSplitText | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    let active = true;
    const markFontsLoaded = () => {
      if (active) setFontsLoaded(true);
    };

    if (!('fonts' in document) || document.fonts.status === 'loaded') {
      const frame = window.requestAnimationFrame(markFontsLoaded);
      return () => {
        active = false;
        window.cancelAnimationFrame(frame);
      };
    }

    document.fonts.ready.then(markFontsLoaded);

    return () => {
      active = false;
    };
  }, []);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || '');
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const marginOffset =
      marginValue === 0 ? '' : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    return `top ${startPct}%${marginOffset}`;
  }, [threshold, rootMargin]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setReady(true);
        onShuffleComplete?.();
        return;
      }

      let disposed = false;
      let ambientCall: gsap.core.Tween | null = null;
      let activeTimeline: gsap.core.Timeline | null = null;
      let chars: HTMLElement[] = [];
      const originals = new Map<HTMLElement, string>();

      const restoreCharacters = () => {
        chars.forEach(char => {
          char.textContent = originals.get(char) ?? '';
        });
        gsap.set(chars, { clearProps: 'opacity,transform,color,willChange' });
      };

      const cancelPlayback = () => {
        ambientCall?.kill();
        ambientCall = null;
        activeTimeline?.kill();
        activeTimeline = null;
        playingRef.current = false;
        restoreCharacters();
      };

      const revertSplit = () => {
        cancelPlayback();
        splitRef.current?.revert();
        splitRef.current = null;
        chars = [];
        originals.clear();
      };

      const buildCharacters = () => {
        revertSplit();
        splitRef.current = new GSAPSplitText(el, {
          type: 'chars',
          charsClass: 'shuffle-char',
          wordsClass: 'shuffle-word',
          smartWrap: true,
          reduceWhiteSpace: false
        });

        chars = ((splitRef.current.chars || []) as HTMLElement[]).filter(char =>
          /[A-Za-z0-9]/.test(char.textContent || '')
        );
        chars.forEach(char => {
          const original = char.textContent || '';
          originals.set(char, original);
          Object.assign(char.style, {
            display: 'inline-block',
            width: `${char.getBoundingClientRect().width}px`,
            willChange: 'transform, opacity'
          });
        });
      };

      const shuffledGlyph = (original: string) => {
        const charset = scrambleCharset || DEFAULT_CHARSET;
        let glyph = original;
        while (charset.length > 1 && glyph.toUpperCase() === original.toUpperCase()) {
          glyph = charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return original === original.toLowerCase() ? glyph.toLowerCase() : glyph;
      };

      const selectedCharacters = () => {
        const ratio = gsap.utils.random(0.3, 0.55);
        const count = chars.length < 3 ? 1 : Math.max(2, Math.round(chars.length * ratio));
        return gsap.utils.shuffle(chars.slice()).slice(0, count);
      };

      const directionalOffset = () => {
        const amount = Math.min(5, Math.max(1.5, duration * 3));
        if (shuffleDirection === 'left') return { x: -amount, y: 0 };
        if (shuffleDirection === 'right') return { x: amount, y: 0 };
        if (shuffleDirection === 'up') return { x: 0, y: -amount };
        return { x: 0, y: amount };
      };

      const nextAmbientDelay = () => {
        const base = Math.max(1.2, loopDelay || 2.8);
        return base * gsap.utils.random(0.72, 1.32);
      };

      const scheduleAmbientPulse = () => {
        if (!loop || disposed) return;
        ambientCall?.kill();
        ambientCall = gsap.delayedCall(nextAmbientDelay(), playPulse);
      };

      const playPulse = () => {
        if (disposed || playingRef.current || chars.length === 0) return;

        playingRef.current = true;
        ambientCall = null;
        const selected = selectedCharacters();
        const pulseDuration = Math.max(0.26, duration);
        const exitDur = pulseDuration * 0.25;
        const enterDur = pulseDuration * 0.75;
        const gap = pulseDuration * 0.08;
        const perCharTime = exitDur + gap + enterDur;
        const spreadWindow = Math.max(maxDelay, perCharTime * 0.45 * selected.length);

        activeTimeline = gsap.timeline({
          onComplete: () => {
            playingRef.current = false;
            activeTimeline = null;
            onShuffleComplete?.();
            scheduleAmbientPulse();
          }
        });

        selected.forEach((char) => {
          const startAt = Math.random() * spreadWindow;
          const mag = gsap.utils.random(14, 24);

          let exitX = 0, exitY = 0, enterX = 0, enterY = 0;
          if (shuffleDirection === 'up')         { exitY = -mag; enterY = mag; }
          else if (shuffleDirection === 'down')  { exitY = mag;  enterY = -mag; }
          else if (shuffleDirection === 'left')  { exitX = -mag; enterX = mag; }
          else                                   { exitX = mag;  enterX = -mag; }

          if (colorFrom) activeTimeline?.set(char, { color: colorFrom }, startAt);

          activeTimeline?.to(char, {
            x: exitX, y: exitY, opacity: 0,
            duration: exitDur, ease: 'power2.in'
          }, startAt);

          activeTimeline?.set(char, { x: enterX, y: enterY, opacity: 0 }, startAt + exitDur + gap * 0.5);

          activeTimeline?.to(char, {
            x: 0, y: 0, opacity: 1, color: colorTo || undefined,
            duration: enterDur, ease: 'power2.out'
          }, startAt + exitDur + gap);
        });
      };

      const startPlayback = () => {
        cancelPlayback();
        buildCharacters();
        setReady(true);
        playPulse();
      };

      const onMouseEnter = () => {
        if (!playingRef.current) {
          ambientCall?.kill();
          ambientCall = null;
          playPulse();
        }
      };

      if (triggerOnHover) el.addEventListener('mouseenter', onMouseEnter);

      const scrollTrigger = ScrollTrigger.create({
        trigger: el,
        start: scrollTriggerStart,
        once: triggerOnce,
        onEnter: startPlayback
      });

      return () => {
        disposed = true;
        scrollTrigger.kill();
        el.removeEventListener('mouseenter', onMouseEnter);
        revertSplit();
        setReady(false);
      };
    },
    {
      dependencies: [
        text,
        duration,
        maxDelay,
        ease,
        scrollTriggerStart,
        fontsLoaded,
        shuffleDirection,
        shuffleTimes,
        loop,
        loopDelay,
        stagger,
        scrambleCharset,
        colorFrom,
        colorTo,
        triggerOnce,
        respectReducedMotion,
        triggerOnHover,
        onShuffleComplete
      ],
      scope: ref
    }
  );

  const baseTw = 'inline-block whitespace-normal break-words will-change-transform uppercase text-2xl leading-none';
  const userHasFont = useMemo(() => className && /font[-[]/i.test(className), [className]);
  const fallbackFont = useMemo(
    () => (userHasFont ? {} : { fontFamily: `'Press Start 2P', sans-serif` }),
    [userHasFont]
  );
  const commonStyle = useMemo(
    () => ({
      textAlign,
      ...fallbackFont,
      ...style
    }),
    [textAlign, fallbackFont, style]
  );
  const classes = useMemo(
    () => `${baseTw} ${ready ? 'visible' : 'invisible'} ${className}`.trim(),
    [baseTw, ready, className]
  );
  const setElementRef = useCallback((element: HTMLElement | null) => {
    ref.current = element;
  }, []);
  const elementProps = { ref: setElementRef, className: classes, style: commonStyle };

  switch (tag) {
    case 'h1':
      return <h1 {...elementProps}>{text}</h1>;
    case 'h2':
      return <h2 {...elementProps}>{text}</h2>;
    case 'h3':
      return <h3 {...elementProps}>{text}</h3>;
    case 'h4':
      return <h4 {...elementProps}>{text}</h4>;
    case 'h5':
      return <h5 {...elementProps}>{text}</h5>;
    case 'h6':
      return <h6 {...elementProps}>{text}</h6>;
    case 'span':
      return <span {...elementProps}>{text}</span>;
    default:
      return <p {...elementProps}>{text}</p>;
  }
};

export default Shuffle;
