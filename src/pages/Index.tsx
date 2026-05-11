import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const SERVICES = [
    {
      num: "01",
      badge: "Popular",
      title: "Full Groom",
      desc: "Baño, secado profesional, corte según raza, uñas, limpieza de orejas y perfume de larga duración.",
      price: "Desde $65",
      detail: "XS–XXL · ~2 horas",
    },
    {
      num: "02",
      badge: null,
      title: "Minigroom",
      desc: "Baño completo con shampoo premium, secado profesional y arreglo de mantenimiento mensual.",
      price: "Desde $50",
      detail: "XS–XXL · ~1 hora",
    },
    {
      num: "03",
      badge: null,
      title: "Luxury Bath",
      desc: "Baño con productos de lujo, mascarilla hidratante para el pelaje y colonia exclusiva.",
      price: "Desde $45",
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
    { n: "01", t: "Elige el servicio", d: "Selecciona el tratamiento ideal según el tamaño y tipo de pelaje de tu perro." },
    { n: "02", t: "Elige fecha y hora", d: "Consulta disponibilidad en tiempo real. Sin llamadas, sin WhatsApp, 24/7." },
    { n: "03", t: "Confirmación inmediata", d: "Recibes confirmación por correo y un recordatorio automático 24 horas antes." },
  ];

  const STATS = [
    { n: "200+", l: "Clientes felices" },
    { n: "5 ★", l: "Calificación" },
    { n: "100%", l: "Con amor" },
  ];

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
      `}</style>

      <div className="q4-root q4-sans">
        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 48px", borderBottom: "1px solid rgba(240,237,232,0.06)" }}>
          <div>
            <h1 className="q4-serif" style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.18em", color: "#C9A84C", margin: 0 }}>
              Q4 PAWS
            </h1>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,232,0.35)", margin: "4px 0 0" }}>
              Dog Grooming · Kissimmee, FL
            </p>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[
              { l: "Servicios", id: "servicios" },
              { l: "Precios", id: "precios" },
              { l: "Cómo funciona", id: "proceso" },
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
              Reservar
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: "relative", padding: "120px 48px 100px", textAlign: "center", overflow: "hidden" }}>
          <div className="q4-glow" />

          <div className="q4-paw" style={{ position: "absolute", right: "8%", top: "50%", opacity: 0.06 }}>
            <svg width="280" height="280" viewBox="0 0 100 100" fill="#C9A84C">
              <circle cx="30" cy="35" r="9" />
              <circle cx="50" cy="25" r="9" />
              <circle cx="70" cy="35" r="9" />
              <ellipse cx="50" cy="65" rx="22" ry="20" />
            </svg>
          </div>

          <div className="q4-reveal q4-d1" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 999, marginBottom: 40 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#C9A84C" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>
              Peluquería canina de lujo
            </span>
          </div>

          <h2 className="q4-serif q4-reveal q4-d2" style={{ fontSize: "clamp(48px, 7vw, 92px)", fontWeight: 300, lineHeight: 1.05, margin: "0 0 32px", letterSpacing: "-0.01em" }}>
            Tu perro merece
            <br />
            <em style={{ color: "#C9A84C", fontWeight: 400 }}>lo extraordinario</em>
          </h2>

          <p className="q4-reveal q4-d3" style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: "rgba(240,237,232,0.6)", maxWidth: 540, margin: "0 auto 48px", whiteSpace: "pre-line" }}>
            {"Servicios de grooming premium en Kissimmee.\nReserva en minutos — sin llamadas, sin esperas."}
          </p>

          <div className="q4-reveal q4-d4" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 100 }}>
            <button
              onClick={() => navigate("/reservar")}
              className="q4-btn-gold"
              style={{
                background: "#C9A84C",
                color: "#080808",
                border: "none",
                padding: "13px 34px",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Reservar cita ahora
            </button>
            <button
              onClick={() => scrollTo("servicios")}
              style={{
                background: "transparent",
                color: "rgba(240,237,232,0.55)",
                border: "1px solid rgba(240,237,232,0.18)",
                padding: "13px 28px",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Ver servicios
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap" }}>
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
        <section id="servicios" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", margin: "0 0 16px" }}>
            Nuestros servicios
          </p>
          <h3 className="q4-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, textAlign: "center", lineHeight: 1.15, margin: "0 0 72px", whiteSpace: "pre-line" }}>
            {"El estándar más alto\npara tu mejor amigo"}
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
        <section style={{ padding: "60px 48px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <p className="q4-serif" style={{ fontSize: 22, textAlign: "center", color: "rgba(240,237,232,0.7)", fontStyle: "italic", margin: "0 0 32px", fontWeight: 300 }}>
            Servicios adicionales
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
        <section id="proceso" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(240,237,232,0.06)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", margin: "0 0 16px" }}>
            Proceso
          </p>
          <h3 className="q4-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, textAlign: "center", lineHeight: 1.15, margin: "0 0 72px", whiteSpace: "pre-line" }}>
            {"Reservar nunca fue\ntan fácil"}
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

        {/* CTA */}
        <section style={{ position: "relative", padding: "120px 48px", textAlign: "center", borderTop: "1px solid rgba(240,237,232,0.06)", overflow: "hidden" }}>
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
            ¿Lista para la <em style={{ color: "#C9A84C" }}>experiencia Q4</em>?
          </h3>
          <p style={{ fontSize: 14, color: "rgba(240,237,232,0.5)", margin: "0 0 48px", fontWeight: 300, letterSpacing: "0.05em" }}>
            Tu perro se lo merece · Kissimmee, FL · @q4paws
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
            Reservar mi cita ahora
          </button>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "48px", textAlign: "center", borderTop: "1px solid rgba(240,237,232,0.06)" }}>
          <h4 className="q4-serif" style={{ fontSize: 18, fontWeight: 400, letterSpacing: "0.2em", color: "#C9A84C", margin: "0 0 12px" }}>
            Q4 PAWS
          </h4>
          <p style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(240,237,232,0.35)", margin: 0 }}>
            q4pawsdg@gmail.com · +1 321-318-87-60 · @q4paws · Kissimmee, FL
          </p>
        </footer>
      </div>
    </>
  );
}
