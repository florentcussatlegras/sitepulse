// assets\utils\scoreMeta.ts

export function scoreMeta(score: number) {
  if (score >= 90) {
    return {
      label: 'Excellent',
      text: 'text-green-600',
      bg: 'bg-green-100',
      color: 'green' as const,
    };
  }

  if (score >= 75) {
    return {
      label: 'Bon',
      text: 'text-indigo-600',
      bg: 'bg-indigo-100',
      color: 'indigo' as const,
    };
  }

  if (score >= 50) {
    return {
      label: 'Moyen',
      text: 'text-yellow-600',
      bg: 'bg-yellow-100',
      color: 'yellow' as const,
    };
  }

  return {
    label: 'Faible',
    text: 'text-red-600',
    bg: 'bg-red-100',
    color: 'red' as const,
  };
}
