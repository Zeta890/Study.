import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { EXAM } from '../lib/content';
import { formatDate, todayISO } from '../lib/dates';
import { availabilityFor } from '../lib/plan';
import { Button, Card, Empty, Field, Pill, SectionTitle, inputClass } from '../components/ui';
import { PageHeader } from '../components/Layout';

export default function Settings() {
  const { me, state, dispatch } = useStore();
  const [defaultMin, setDefaultMin] = useState<number | null>(null);
  const [date, setDate] = useState(EXAM.prepStart);
  const [dayMin, setDayMin] = useState(120);
  if (!me) return null;

  const current = defaultMin ?? me.availability.defaultMinutes;
  const overrides = Object.entries(me.availability.overrides).sort(([a], [b]) => a.localeCompare(b));

  const saveDefault = () => {
    if (defaultMin === null) return;
    dispatch({ type: 'set-availability', minutes: defaultMin });
    setDefaultMin(null);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missao-11-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ajustes" description="Disponibilidade de estudo, perfil e backup dos dados." />

      <Card as="section" className="flex flex-col gap-5 p-6">
        <SectionTitle
          title="Disponibilidade"
          hint="Horas líquidas por dia. Ao mudar, o cronograma de hoje em diante é recalculado."
        />
        <div className="grid gap-4 md:grid-cols-[220px_auto] md:items-end">
          <Field label="Padrão diário (minutos líquidos)" hint={`Hoje: ${formatDate(todayISO())} · ${availabilityFor(me, todayISO())} min`}>
            <input
              type="number"
              min={0}
              max={600}
              step={5}
              className={inputClass}
              value={current}
              onChange={(e) => setDefaultMin(Number(e.target.value))}
            />
          </Field>
          <Button variant="primary" disabled={defaultMin === null || defaultMin === me.availability.defaultMinutes} onClick={saveDefault}>
            Salvar padrão
          </Button>
        </div>

        <div className="border-t border-line pt-5">
          <p className="mb-3 text-sm font-medium">Ajustes para dias específicos</p>
          <div className="grid gap-4 md:grid-cols-[200px_160px_auto] md:items-end">
            <Field label="Data">
              <input type="date" className={inputClass} value={date} min={EXAM.prepStart} max={EXAM.prepEnd} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Minutos líquidos">
              <input type="number" min={0} max={600} step={5} className={inputClass} value={dayMin} onChange={(e) => setDayMin(Number(e.target.value))} />
            </Field>
            <Button variant="ghost" disabled={!date} onClick={() => dispatch({ type: 'set-availability', date, minutes: dayMin })}>
              Aplicar ao dia
            </Button>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {overrides.length === 0 && <li className="text-sm text-muted">Nenhum dia com ajuste.</li>}
            {overrides.map(([d, min]) => (
              <li key={d} className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-2.5 text-sm">
                <span className="num">{formatDate(d)}</span>
                <span className="flex items-center gap-3">
                  <Pill tone={min === 0 ? 'amber' : 'purple'}>{min === 0 ? 'Sem estudo' : `${min} min`}</Pill>
                  <button
                    onClick={() => dispatch({ type: 'remove-override', date: d })}
                    className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-text"
                    aria-label={`Remover ajuste de ${formatDate(d)}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card as="section" className="flex flex-col gap-4 p-6">
        <SectionTitle title="Perfil e diagnóstico" />
        <div className="text-sm">
          <p className="font-medium">{me.displayName}</p>
          <p className="text-muted">{me.startNote}</p>
          <p className="mt-2">Diagnóstico: {me.diagnosticDone ? 'concluído' : 'pendente'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/estudo?aba=diagnostico" className="inline-flex items-center justify-center rounded-xl border border-line px-3.5 py-2 text-sm font-medium hover:bg-surface-2">Ir ao diagnóstico</Link>
          <Button variant="danger" onClick={() => {
            if (window.confirm(`Apagar todos os dados de ${me.displayName}? Essa ação não pode ser desfeita. Faça um backup antes.`)) {
              dispatch({ type: 'reset-person' });
            }
          }}>
            Apagar meus dados
          </Button>
        </div>
      </Card>

      <Card as="section" className="flex flex-col gap-4 p-6">
        <SectionTitle title="Backup" hint="Os dados ficam neste navegador. Baixe um arquivo de vez em quando." />
        {Object.keys(state.people).length === 0 ? (
          <Empty title="Nada para exportar" text="Os dados aparecem aqui depois do primeiro uso." />
        ) : (
          <div><Button variant="ghost" onClick={exportData}><Download size={15} aria-hidden /> Baixar backup (JSON)</Button></div>
        )}
      </Card>
    </div>
  );
}
