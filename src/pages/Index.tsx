import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGallery";
import { useLanguage } from "@/contexts/LanguageContext";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, LanguageToggle } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const SERVICES = [
    {
      num: "01",
      badge: t("servicesPopular"),
      title: t("fullGroom"),
      desc: t("servicesFullGroom"),
      price: `${t("servicesFrom")} $65`,
      detail: "XS–XXL · ~2 horas",
    },
    {
      num: "02",
      badge: null,
      title: t("miniGroom"),
      desc: t("servicesMinigroom"),
      price: `${t("servicesFrom")} $50`,
      detail: "XS–XXL · ~1 hora",
    },
    {
      num: "03",
      badge: null,
      title: t("luxuryBath"),
      desc: t("servicesLuxuryBath"),
      price: `${t("servicesFrom")} $45`,
      detail: "XS–XXL · ~90 min",
    },
  ];

  const ADDONS = [
    "Hand Scissoring $11/min",
    "Hand Stripping $50/hr",
    "Exotic Groom $25",
    "Spa Bath +$10",
    "Specialty Shampoo +$3",
    "Anal Glands $5",
    "Nail Band $20",
    "Paw / Peel Thin ~$15",
    "Ear Clean $12",
  ];

  const STEPS = [
    { n: "01", t: t("processStep1Title"), d: t("processStep1Desc") },
    { n: "02", t: t("processStep2Title"), d: t("processStep2Desc") },
    { n: "03", t: t("processStep3Title"), d: t("processStep3Desc") },
  ];

  const STATS = [
    { n: "200+", l: t("statClients") },
    { n: "5 ★", l: t("statRating") },
    { n: "100%", l: t("statLove") },
  ];

  function GallerySection() {
    const { data: photos = [], isLoading } = useGalleryPhotos(false);
    const [index, setIndex] = useState(-1);

    if (isLoading || photos.length === 0) return null;

    return (
      <section id="galeria" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(240,237,232,0.06)" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", margin: "0 0 16px" }}>
          {t("galleryEyebrow")}
        </p>
        <h3 className="q4-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, textAlign: "center", lineHeight: 1.15, margin: "0 0 72px" }}>
          {t("galleryTitle")}
        </h3>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: 16 
        }}>
          {photos.map((photo, i) => (
            <div 
              key={photo.id}
              onClick={() => setIndex(i)}
              style={{ 
                position: "relative", 
                paddingTop: "100%", 
                cursor: "pointer",
                overflow: "hidden",
                background: "#0C0C0C",
                border: "1px solid rgba(201,168,76,0.15)"
              }}
              className="q4-card"
            >
              <img 
                src={photo.photo_url} 
                alt={photo.caption || ""} 
                style={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  transition: "transform 0.5s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              {photo.caption && (
                <div style={{ 
                  position: "absolute", 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  padding: "20px", 
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "#F0EDE8",
                  fontSize: 12,
                  fontFamily: "DM Sans, sans-serif"
                }}>
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={photos.map(p => ({ src: p.photo_url, title: p.caption || undefined }))}
        />
      </section>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .q4-root { background:#080808; color:#F0EDE8; min-height:100vh; }
        .q4-serif { font-family: 'Cormorant Garamond', serif; }
        .q4-sans  { font-family: 'DM Sans', sans-serif; }
        .q4-card  { transition: background 0.2s ease, border-color 0.2s ease; }
        .q4-card:hover { background:#0F0F0F !important; border-color: rgba(201,168,76,0.4) !important; }
        .q4-btn-gold { transition: opacity 0.2s ease, transform 0.15s ease; }
        .q4-btn-gold:hover { opacity: 0.88; transform: scale(1.01); }
        .q4-link:hover { color:#C9A84C !important; }
        .q4-paw { animation: q4float 8s ease-in-out infinite; }
        @keyframes q4float {
          0%,100% { transform: translateY(-50%) rotate(0deg); }
          50%      { transform: translateY(-53%) rotate(3deg); }
        }
        .q4-reveal { opacity:0; transform:translateY(18px); animation: q4in 0.7s ease forwards; }
        .q4-d1 { animation-delay: 0.05s; }
        .q4-d2 { animation-delay: 0.18s; }
        .q4-d3 { animation-delay: 0.30s; }
        .q4-d4 { animation-delay: 0.44s; }
        @keyframes q4in { to { opacity:1; transform:translateY(0); } }
        .q4-glow { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 110%, rgba(201,168,76,0.07) 0%, transparent 65%); pointer-events:none; }

        /* NAV */
        .q4-nav { padding: 28px 48px; }
        .q4-logo-sub { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(240,237,232,0.35); margin: 4px 0 0; }
        .q4-nav-desktop-links { display: flex; gap: 32px; align-items: center; }
        .q4-nav-reservar-desktop { display: flex; }
        .q4-nav-hamburger { display: none; }

        /* HERO */
        .q4-hero { padding: 120px 48px 100px; }

        /* HERO BUTTONS */
        .q4-hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 100px; }
        .q4-hero-btn-primary {
          background: #C9A84C; color: #080808; border: none;
          padding: 13px 34px; font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer; font-weight: 500;
          transition: opacity 0.2s ease, transform 0.15s ease;
        }
        .q4-hero-btn-primary:hover { opacity: 0.88; transform: scale(1.01); }
        .q4-hero-btn-secondary {
          background: transparent; color: rgba(240,237,232,0.55);
          border: 1px solid rgba(240,237,232,0.18);
          padding: 13px 28px; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .q4-hero-btn-secondary:hover { border-color: rgba(240,237,232,0.4); color: rgba(240,237,232,0.8); }

        /* MOBILE MENU DROPDOWN */
        .q4-mobile-menu {
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          background: #080808;
          border-bottom: 1px solid rgba(201,168,76,0.45);
          z-index: 100;
          display: flex;
          flex-direction: column;
          padding: 0 24px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.35s ease;
        }
        .q4-mobile-menu.open {
          max-height: 420px;
          padding: 20px 24px 28px;
        }

        /* FOOTER */
        .q4-footer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 767px) {
          /* NAV mobile */
          .q4-nav { padding: 16px 20px; }
          .q4-logo-sub { display: none; }
          .q4-nav-desktop-links { display: none; }
          .q4-nav-reservar-desktop { display: none; }
          .q4-nav-hamburger { display: flex; }

          /* HERO mobile */
          .q4-hero { padding: 48px 20px 80px; }

          /* HERO BUTTONS mobile — full width stacked */
          .q4-hero-btns { flex-direction: column; gap: 12px; }
          .q4-hero-btn-primary {
            width: 100%;
            padding: 16px 24px;
            font-size: 13px;
            text-align: center;
          }
          .q4-hero-btn-secondary {
            width: 100%;
            padding: 16px 24px;
            font-size: 13px;
            text-align: center;
          }

          /* FOOTER mobile */
          .q4-footer-inner { gap: 16px; }
        }
      `}</style>

      <div className="q4-root q4-sans">

        {/* BACKDROP — close menu on click outside */}
        {isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
          />
        )}

        {/* MOBILE DROPDOWN MENU */}
        <div className={`q4-mobile-menu ${isMenuOpen ? "open" : ""}`}>
          {[
            { l: t("services"), id: "servicios" },
            { l: t("pricing"), id: "precios" },
            { l: t("howItWorks"), id: "proceso" },
          ].map((x) => (
            <button
              key={x.id}
              onClick={() => scrollTo(x.id)}
              className="q4-serif"
              style={{
                fontSize: 28,
                textAlign: "left",
                color: "#F0EDE8",
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(240,237,232,0.07)",
                cursor: "pointer",
                padding: "14px 0",
                minHeight: 56,
              }}
            >
              {x.l}
            </button>
          ))}
          <button
            onClick={() => { navigate("/reservar"); setIsMenuOpen(false); }}
            style={{
              marginTop: 20,
              width: "100%",
              minHeight: 56,
              background: "#C9A84C",
              color: "#080808",
              border: "none",
              padding: "16px",
              fontSize: 13,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("bookNow")}
          </button>
        </div>

        {/* NAV */}
        <nav
          className="q4-nav"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(240,237,232,0.06)",
            position: "relative",
            zIndex: 101,
          }}
        >
          {/* LOGO */}
          <div>
            <h1
              className="q4-serif"
              style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.18em", color: "#C9A84C", margin: 0 }}
            >
              Q4 PAWS
            </h1>
            <p className="q4-logo-sub">Dog Grooming · Kissimmee, FL</p>
          </div>

          {/* DESKTOP LINKS + RESERVAR */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div className="q4-nav-desktop-links">
              {[
                { l: t("services"), id: "servicios" },
                { l: t("pricing"), id: "precios" },
                { l: t("howItWorks"), id: "proceso" },
              ].map((x) => (
                <button
                  key={x.id}
                  onClick={() => scrollTo(x.id)}
                  className="q4-link"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(240,237,232,0.45)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {x.l}
                </button>
              ))}
            </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <button
                  onClick={() => navigate("/reservar")}
                  style={{
                    border: "1px solid #C9A84C",
                    color: "#C9A84C",
                    background: "transparent",
                    padding: "9px 22px",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {t("bookShort")}
                </button>
              </div>
          </div>

          {/* HAMBURGER — mobile only */}
          <button
            className="q4-nav-hamburger"
            onClick={() => setIsMenuOpen((v) => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, alignItems: "center" }}
            aria-label="Menú"
          >
            {isMenuOpen
              ? <X size={24} color="#C9A84C" />
              : <Menu size={24} color="#C9A84C" />
            }
          </button>
        </nav>

        {/* HERO */}
        <section
          className="q4-hero"
          style={{ position: "relative", textAlign: "center", overflow: "hidden" }}
        >
          <div className="q4-glow" />

          <div className="q4-paw" style={{ position: "absolute", right: "8%", top: "50%", opacity: 0.06 }}>
            <svg width="280" height="280" viewBox="0 0 100 100" fill="#C9A84C">
              <circle cx="30" cy="35" r="9" />
              <circle cx="50" cy="25" r="9" />
              <circle cx="70" cy="35" r="9" />
              <ellipse cx="50" cy="65" rx="22" ry="20" />
            </svg>
          </div>

          <div
            className="q4-reveal q4-d1"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 999, marginBottom: 40 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#C9A84C" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>
              {t("heroBadge")}
            </span>
          </div>

          <h2
            className="q4-serif q4-reveal q4-d2"
            style={{
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: 300,
              lineHeight: 1.05,
              margin: "0 0 32px",
              letterSpacing: "-0.01em",
            }}
          >
            {t("heroTitle1")}
            <br />
            <em style={{ color: "#C9A84C", fontWeight: 400 }}>{t("heroTitleHighlight")}</em>
          </h2>

          <p
            className="q4-reveal q4-d3"
            style={{
              fontSize: 16,
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(240,237,232,0.6)",
              maxWidth: 540,
              margin: "0 auto 48px",
              whiteSpace: "pre-line",
            }}
          >
            {t("heroSubtitle")}
          </p>

          <div className="q4-reveal q4-d4 q4-hero-btns">
            <button
              onClick={() => navigate("/reservar")}
              className="q4-hero-btn-primary"
            >
              {t("heroBtnPrimary")}
            </button>
            <button
              onClick={() => scrollTo("servicios")}
              className="q4-hero-btn-secondary"
            >
              {t("heroBtnSecondary")}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 10vw, 64px)", flexWrap: "wrap" }}>
            {STATS.map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <p className="q4-serif" style={{ fontSize: 36, fontWeight: 400, color: "#C9A84C", margin: 0 }}>
                  {s.n}
                </p>
                <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", margin: "8px 0 0" }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="servicios" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", margin: "0 0 16px" }}>
            {t("servicesEyebrow")}
          </p>
          <h3 className="q4-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, textAlign: "center", lineHeight: 1.15, margin: "0 0 72px", whiteSpace: "pre-line" }}>
            {t("servicesTitle")}
          </h3>

          <div id="precios" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {SERVICES.map((s) => (
              <div
                key={s.title}
                onClick={() => navigate("/reservar")}
                className="q4-card"
                style={{
                  position: "relative",
                  padding: "40px 32px",
                  border: "1px solid rgba(240,237,232,0.08)",
                  background: "#0A0A0A",
                  cursor: "pointer",
                }}
              >
                {s.badge && (
                  <span style={{ position: "absolute", top: 20, right: 20, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A84C", border: "1px solid #C9A84C", padding: "3px 10px" }}>
                    {s.badge}
                  </span>
                )}
                <p className="q4-serif" style={{ fontSize: 14, color: "rgba(201,168,76,0.6)", margin: "0 0 24px", letterSpacing: "0.2em" }}>
                  {s.num}
                </p>
                <h4 className="q4-serif" style={{ fontSize: 32, fontWeight: 400, margin: "0 0 16px", color: "#F0EDE8" }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(240,237,232,0.5)", margin: "0 0 32px", fontWeight: 300 }}>
                  {s.desc}
                </p>
                <div style={{ borderTop: "1px solid rgba(240,237,232,0.08)", paddingTop: 20 }}>
                  <p className="q4-serif" style={{ fontSize: 22, color: "#C9A84C", margin: 0 }}>{s.price}</p>
                  <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,237,232,0.35)", margin: "6px 0 0" }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ADD-ONS */}
        <section style={{ padding: "60px 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <p className="q4-serif" style={{ fontSize: 22, textAlign: "center", color: "rgba(240,237,232,0.7)", fontStyle: "italic", margin: "0 0 32px", fontWeight: 300 }}>
            {t("addonsTitle")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {ADDONS.map((a) => (
              <span
                key={a}
                style={{
                  fontSize: 12,
                  letterSpacing: "0.05em",
                  color: "rgba(240,237,232,0.6)",
                  border: "1px solid rgba(240,237,232,0.12)",
                  padding: "8px 18px",
                  borderRadius: 999,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="proceso" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(240,237,232,0.06)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", margin: "0 0 16px" }}>
            {t("processEyebrow")}
          </p>
          <h3 className="q4-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, textAlign: "center", lineHeight: 1.15, margin: "0 0 72px", whiteSpace: "pre-line" }}>
            {t("processTitle")}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 48 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ textAlign: "left" }}>
                <p className="q4-serif" style={{ fontSize: 56, fontWeight: 300, color: "#C9A84C", margin: "0 0 16px", lineHeight: 1 }}>
                  {s.n}
                </p>
                <h4 className="q4-serif" style={{ fontSize: 24, fontWeight: 400, margin: "0 0 12px", color: "#F0EDE8" }}>
                  {s.t}
                </h4>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(240,237,232,0.5)", margin: 0, fontWeight: 300 }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <GallerySection />

        {/* CTA */}
        <section style={{ position: "relative", padding: "120px 24px", textAlign: "center", borderTop: "1px solid rgba(240,237,232,0.06)", overflow: "hidden" }}>
          <div className="q4-glow" />
          <div style={{ display: "inline-block", marginBottom: 32, opacity: 0.4 }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="#C9A84C">
              <circle cx="30" cy="35" r="8" />
              <circle cx="50" cy="25" r="8" />
              <circle cx="70" cy="35" r="8" />
              <ellipse cx="50" cy="65" rx="20" ry="18" />
            </svg>
          </div>
          <h3 className="q4-serif" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300, margin: "0 0 24px", lineHeight: 1.1 }}>
            {t("ctaTitle1")}<em style={{ color: "#C9A84C" }}>{t("ctaTitleHighlight")}</em>{t("ctaTitle2")}
          </h3>
          <p style={{ fontSize: 14, color: "rgba(240,237,232,0.5)", margin: "0 0 48px", fontWeight: 300, letterSpacing: "0.05em" }}>
            {t("ctaSubtitle")}
          </p>
          <button
            onClick={() => navigate("/reservar")}
            className="q4-btn-gold"
            style={{
              background: "#C9A84C",
              color: "#080808",
              border: "none",
              padding: "14px 40px",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {t("ctaBtn")}
          </button>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "48px 24px", borderTop: "1px solid rgba(240,237,232,0.06)" }}>
          <div className="q4-footer-inner" style={{ textAlign: "center" }}>
            <h4
              className="q4-serif"
              style={{ fontSize: 18, fontWeight: 400, letterSpacing: "0.2em", color: "#C9A84C", margin: 0 }}
            >
              Q4 PAWS
            </h4>
            <p style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(240,237,232,0.35)", margin: 0 }}>
              q4pawsdg@gmail.com · +1 321-318-87-60 · @q4paws · Kissimmee, FL
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(201,168,76,0.3)",
                fontSize: 10,
                letterSpacing: "0.05em",
                cursor: "pointer",
                textTransform: "uppercase",
                padding: 0,
              }}
            >
              {t("footerAdmin")}
            </button>
          </div>
        </footer>

      </div>
    </>
  );
}
