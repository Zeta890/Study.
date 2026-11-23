// Cliente do tutor de IA. A chave da OpenAI fica no Supabase (segredo da função),
// nunca no navegador. Aqui só usamos a URL e a chave pública do projeto.
export type TutorMode = 'explicar' | 'exercicio' | 'revisar' | 'corrigir' | 'simular';

export const TUTOR_MODES: { id: TutorMode; label: string; hint: string }[] = [
  { id: 'explicar', label: 'Explicar', hint: 'Explica um assunto com linguagem simples.' },
  { id: 'exercicio', label: 'Gerar questão', hint: 'Cria uma questão de treino com gabarito comentado.' },
  { id: 'revisar', label: 'Resumo', hint: 'Resume o tema em tópicos para revisão.' },
  { id: 'corrigir', label: 'Corrigir texto', hint: 'Aponta erros de um texto seu, sem reescrevê-lo.' },
  { id: 'simular', label: 'Simular oral', hint: 'Faz perguntas de prova oral, uma por vez.' },
];

const BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const PUB = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const tutorConfigured = Boolean(BASE && PUB);

export async function askTutor(mode: TutorMode, input: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!tutorConfigured) return { ok: false, error: 'Tutor não configurado: falta VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY.' };
  try {
    const res = await fetch(`${BASE}/functions/v1/tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PUB}`, apikey: PUB! },
      body: JSON.stringify({ mode, input }),
    });
    const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? `Erro ${res.status} ao consultar o tutor.` };
    return { ok: true, text: data.text ?? '' };
  } catch {
    return { ok: false, error: 'Não foi possível falar com o tutor. Verifique sua conexão e tente de novo.' };
  }
}
