export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '—';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
};
