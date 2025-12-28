import { stateDimensions } from "@/intelligence/stateModel";

export function StateTracker() {
  return (
    <div>
      <h3>Your State</h3>
      {stateDimensions.map((dim) => (
        <div key={dim.id} style={{ marginBottom: 12 }}>
          <strong>{dim.label}</strong>
          <p style={{ fontSize: "0.85rem" }}>{dim.description}</p>
          <div>
            {dim.options.map((opt) => (
              <button key={opt} style={{ marginRight: 8 }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}