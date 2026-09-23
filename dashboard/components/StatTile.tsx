export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card px-5 py-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-[#898781]">{label}</span>
      <span className="text-3xl font-semibold text-[#0b0b0b] dark:text-white">{value}</span>
      {sub ? <span className="text-xs text-[#52514e] dark:text-[#c3c2b7]">{sub}</span> : null}
    </div>
  );
}
