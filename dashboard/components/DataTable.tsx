export function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, string | number>[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[rgba(11,11,11,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2 px-3 text-xs uppercase tracking-wide text-[#898781] font-medium ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[rgba(11,11,11,0.05)] dark:border-[rgba(255,255,255,0.05)] last:border-0"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2 px-3 tabular-nums ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
