import AdminLayout from "@/components/admin/AdminLayout";

const C = {
  bg: '#080808',
  gold: '#C9A84C',
  text: '#F0EDE8',
  textMuted: 'rgba(240,237,232,0.38)',
};

export default function Calendario() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 600, color: C.text, margin: 0 }}>
          Calendario de Citas
        </h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>
          Vista semanal y mensual de la agenda
        </p>
      </header>
      
      <div style={{ 
        background: '#0C0C0C', 
        border: '1px solid rgba(201,168,76,0.12)', 
        borderRadius: 16, 
        padding: '60px 20px', 
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🗓️</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: C.gold, marginBottom: 8 }}>
          Módulo en Construcción
        </h2>
        <p style={{ color: C.textMuted, fontSize: 14 }}>
          Estamos trabajando para traerte la mejor vista de calendario pronto.
        </p>
      </div>
    </div>
  );
}
