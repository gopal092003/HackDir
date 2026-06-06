export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 32,
      }}
    >
      {/* Header skeleton */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: 24,
            width: 200,
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 36,
            width: 120,
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Table skeleton */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {["Title", "Status", "Prize", "Dates", "Tags"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j}>
                    <div
                      style={{
                        height: 14,
                        width: j === 0 ? "80%" : j === 3 ? "90%" : "60%",
                        background: "var(--bg-elevated)",
                        borderRadius: 4,
                        animation: `pulse 1.5s ease-in-out ${i * 0.05}s infinite`,
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
