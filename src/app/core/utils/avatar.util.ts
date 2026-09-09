const CORES_AVATAR = [
  '#2E7BC9', '#7C3AED', '#DB2777', '#059669',
  '#D97706', '#DC2626', '#0891B2', '#65A30D',
];

export function iniciaisDe(nome: string): string {
  if (!nome) return '?';

  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';

  return (primeira + ultima).toUpperCase();
}

export function corAvatarDe(nome: string): string {
  if (!nome) return CORES_AVATAR[0];

  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }

  const indice = Math.abs(hash) % CORES_AVATAR.length;
  return CORES_AVATAR[indice];
}