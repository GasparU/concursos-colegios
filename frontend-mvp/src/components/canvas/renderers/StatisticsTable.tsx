// StatisticsTable.tsx
interface TableData {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}

export const StatisticsTable = ({ data }: { data: TableData }) => {
  return (
    <div className="overflow-x-auto my-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <table className="min-w-full text-sm">
        {data.caption && (
          <caption className="text-xs text-slate-500 dark:text-slate-400 py-2 px-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {data.caption}
          </caption>
        )}
        <thead>
          <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30">
            {data.headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`
                border-t border-slate-200 dark:border-slate-700
                ${rowIdx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-700/50"}
                hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors
              `}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-2 border-r border-slate-200 dark:border-slate-700 last:border-r-0 text-slate-700 dark:text-slate-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
