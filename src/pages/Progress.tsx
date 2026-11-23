import { useMemo } from 'react';
import { Bar as RBar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '../lib/store';
import { AREAS, EXAM, SUBJECTS } from '../lib/content';
import { dateRange, formatDate, todayISO } from '../lib/dates';
import { plannedMinutesUntil, availabilityFor } from '../lib/plan';
import { byArea, bySubject, estimatedScore, masteredSubjects, needsReview, studiedMinutes } from '../lib/stats';
import { Card, Pill, SectionTitle } from '../components/ui';
import { PageHeader } from '../components/Layout';

// Cores em hexadecimal: o Recharts aplica estes valores como atributos SVG.
const C = { purple: '#845EFF', lilac: '#AD91FF', blue: '#4F8CFF', mint: '#36D6A0', amber: '#F5C96A', grid: '#94A3B8', text: '#94A3B8' };

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  fontSize: 12,
  color: 'var(--text)',
};

export default function Progress() {
  const { me } = useStore();
  const today = todayISO();

  const daily = useMemo(() => {
    if (!me) return [];
    return dateRange(EXAM.prepStart, EXAM.prepEnd).map((d) => ({
      dia: formatDate(d).slice(0, 5),
      planejado: Math.round((me.plan.filter((a) => a.date === d).reduce((s, a) => s + a.minutes, 0) / 60) * 10) / 10,
      realizado: Math.round((me.studyLog.filter((l) => l.date === d).reduce((s, l) => s + l.minutes, 0) / 60) * 10) / 10,
      disponivel: availabilityFor(me, d) / 60,
    }));
  }, [me]);

  if (!me) return null;

  const areas = byArea(me.answers);
  const areaData = (Object.keys(AREAS) as (keyof typeof AREAS)[]).map((id) => ({
    area: AREAS[id].label.replace('Conhecimentos ', ''),
    aproveitamento: areas[id].pct,
    questoes: areas[id].total,
  }));
  const subj = bySubject(me.answers);
  const subjectData = SUBJECTS.map((s) => ({ disciplina: s.name.split(' ').slice(0, 2).join(' '), aproveitamento: subj[s.id]?.pct ?? 0, total: subj[s.id]?.total ?? 0 })).filter((d) => d.total > 0);
  const simData = me.simulados.map((s) => ({ data: formatDate(s.date).slice(0, 5), nota: s.estimatedScore, acerto: Math.round((s.correct / s.total) * 100) }));
  const score = estimatedScore(me.answers);
  const doneTopics = Object.values(me.topicStatus).filter((s) => s === 'done').length;
  const totalTopics = SUBJECTS.reduce((s, x) => s + x.topics.length, 0);
  const plannedSoFar = plannedMinutesUntil(me, today);
  const doneSoFar = studiedMinutes(me, today);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Progresso" description="Evolução por dia, por área e por disciplina, com base nos seus registros." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Horas realizadas" value={`${Math.round(doneSoFar / 6) / 10} h`} hint={`de ${Math.round(plannedSoFar / 6) / 10} h planejadas até hoje`} />
        <Kpi label="Assuntos concluídos" value={`${doneTopics} de ${totalTopics}`} />
        <Kpi label="Nota estimada" value={`${score.score}/100`} hint={`${score.coverage}% das áreas com questões`} />
        <Kpi label="Simulados feitos" value={String(me.simulados.length)} />
      </div>

      <Card as="section" className="p-6">
        <SectionTitle title="Horas por dia" hint="Planejado contra realizado, em horas líquidas" />
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={daily} barGap={2}>
              <CartesianGrid stroke={C.grid} strokeOpacity={0.15} vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: C.text, fontSize: 11 }} interval={2} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: C.grid, fillOpacity: 0.08 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: C.text }} />
              <RBar dataKey="planejado" name="Planejado" fill={C.lilac} fillOpacity={0.35} radius={[4, 4, 0, 0]} isAnimationActive />
              <RBar dataKey="realizado" name="Realizado" fill={C.mint} radius={[4, 4, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="section" className="p-6">
          <SectionTitle title="Aproveitamento por área" hint="Acertos sobre o total respondido em cada área" />
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={areaData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke={C.grid} strokeOpacity={0.15} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="area" width={110} tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <RBar dataKey="aproveitamento" name="Aproveitamento" fill={C.purple} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card as="section" className="p-6">
          <SectionTitle title="Evolução nos simulados" hint="Nota estimada por simulado" />
          {simData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">Faça um simulado para ver a evolução.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={simData}>
                  <CartesianGrid stroke={C.grid} strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="data" tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="nota" name="Nota estimada" stroke={C.amber} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="acerto" name="Acerto (%)" stroke={C.blue} strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  <Legend wrapperStyle={{ fontSize: 12, color: C.text }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card as="section" className="p-6">
        <SectionTitle title="Por disciplina" hint="Só aparecem disciplinas com questões respondidas" />
        {subjectData.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Nenhuma questão respondida ainda.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={subjectData}>
                <CartesianGrid stroke={C.grid} strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="disciplina" tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <RBar dataKey="aproveitamento" name="Acerto" fill={C.blue} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {masteredSubjects(me).map((s) => <Pill key={s} tone="mint">Dominado: {subjectNameShort(s)}</Pill>)}
          {needsReview(me, today).map((s) => <Pill key={s} tone="amber">Revisar: {subjectNameShort(s)}</Pill>)}
        </div>
      </Card>
    </div>
  );
}

function subjectNameShort(id: string) {
  return SUBJECTS.find((s) => s.id === id)?.name ?? id;
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="num mt-1 text-xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}
