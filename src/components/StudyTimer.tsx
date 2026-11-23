import { useEffect, useState } from 'react';
import { Pause, Play, Square } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Activity } from '../lib/types';
import { Button } from './ui';

// Cronômetro de estudo real. Usa timestamps: o tempo acumulado fica no store, então a contagem
// continua correta após recarregar a página ou trocar de aba.
export function StudyTimer({ activity, done }: { activity: Activity; done: boolean }) {
  const { me, dispatch } = useStore();
  const [now, setNow] = useState(() => Date.now());
  const t = me?.timer ?? null;
  const mine = t?.activityId === activity.id;
  const running = mine && t?.startedAt !== null;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!me || done) return null;

  const elapsedMs = mine && t ? t.accumulatedMs + (t.startedAt !== null ? now - t.startedAt : 0) : 0;
  const mm = String(Math.floor(elapsedMs / 60000)).padStart(2, '0');
  const ss = String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, '0');
  const blocked = !!t && !mine;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      {mine && (
        <span className="num min-w-[4.5rem] text-sm font-medium" aria-live="off" aria-label="Tempo cronometrado">
          {mm}:{ss}
        </span>
      )}
      {!mine && (
        <Button
          variant="ghost"
          disabled={blocked}
          title={blocked ? 'Finalize o cronômetro em andamento antes de começar outro' : undefined}
          onClick={() => dispatch({ type: 'timer-start', activityId: activity.id, now: Date.now() })}
        >
          <Play size={14} aria-hidden /> Cronometrar
        </Button>
      )}
      {mine && running && (
        <Button variant="ghost" onClick={() => dispatch({ type: 'timer-pause', now: Date.now() })}>
          <Pause size={14} aria-hidden /> Pausar
        </Button>
      )}
      {mine && !running && (
        <Button variant="ghost" onClick={() => dispatch({ type: 'timer-start', activityId: activity.id, now: Date.now() })}>
          <Play size={14} aria-hidden /> Retomar
        </Button>
      )}
      {mine && (
        <Button
          variant="primary"
          onClick={() => dispatch({ type: 'timer-finish', now: Date.now() })}
        >
          <Square size={13} aria-hidden /> Finalizar e registrar
        </Button>
      )}
      {!mine && (
        <Button
          variant="subtle"
          disabled={blocked}
          onClick={() => dispatch({ type: 'complete-activity', activityId: activity.id, minutes: 0, subjectId: activity.subjectId, date: activity.date })}
          title="Marca a tarefa como feita sem registrar tempo de estudo"
        >
          Concluir sem tempo
        </Button>
      )}
    </div>
  );
}
