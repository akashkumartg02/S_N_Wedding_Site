import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { MotionConfig, motion } from "motion/react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadFireworksPreset } from "@tsparticles/preset-fireworks";

const initFireworks = async (engine) => {
  await loadFireworksPreset(engine);
};

const revealUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
};

function LotusMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 48" aria-hidden="true">
      <path d="M32 39C18 38 11 29 13 19c8 1 14 6 19 14 5-8 11-13 19-14 2 10-5 19-19 20Z" />
      <path d="M32 35C22 26 21 16 32 8c11 8 10 18 0 27ZM17 37C8 32 5 24 8 16c7 4 12 11 14 19m25 2c9-5 12-13 9-21-7 4-12 11-14 19" />
      <path d="M10 42h44" />
    </svg>
  );
}

function ArrowIcon({ direction = "up-right", className = "" }) {
  const paths = {
    up: "M8 13V3m0 0L4 7m4-4 4 4",
    down: "M8 3v10m0 0 4-4m-4 4L4 9",
    "up-right": "M4 12 12 4M6 4h6v6",
    "down-right": "M4 4 12 12m0-6v6H6",
  };
  return (
    <svg className={`arrow-icon ${className}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={paths[direction]} />
    </svg>
  );
}

function FireworksBackdrop() {
  const options = useMemo(
    () => ({
      preset: "fireworks",
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 45,
      detectRetina: true,
      fireworks: {
        brightness: 78,
        colors: ["#ff9b24", "#ffd45c", "#fff2c4", "#ee7350", "#ef9c43"],
        intensity: 4,
        life: { min: 1.1, max: 1.7 },
        traces: 7,
        explosion: { min: 18, max: 30 },
      },
    }),
    [],
  );

  return (
    <ParticlesProvider init={initFireworks}>
      <Particles className="intro-particles" id="wedding-fireworks" options={options} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </ParticlesProvider>
  );
}

function FallingFlowers() {
  const flowers = ["✿", "❀", "✽", "✾"];
  return (
    <div className="falling-flowers" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => (
        <span
          className={`falling-petal petal-tone-${index % 4}`}
          key={index}
          style={{
            left: `${(index * 37) % 100}%`,
            "--fall-duration": `${8 + (index % 7)}s`,
            "--fall-delay": `${-((index * 11) % 90) / 10}s`,
            "--fall-drift": `${index % 2 ? 78 : -78}px`,
            "--petal-size": `${13 + (index % 5) * 3}px`,
          }}
        >
          {flowers[index % flowers.length]}
        </span>
      ))}
    </div>
  );
}

function SideThoranam({ side, visible }) {
  const [angle, setAngle] = useState(0);
  const startX = useRef(0);
  const direction = side === "left" ? 1 : -1;

  const startPull = (event) => {
    startX.current = event.clientX;
    event.currentTarget.classList.add("is-pulling");
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePull = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const pull = Math.max(-16, Math.min(16, (event.clientX - startX.current) * 0.32 * direction));
    setAngle(pull);
  };
  const releasePull = (event) => {
    setAngle(0);
    event.currentTarget.classList.remove("is-pulling");
  };

  return (
    <button
      className={`side-thoranam side-thoranam-${side}${visible ? " is-visible" : ""}`}
      style={{ "--sway-angle": `${angle}deg` }}
      type="button"
      aria-label={`Drag the ${side} thoranam to make it sway`}
      onPointerDown={startPull}
      onPointerMove={movePull}
      onPointerUp={releasePull}
      onPointerCancel={releasePull}
      onLostPointerCapture={releasePull}
    >
      <svg viewBox="0 0 100 760" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`leaf-${side}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#71834b" />
            <stop offset="1" stopColor="#344a32" />
          </linearGradient>
          <radialGradient id={`marigold-${side}`}>
            <stop offset="0" stopColor="#ffd878" />
            <stop offset=".58" stopColor="#ec8b1f" />
            <stop offset="1" stopColor="#b94716" />
          </radialGradient>
          <linearGradient id={`bell-${side}`} x1="0" x2="1">
            <stop offset="0" stopColor="#95652f" />
            <stop offset=".45" stopColor="#f3d27a" />
            <stop offset="1" stopColor="#9c682e" />
          </linearGradient>
        </defs>
        <path className="garland-cord" d="M50 0 C48 90 53 170 50 250 S48 405 50 505 S52 680 50 760" />
        <path className="garland-shadow" d="M54 0 C52 90 57 170 54 250 S52 405 54 505 S56 680 54 760" />
        {[55, 126, 198, 270, 342, 414, 486, 558, 630, 702].map((y, index) => {
          const offset = index % 2 === 0 ? -1 : 1;
          return (
            <g className="garland-cluster" key={y} transform={`translate(${50 + offset * 3} ${y})`}>
              <path className="mango-leaf" fill={`url(#leaf-${side})`} d="M-1 0 C-15-16-35-20-39-14 C-35 1-17 8-1 3 C-19 5-27 15-23 22 C-11 19-3 11 1 2 C4 12 13 21 24 20 C29 13 19 4 2 1 C18 8 36 3 39-9 C31-18 13-13 1-2Z" />
              <path className="leaf-vein" d="M-35-13 Q0 0 36-8 M-20 19 Q0 4 21 18" />
              <g className="marigold-bloom" style={{ fill: `url(#marigold-${side})` }} transform="translate(0 4)">
                <circle r="12" />
                <circle cx="-8" cy="-2" r="6" />
                <circle cx="7" cy="-5" r="6" />
                <circle cx="6" cy="7" r="6" />
                <circle cx="-6" cy="8" r="5" />
                <circle className="flower-heart" r="3" />
              </g>
            </g>
          );
        })}
        <g className="toran-bell" transform="translate(50 748)">
          <path d="M0-15v-7M-11-8h22l-3 16H-8Z" fill={`url(#bell-${side})`} />
          <path d="M-14 8h28l-5 6h-18Z" fill={`url(#bell-${side})`} />
          <circle cx="0" cy="20" r="3" />
        </g>
      </svg>
      <span className="thoranam-hint">DRAG</span>
    </button>
  );
}

function App() {
  const [dateRevealed, setDateRevealed] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef(null);
  const [openingPhase, setOpeningPhase] = useState("crackers");

  useEffect(
    () => () => {
      musicRef.current?.pause();
    },
    [],
  );

  const startBackgroundMusic = async () => {
    try {
      const audio = musicRef.current;
      if (!audio) return false;
      audio.volume = 0.24;
      await audio.play();
      setMusicPlaying(true);
      return true;
    } catch {
      setMusicPlaying(false);
      return false;
    }
  };

  const revealDate = () => {
    if (dateRevealed) return;
    setDateRevealed(true);
    void startBackgroundMusic();
  };

  const toggleBackgroundMusic = async () => {
    if (musicPlaying) {
      musicRef.current?.pause();
      setMusicPlaying(false);
      return;
    }
    await startBackgroundMusic();
  };

  useEffect(() => {
    const timings = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? [
          [100, "initials"],
          [500, "exit"],
          [550, "garlands"],
          [650, "names"],
        ]
      : [
          [780, "initials"],
          [3400, "exit"],
          [4120, "garlands"],
          [5620, "names"],
        ];
    const timers = timings.map(([delay, phase]) => window.setTimeout(() => setOpeningPhase(phase), delay));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const goToDetails = () => document.getElementById("invitation-details")?.scrollIntoView({ behavior: "smooth" });

  return (
    <MotionConfig reducedMotion="user">
      <>
        <audio ref={musicRef} src="/wedding-music.mp3" preload="none" loop />
        {!["garlands", "names"].includes(openingPhase) && (
          <div className={`wedding-intro${openingPhase === "exit" ? " is-leaving" : ""}`} role="status" aria-live="polite">
            <FireworksBackdrop />
            <div className={`intro-emblem${["initials", "exit"].includes(openingPhase) ? " is-shown" : ""}`}>
              <span className="intro-kicker">A CELEBRATION OF LOVE</span>
              <p>
                N <i>&amp;</i> S
              </p>
              <span className="intro-date">15 · 11 · 2026 &nbsp; · &nbsp; DINDIGUL</span>
            </div>
            <span className="intro-bottom-note">WITH THE BLESSINGS OF OUR FAMILIES</span>
          </div>
        )}
        <main>
          <FallingFlowers />
          <section className="hero" id="home">
            <div className="hero-grain" aria-hidden="true" />
            <div className="temple-arch" aria-hidden="true">
              <span />
              <span />
            </div>
            <div className="side-thoranams">
              <SideThoranam side="left" visible={["garlands", "names"].includes(openingPhase)} />
              <SideThoranam side="right" visible={["garlands", "names"].includes(openingPhase)} />
            </div>
            <header className="topbar">
              <div className="topbar-date">
                21 · 05 · 2026 <span>—</span> DINDIGUL
              </div>
              <a className="topbar-link" href="#invitation-details">
                THE INVITATION{" "}
                <span>
                  <ArrowIcon direction="down-right" />
                </span>
              </a>
            </header>

            <p className={`eyebrow hero-blessing${openingPhase === "names" ? " is-revealed" : ""}`}>
              <span className="eyebrow-rule" />
              With the blessings of our families
              <span className="eyebrow-rule" />
            </p>

            <div className={`hero-copy${openingPhase === "names" ? " is-revealed" : ""}`}>
              <p className="hero-tagline">A traditional South Indian celebration</p>
              <h1>
                <span>Nivetha</span>
                <span className="ampersand">&amp;</span>
                <span>Srihari</span>
              </h1>
              <p className="hero-subtitle">invite you to share in the joy of their wedding</p>
              <button className="details-button" onClick={goToDetails}>
                VIEW THE INVITATION{" "}
                <span>
                  <ArrowIcon direction="down" />
                </span>
              </button>
              <p className="hero-location">A traditional South Indian wedding in Dindigul</p>
            </div>

            <div className="hero-bottom">
              <span>SCROLL TO EXPLORE</span>
              <i />
            </div>
            <div className="corner-ornament corner-left" aria-hidden="true">
              ❧
            </div>
            <div className="corner-ornament corner-right" aria-hidden="true">
              ❧
            </div>
          </section>

          <section className="invitation section-shell" id="invitation-details">
            <motion.div className="section-kicker" {...revealUp}>
              <LotusMark />
              <span>WITH JOY IN OUR HEARTS</span>
              <LotusMark />
            </motion.div>
            <motion.p className="invitation-copy" {...revealUp} transition={{ ...revealUp.transition, delay: 0.08 }}>
              Together with our families, we invite you to bless and celebrate the marriage of
            </motion.p>
            <motion.h2 {...revealUp} transition={{ ...revealUp.transition, delay: 0.14 }}>
              Nivetha <em>&amp;</em> Srihari
            </motion.h2>
            <div className="divider">
              <span>✦</span>
            </div>
            <motion.div className="date-card" {...revealUp} transition={{ ...revealUp.transition, delay: 0.2 }}>
              <div className="date-ornament" aria-hidden="true">
                ❋
              </div>
              <p className="date-kicker">THE AUSPICIOUS DAY</p>
              <p className="weekday">SUNDAY</p>
              <div className={`date-display ${dateRevealed ? "revealed" : ""}`}>
                {dateRevealed ? (
                  <span className="day">15</span>
                ) : (
                  <button className="date-reveal-control" type="button" onClick={revealDate} aria-label="Tap to reveal the wedding date">
                    <span className="reveal-star" aria-hidden="true">
                      ✦
                    </span>
                    <span className="reveal-label">TAP TO REVEAL</span>
                  </button>
                )}
                <span className="month-year">
                  NOVEMBER
                  <br />
                  <b>2026</b>
                </span>
              </div>
              {dateRevealed && (
                <>
                  <p className="muhurtham visible" aria-live="polite">
                    9:00 AM – 10:30 AM
                  </p>
                  <button className="music-control" type="button" onClick={toggleBackgroundMusic} aria-pressed={musicPlaying}>
                    {musicPlaying ? "♫ MUSIC ON · TAP TO PAUSE" : "♫ PLAY BACKGROUND MUSIC"}
                  </button>
                </>
              )}
              <p className="date-note">A morning filled with blessings, music &amp; celebration</p>
              <div className="reception-date">
                <span>RECEPTION</span>
                <p>SATURDAY <b>14 · 11 · 2026</b></p>
              </div>
            </motion.div>
          </section>

          <section className="engagement section-shell" id="engagement">
            <motion.div className="engagement-heading" {...revealUp}>
              <p className="date-kicker">A LITTLE GLIMPSE OF FOREVER</p>
              <h2>
                Our engagement <em>moments</em>
              </h2>
              <p className="engagement-caption">A few frames from the beginning of our forever.</p>
            </motion.div>
            <div className="engagement-grid">
              {[
                { number: "01", shape: "photo-tall", image: "/engagement-01.jpg", alt: "Nivetha and Srihari sharing a quiet moment together", caption: "A QUIET MOMENT" },
                { number: "02", shape: "photo-square", image: "/engagement-02.jpg", alt: "Close-up of Nivetha and Srihari's hands and engagement rings", caption: "A PROMISE FOREVER" },
                { number: "03", shape: "photo-square", image: "/engagement-03.jpg", alt: "Srihari placing a ring on Nivetha's hand as family members watch", caption: "THE RING CEREMONY" },
                { number: "04", shape: "photo-wide", image: "/engagement-04.jpg", alt: "Nivetha and Srihari walking hand in hand beside a temple pond", caption: "A WALK TOGETHER" },
              ].map(({ number, shape, image, alt, caption }, index) => (
                <motion.figure className={`engagement-photo ${shape}`} key={number} initial={{ opacity: 0, y: 32, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.72, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="engagement-photo-space">
                    <img className="engagement-real-photo" src={image} alt={alt} loading="lazy" decoding="async" />
                  </div>
                  <figcaption><span>ENGAGEMENT MOMENT {number}</span><b>{caption}</b></figcaption>
                </motion.figure>
              ))}
            </div>
          </section>

          <section className="celebration">
            <motion.div className="celebration-image" initial={{ opacity: 0, x: -46 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <img className="temple-photo" src="/dindigul-fort-temple.jpg" alt="The historic temple atop Dindigul Fort" />
              <div className="photo-caption">
                <span>DINDIGUL FORT TEMPLE</span>
                <b>Where tradition meets forever</b>
                <small>
                  Photo:{" "}
                  <a href="https://commons.wikimedia.org/wiki/File:Temple_atop_the_Dindigul_Fort.jpg" target="_blank" rel="noreferrer">
                    SriniGS / Wikimedia Commons
                  </a>{" "}
                  ·{" "}
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">
                    CC BY-SA 4.0
                  </a>
                </small>
              </div>
            </motion.div>
            <motion.div className="celebration-copy" initial={{ opacity: 0, x: 46 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
              <p className="eyebrow dark">
                <span className="eyebrow-rule" />A DAY TO REMEMBER
              </p>
              <h2>
                Rooted in
                <br />
                <em>tradition.</em>
              </h2>
              <p>In a town shaped by temple bells and timeless rituals, we begin our new journey surrounded by the people we love.</p>
            </motion.div>
          </section>

          <section className="gift-registry section-shell" id="gifts">
            <motion.div className="gift-content" {...revealUp}>
              <span className="gift-flower" aria-hidden="true">
                ✿
              </span>
              <p className="date-kicker">A TOKEN OF YOUR LOVE</p>
              <h2>
                Gifts from <em>the heart</em>
              </h2>
              <p>Your presence is the greatest gift. If you wish to bless us with something special, our gift registry is here.</p>
              <a className="registry-button" href="https://www.gokiki.in/registry/sri-nivis-wedding-1-19ia/" target="_blank" rel="noreferrer">
                VISIT OUR GIFT REGISTRY{" "}
                <span>
                  <ArrowIcon />
                </span>
              </a>
            </motion.div>
          </section>

          <section className="venue section-shell" id="venue">
            <motion.div className="venue-content" {...revealUp}>
              <div className="venue-motif" aria-hidden="true">
                <LotusMark />
              </div>
              <p className="date-kicker">THE WEDDING VENUE</p>
              <h2>
                S.S. Grand
                <br />
                <em>Mahal</em>
              </h2>
              <div className="divider">
                <span>✦</span>
              </div>
              <p className="venue-address">
                Siluvathur Road (Airport),
                <br />
                Balakrishnapuram, Dindigul – 624005
              </p>
              <a className="directions-button" href="https://maps.app.goo.gl/rKzAwcmqKN9P5jzDA" target="_blank" rel="noreferrer">
                GET DIRECTIONS{" "}
                <span>
                  <ArrowIcon />
                </span>
              </a>
              <p className="venue-blessing">We look forward to celebrating with you</p>
            </motion.div>
          </section>

          <motion.footer className="footer" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="footer-flower" aria-hidden="true">
              ✿
            </div>
            <p className="footer-monogram">
              N <i>&amp;</i> S
            </p>
            <p className="footer-names">
              NIVETHA <span>·</span> SRIHARI
            </p>
            <p className="footer-date">15 · 11 · 2026 &nbsp; — &nbsp; DINDIGUL</p>
            <span className="footer-rule" />
            <p className="footer-thanks">With love &amp; gratitude</p>
          </motion.footer>
        </main>
      </>
    </MotionConfig>
  );
}

export default App;
