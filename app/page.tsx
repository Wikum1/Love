"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "./love.css";

type Photo = {
  src: string;
  title: string;
  text: string;
};

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "heart" | "sparkle" | "rose";
};

const photos: Photo[] = [
  { src: "/photo1.jpg", title: "Us in January", text: "The beginning of everything ❤️" },
  { src: "/photo2.jpg", title: "That smile", text: "You light up every room 💫" },
  { src: "/photo3.jpg", title: "Our adventure", text: "With you, every day is new ✨" },
  { src: "/photo4.jpg", title: "Golden hour", text: "My favourite view is you 🌅" },
  { src: "/photo5.jpg", title: "Laughing again", text: "You make everything better 💕" },
  { src: "/photo6.jpg", title: "Just us", text: "Two hearts, one story 🌸" },
  { src: "/photo7.jpg", title: "Sweet moments", text: "Every second counts with you ⏳" },
  { src: "/photo8.jpg", title: "Our world", text: "You are home to me 🏠" },
  { src: "/photo9.jpg", title: "Remember this?", text: "I'll never forget this day 🌙" },
  { src: "/photo10.jpg", title: "Pure joy", text: "This is what love looks like 💖" },
];

const questions: Question[] = [
  {
    question: "What is my lovely nickname for you?",
    options: ["Baby", "Chooty", "Princess"],
    answer: "Chooty",
  },
  {
    question: "Who is the most special girl in my life?",
    options: ["Nethu", "Someone else", "No one"],
    answer: "Nethu",
  },
  {
    question: "What do I want from you right now?",
    options: ["A fight", "Forgiveness", "Silence"],
    answer: "Forgiveness",
  },
];

const EMOJIS = ["❤️", "✨", "🌸", "💫", "🌹"];

export default function Home() {
  const [phase, setPhase] = useState<"landing" | "opening" | "open">("landing");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const [love, setLove] = useState(15);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cursorHearts, setCursorHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [forgiven, setForgiven] = useState(false);
  const [noPos, setNoPos] = useState({ top: "auto", left: "auto" });
  const [activeSection, setActiveSection] = useState(0);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextIdRef = useRef(0);

  // Generate ambient particles
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 18 + 8,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 7,
      type: (["heart", "sparkle", "rose"] as const)[Math.floor(Math.random() * 3)],
    }));
    setParticles(generated);
  }, []);

  // Confetti canvas
  const launchConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: { x: number; y: number; r: number; d: number; color: string; tilt: number; tiltAngle: number; tiltAngleInc: number }[] = [];
    const colors = ["#ff003c", "#ffffff", "#ff758f", "#ffccd5", "#8b0000", "#ffd6df"];

    for (let i = 0; i < 220; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 3,
        d: Math.random() * 220,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
      });
    }

    let angle = 0;
    let frame: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;

      pieces.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(angle + p.d) + 2.5) * 1.5;
        p.x += Math.sin(angle) * 1.2;
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (pieces[0].y < canvas.height + 50) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    draw();
    setTimeout(() => cancelAnimationFrame(frame), 5000);
  }, []);

  const openEnvelope = () => {
    setPhase("opening");
    setTimeout(() => {
      setPhase("open");
      if (musicRef.current) {
        musicRef.current.volume = 0.4;
        musicRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
      }
    }, 1200);
  };

  const toggleMusic = () => {
    if (!musicRef.current) return;
    if (musicPlaying) {
      musicRef.current.pause();
      setMusicPlaying(false);
    } else {
      musicRef.current.play();
      setMusicPlaying(true);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (Math.random() > 0.85) {
      const id = nextIdRef.current++;
      setCursorHearts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setCursorHearts(prev => prev.filter(h => h.id !== id)), 900);
    }
  }, []);

  const handleAnswer = (qIndex: number, option: string) => {
    if (answered[qIndex]) return;
    setAnswered(prev => ({ ...prev, [qIndex]: option }));
    if (option === questions[qIndex].answer) setScore(s => s + 1);
  };

  const handleForgive = () => {
    setForgiven(true);
    launchConfetti();
  };

  const moveNoButton = () => {
    setNoPos({
      top: Math.random() * 200 + "px",
      left: Math.random() * 200 + "px",
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sections = ["hero", "memories", "quiz", "meter", "forgive"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setActiveSection(sections.indexOf(e.target.id));
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [phase]);

  return (
    <main className="lv-root" onMouseMove={handleMouseMove}>
      <audio ref={musicRef} src="/audio/music.mp3" loop preload="auto" />
      <canvas ref={canvasRef} className="lv-confetti-canvas" />

      {/* Ambient particles */}
      <div className="lv-particles" aria-hidden>
        {particles.map(p => (
          <span
            key={p.id}
            className={`lv-particle lv-particle--${p.type}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.type === "heart" ? "❤️" : p.type === "sparkle" ? "✨" : "🌹"}
          </span>
        ))}
      </div>

      {/* Cursor trail */}
      {cursorHearts.map(h => (
        <span key={h.id} className="lv-cursor-heart" style={{ left: h.x, top: h.y }}>
          ❤️
        </span>
      ))}

      {/* ======== LANDING ======== */}
      {phase === "landing" && (
        <section className="lv-landing">
          <div className="lv-landing__bg-mesh" />
          <div className="lv-landing__orb lv-landing__orb--1" />
          <div className="lv-landing__orb lv-landing__orb--2" />
          <div className="lv-landing__orb lv-landing__orb--3" />

          <div className="lv-landing__text">
            <p className="lv-landing__eyebrow">A message crafted with love, just for</p>
            <h1 className="lv-landing__name">Nethu</h1>
            <p className="lv-landing__sub">My dearest Chooty 💌</p>
          </div>

          <button
            className={`lv-envelope ${phase === "opening" ? "lv-envelope--opening" : ""}`}
            onClick={openEnvelope}
            aria-label="Open envelope"
          >
            <div className="lv-env__body">
              <div className="lv-env__flap" />
              <div className="lv-env__left" />
              <div className="lv-env__right" />
              <div className="lv-env__bottom" />
              <div className="lv-env__letter">
                <span className="lv-env__letter-icon">💌</span>
                <p>Open Me</p>
                <small>I have something to say...</small>
              </div>
            </div>
            <div className="lv-env__seal">❤️</div>
          </button>

          <p className="lv-landing__hint">
            <span className="lv-landing__hint-dot" />
            Tap the envelope to open my heart
          </p>

          <div className="lv-landing__sparkles" aria-hidden>
            {["✨", "💖", "✨", "💕", "🌸", "💫"].map((s, i) => (
              <span key={i} className="lv-sparkle" style={{ animationDelay: `${i * 0.9}s` }}>{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* ======== OPENING TRANSITION ======== */}
      {phase === "opening" && (
        <div className="lv-transition">
          <div className="lv-transition__ring lv-transition__ring--1" />
          <div className="lv-transition__ring lv-transition__ring--2" />
          <div className="lv-transition__ring lv-transition__ring--3" />
          <span className="lv-transition__heart">❤️</span>
        </div>
      )}

      {/* ======== OPEN STATE ======== */}
      {phase === "open" && (
        <div className="lv-page">

          {/* Side nav dots */}
          <nav className="lv-sidenav" aria-label="Page sections">
            {["hero", "memories", "quiz", "meter", "forgive"].map((id, i) => (
              <button
                key={id}
                className={`lv-sidenav__dot ${activeSection === i ? "lv-sidenav__dot--active" : ""}`}
                onClick={() => scrollTo(id)}
                aria-label={id}
              />
            ))}
          </nav>

          {/* Music btn */}
          <button className="lv-music-btn" onClick={toggleMusic} aria-label="Toggle music">
            <span className={`lv-music-btn__icon ${musicPlaying ? "lv-music-btn__icon--playing" : ""}`}>
              {musicPlaying ? "🎵" : "🔇"}
            </span>
          </button>

          {/* ---- HERO ---- */}
          <section id="hero" className="lv-hero">
            <div className="lv-hero__bg" />
            <div className="lv-hero__overlay" />
            <div className="lv-hero__content">
              <span className="lv-hero__tag">A message from my heart</span>
              <h1 className="lv-hero__title">
                I'm Sorry<br />
                <em>Nethu</em>
                <span className="lv-hero__title-heart"> ❤️</span>
              </h1>
              <p className="lv-hero__message">
                Chooty, I poured my heart into making this little world, just for you.
                I know you're upset with me and you have every right to be.
                But I truly, deeply care about you, and I'd never want to hurt your heart.
              </p>
              <div className="lv-hero__actions">
                <button className="lv-btn lv-btn--primary" onClick={() => scrollTo("memories")}>
                  See our memories 💌
                </button>
                <button className="lv-btn lv-btn--ghost" onClick={() => scrollTo("forgive")}>
                  Skip to the end 🥺
                </button>
              </div>
            </div>
            <div className="lv-hero__scroll-hint">
              <span>↓</span>
            </div>
          </section>

          {/* ---- GALLERY ---- */}
          <section id="memories" className="lv-gallery">
            <div className="lv-section-header">
              <span className="lv-tag">Our story</span>
              <h2>Memories I Treasure 📸</h2>
              <p>Every photo holds a piece of my heart</p>
            </div>

            <div className="lv-slider">
              <div className="lv-slider__track">
                {[...photos, ...photos].map((photo, i) => (
                  <div className="lv-slide" key={i}>
                    <img src={photo.src} alt={photo.title} loading="lazy" />
                    <div className="lv-slide__overlay">
                      <h3>{photo.title}</h3>
                      <p>{photo.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- QUIZ ---- */}
          <section id="quiz" className="lv-section lv-quiz">
            <div className="lv-section-header">
              <span className="lv-tag">Cute little test</span>
              <h2>How Well Do You Know Me? 💕</h2>
              <p>Let's see what my Chooty remembers</p>
            </div>

            <div className="lv-quiz__progress-bar">
              <div
                className="lv-quiz__progress-fill"
                style={{ width: `${(Object.keys(answered).length / questions.length) * 100}%` }}
              />
              <span className="lv-quiz__progress-label">
                {Object.keys(answered).length} of {questions.length} answered
              </span>
            </div>

            <div className="lv-quiz__cards">
              {questions.map((q, qi) => (
                <div className={`lv-question ${answered[qi] ? "lv-question--answered" : ""}`} key={qi}>
                  <div className="lv-question__meta">
                    <span className="lv-question__num">Q{qi + 1}</span>
                    {answered[qi] && (
                      <span className={`lv-question__status ${answered[qi] === q.answer ? "correct" : "wrong"}`}>
                        {answered[qi] === q.answer ? "✓ Correct!" : "✗ Wrong"}
                      </span>
                    )}
                  </div>
                  <h3>{q.question}</h3>
                  <div className="lv-options">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        className={`lv-option ${
                          answered[qi] === opt
                            ? opt === q.answer ? "lv-option--correct" : "lv-option--wrong"
                            : answered[qi] ? "lv-option--dim" : ""
                        }`}
                        onClick={() => handleAnswer(qi, opt)}
                        disabled={!!answered[qi]}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lv-quiz__result">
              <div className="lv-quiz__result-score">
                <span className="lv-quiz__result-num">{score}</span>
                <span className="lv-quiz__result-denom">/{questions.length}</span>
              </div>
              <p>
                {score === questions.length
                  ? "Perfect score! You know me so well, Chooty 🥺❤️"
                  : score >= 2
                  ? "You still remember me well! ❤️"
                  : "Hmm… we need more cute memories together 😅"}
              </p>
            </div>
          </section>

          {/* ---- LOVE METER ---- */}
          <section id="meter" className="lv-section lv-meter-section">
            <div className="lv-section-header">
              <span className="lv-tag">Love challenge</span>
              <h2>Fill My Heart For You ❤️</h2>
              <p>Tap until my love reaches 100%, Chooty</p>
            </div>

            <div className="lv-meter__heart-wrap">
              <div className="lv-meter__heart-glow" style={{ opacity: love / 100 }} />
              <button
                className="lv-meter__heart"
                onClick={() => setLove(l => Math.min(l + 10, 100))}
                aria-label="Send love"
              >
                ❤️
              </button>
              <span className="lv-meter__pct">{love}%</span>
            </div>

            <div className="lv-meter__bar-wrap">
              <div className="lv-meter__bar">
                <div className="lv-meter__bar-fill" style={{ width: `${love}%` }} />
              </div>
              <div className="lv-meter__labels">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <button
              className="lv-btn lv-btn--primary lv-meter__btn"
              onClick={() => setLove(l => Math.min(l + 10, 100))}
            >
              Send Love ❤️
            </button>

            {love === 100 && (
              <div className="lv-meter__full-card">
                <div className="lv-meter__full-icon">🥺</div>
                <h3>My heart is completely full now</h3>
                <p>
                  Nethu, no matter what happens, my heart always finds its way back to you.
                </p>
              </div>
            )}
          </section>

          {/* ---- FORGIVE ---- */}
          <section id="forgive" className="lv-section lv-forgive">
            <div className="lv-section-header">
              <span className="lv-tag">Final question</span>
              <h2>One Last Thing, Chooty...</h2>
            </div>

            <p className="lv-forgive__text">
              Nethu, I know I made you angry. But my heart never wanted to hurt you.
              I promise to do better. Can you find it in your heart to forgive me? 🥺❤️
            </p>

            <div className="lv-forgive__card">
              <div className="lv-forgive__ribbon">I choose you</div>
              <div className="lv-forgive__icon">💖</div>
              <h3>Will you give me one more smile?</h3>

              {!forgiven ? (
                <div className="lv-forgive__btns">
                  <button className="lv-btn lv-btn--primary lv-btn--large" onClick={handleForgive}>
                    Yes, I forgive you ❤️
                  </button>
                  <button
                    className="lv-btn lv-btn--dark lv-forgive__no-btn"
                    style={{ position: "relative", ...noPos }}
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                  >
                    No 😅
                  </button>
                </div>
              ) : (
                <div className="lv-forgive__success">
                  <div className="lv-forgive__success-icon">🥰</div>
                  <h4>Thank you, Manike</h4>
                  <p>Yaaay ❤️ I love you, Chooty! You mean the whole world to me. 🌍</p>
                </div>
              )}
            </div>
          </section>

          <footer className="lv-footer">
            <p>Made with all my heart, just for <strong>Nethu</strong> 💌</p>
          </footer>
        </div>
      )}
    </main>
  );
}