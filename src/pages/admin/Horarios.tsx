import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { Loader2, X, Lock, CalendarOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  useBusinessSchedule,
  useUpdateSchedule,
  useBlockedDates,
  useAddBlockedDate,
  useRemoveBlockedDate,
} from "@/hooks/useSchedule";
import type { BusinessSchedule } from "@/types";

// ─── Constantes ────────────────────────────────────────────────────────────────

const DAY_LABEL: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

// Orden de visualización: lun → dom
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

// ─── Estilos reutilizables ────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "#080808",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: 6,
  color: "#F0EDE8",
  padding: "0.4rem 0.6rem",
  fontSize: "0.875rem",
  width: "100%",
  outline: "none",
};

const sectionStyle: React.CSSProperties = {
  background: "#0C0C0C",
  border: "1px solid rgba(201,168,76,0.12)",
  borderRadius: 12,
  padding: "1.5rem",
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Horarios() {
  const { data: schedules, isLoading: loadingSchedules } =
    useBusinessSchedule();
  const { data: blockedDates, isLoading: loadingBlocked } = useBlockedDates();
  const updateSchedule = useUpdateSchedule();
  const addBlockedDate = useAddBlockedDate();
  const removeBlockedDate = useRemoveBlockedDate();

  // Estado local del horario (permite editar sin guardar de inmediato)
  const [local, setLocal] = useState<BusinessSchedule[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  // Estado del formulario de días bloqueados
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (schedules) {
      const sorted = [...schedules].sort(
        (a, b) =>
          DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week),
      );
      setLocal(sorted);
    }
  }, [schedules]);

  // ─── Handlers horario ────────────────────────────────────────────────────────

  function patchLocal(
    id: string,
    field: keyof BusinessSchedule,
    value: unknown,
  ) {
    setLocal((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
    setDirty((prev) => new Set([...prev, id]));
  }

  async function saveSchedules() {
    const toSave = local.filter((s) => dirty.has(s.id));
    try {
      await Promise.all(
        toSave.map((s) =>
          updateSchedule.mutateAsync({
            id: s.id,
            is_open: s.is_open,
            open_time: s.open_time,
            close_time: s.close_time,
            max_concurrent_appointments: s.max_concurrent_appointments,
          }),
        ),
      );
      setDirty(new Set());
      toast.success("Horarios actualizados");
    } catch {
      toast.error("Error al guardar");
    }
  }

  // ─── Handlers fechas bloqueadas ───────────────────────────────────────────────

  async function blockDate() {
    if (!selectedDay) return;
    try {
      await addBlockedDate.mutateAsync({
        date: format(selectedDay, "yyyy-MM-dd"),
        reason: reason.trim() || undefined,
      });
      setSelectedDay(undefined);
      setReason("");
      toast.success("Fecha bloqueada");
    } catch {
      toast.error("Error al bloquear la fecha");
    }
  }

  async function unblockDate(id: string) {
    try {
      await removeBlockedDate.mutateAsync(id);
      toast.success("Fecha desbloqueada");
    } catch {
      toast.error("Error al desbloquear");
    }
  }

  // Días ya bloqueados → deshabilitar en el calendario
  const alreadyBlocked = blockedDates?.map((bd) => parseISO(bd.date)) ?? [];

  const isSaving = updateSchedule.isPending;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        background: "#080808",
        minHeight: "100vh",
        padding: "2rem 1.5rem",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 600,
              color: "#C9A84C",
              margin: "0 0 0.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Gestión de Horarios
          </h1>
          <p
            style={{
              color: "rgba(240,237,232,0.38)",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Horario semanal y días cerrados del negocio
          </p>
        </div>

        {/* ── Horario Semanal ─────────────────────────────────────────────────── */}
        <section style={{ ...sectionStyle, marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.25rem",
              color: "#F0EDE8",
              margin: "0 0 1.25rem",
              fontWeight: 500,
            }}
          >
            Horario Semanal
          </h2>

          {loadingSchedules ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <Loader2
                size={24}
                style={{
                  color: "#C9A84C",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : (
            <>
              {/* Cabecera de columnas */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 64px 1fr 1fr 96px",
                  gap: "0.75rem",
                  padding: "0 0.25rem 0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                {["Día", "Abierto", "Apertura", "Cierre", "Cap. máx."].map(
                  (h) => (
                    <span
                      key={h}
                      style={{
                        color: "rgba(240,237,232,0.38)",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {h}
                    </span>
                  ),
                )}
              </div>

              {/* Filas */}
              {local.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 64px 1fr 1fr 96px",
                    gap: "0.75rem",
                    alignItems: "center",
                    padding: "0.75rem 0.25rem",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    opacity: s.is_open ? 1 : 0.45,
                    transition: "opacity 0.2s",
                  }}
                >
                  {/* Nombre del día */}
                  <span
                    style={{
                      color: "#F0EDE8",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {DAY_LABEL[s.day_of_week]}
                    {/* Indicador de cambio no guardado */}
                    {dirty.has(s.id) && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#C9A84C",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </span>

                  {/* Toggle abierto/cerrado */}
                  <Switch
                    checked={s.is_open}
                    onCheckedChange={(v) => patchLocal(s.id, "is_open", v)}
                  />

                  {/* Hora apertura */}
                  <input
                    type="time"
                    value={s.open_time}
                    disabled={!s.is_open}
                    onChange={(e) =>
                      patchLocal(s.id, "open_time", e.target.value)
                    }
                    style={inputStyle}
                  />

                  {/* Hora cierre */}
                  <input
                    type="time"
                    value={s.close_time}
                    disabled={!s.is_open}
                    onChange={(e) =>
                      patchLocal(s.id, "close_time", e.target.value)
                    }
                    style={inputStyle}
                  />

                  {/* Capacidad máxima simultánea */}
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={s.max_concurrent_appointments}
                    disabled={!s.is_open}
                    onChange={(e) =>
                      patchLocal(
                        s.id,
                        "max_concurrent_appointments",
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    style={{ ...inputStyle, textAlign: "center" }}
                  />
                </div>
              ))}

              {/* Botón guardar — solo visible si hay cambios */}
              <div
                style={{
                  marginTop: "1.25rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  minHeight: 42,
                }}
              >
                {dirty.size > 0 && (
                  <button
                    onClick={saveSchedules}
                    disabled={isSaving}
                    style={{
                      background: "#C9A84C",
                      color: "#080808",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.6rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: isSaving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      opacity: isSaving ? 0.7 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    {isSaving && (
                      <Loader2
                        size={14}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    )}
                    Guardar cambios{dirty.size > 1 ? ` (${dirty.size})` : ""}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        {/* ── Días Bloqueados ─────────────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.25rem",
              color: "#F0EDE8",
              margin: "0 0 0.25rem",
              fontWeight: 500,
            }}
          >
            Días Bloqueados
          </h2>
          <p
            style={{
              color: "rgba(240,237,232,0.38)",
              fontSize: "0.8rem",
              margin: "0 0 1.5rem",
            }}
          >
            Vacaciones, feriados o imprevistos — no aparecen en el wizard de
            reserva
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            {/* Columna izquierda: calendar + formulario */}
            <div>
              {/* Estilos mínimos para DayPicker en dark mode */}
              <style>{`
                .rdp { --rdp-accent-color: #C9A84C; --rdp-background-color: rgba(201,168,76,0.1); color: #F0EDE8; }
                .rdp-day_selected { background: #C9A84C !important; color: #080808 !important; }
                .rdp-day:hover:not([disabled]) { background: rgba(201,168,76,0.15) !important; }
                .rdp-day_disabled { opacity: 0.25; }
                .rdp-caption_label { color: #C9A84C; font-family: 'Cormorant Garamond', serif; font-size: 1rem; }
                .rdp-head_cell { color: rgba(240,237,232,0.38); font-size: 0.75rem; }
                .rdp-nav_button { color: #C9A84C; }
                .rdp-nav_button:hover { background: rgba(201,168,76,0.1) !important; }
              `}</style>

              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={es}
                disabled={[{ before: new Date() }, ...alreadyBlocked]}
              />

              {/* Formulario — visible al seleccionar fecha */}
              {selectedDay && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "1rem",
                    background: "#080808",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 8,
                  }}
                >
                  <p
                    style={{
                      color: "#C9A84C",
                      fontSize: "0.875rem",
                      margin: "0 0 0.75rem",
                      fontFamily: "Cormorant Garamond, serif",
                    }}
                  >
                    {format(selectedDay, "EEEE d 'de' MMMM yyyy", {
                      locale: es,
                    })}
                  </p>

                  <input
                    type="text"
                    placeholder="Razón (opcional) — ej: vacaciones"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && blockDate()}
                    style={{ ...inputStyle, marginBottom: "0.75rem" }}
                  />

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={blockDate}
                      disabled={addBlockedDate.isPending}
                      style={{
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.35)",
                        color: "#C9A84C",
                        borderRadius: 7,
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {addBlockedDate.isPending ? (
                        <Loader2
                          size={13}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      ) : (
                        <Lock size={13} />
                      )}
                      Bloquear
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDay(undefined);
                        setReason("");
                      }}
                      style={{
                        background: "none",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(240,237,232,0.38)",
                        borderRadius: 7,
                        padding: "0.5rem 0.875rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha: lista de fechas bloqueadas */}
            <div>
              <p
                style={{
                  color: "rgba(240,237,232,0.38)",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 0.875rem",
                }}
              >
                Próximas fechas cerradas
              </p>

              {loadingBlocked ? (
                <Loader2
                  size={16}
                  style={{
                    color: "#C9A84C",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : !blockedDates?.length ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "2rem 1rem",
                    color: "rgba(240,237,232,0.22)",
                  }}
                >
                  <CalendarOff size={24} />
                  <span style={{ fontSize: "0.8rem" }}>
                    Sin fechas bloqueadas
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {blockedDates.map((bd) => (
                    <div
                      key={bd.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.6rem 0.875rem",
                        background: "#080808",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 8,
                        gap: 8,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            color: "#F0EDE8",
                            fontSize: "0.875rem",
                            display: "block",
                          }}
                        >
                          {format(parseISO(bd.date), "EEE d MMM yyyy", {
                            locale: es,
                          })}
                        </span>
                        {bd.reason && (
                          <span
                            style={{
                              color: "rgba(240,237,232,0.38)",
                              fontSize: "0.75rem",
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {bd.reason}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => unblockDate(bd.id)}
                        disabled={removeBlockedDate.isPending}
                        title="Desbloquear fecha"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(240,237,232,0.3)",
                          padding: 4,
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(240,237,232,0.7)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(240,237,232,0.3)")
                        }
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
