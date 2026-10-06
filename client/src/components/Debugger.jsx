export default function Debugger({
  breakpoints,
  variables,
  callStack,
  currentLine,
  onStep,
  onContinue,
  onToggleBreakpoint,
}) {
  return (
    <div style={{ height: '100%', backgroundColor: '#111', color: '#ddd', padding: '16px', overflow: 'auto', fontSize: '13px', fontFamily: 'monospace' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#60a5fa' }}>Debugger</h3>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={onContinue}
          style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Continue
        </button>
        <button
          onClick={onStep}
          style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Step Over
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontWeight: '600', color: '#facc15', marginBottom: '4px' }}>
          Current Line: {currentLine ?? '-'}
        </h4>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Breakpoints</h4>
        {breakpoints.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No breakpoints</p>
        ) : (
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            {breakpoints.map((bp) => (
              <li
                key={bp}
                style={{ cursor: 'pointer' }}
                onClick={() => onToggleBreakpoint(bp)}
              >
                Line {bp}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Variables</h4>
        <pre style={{ backgroundColor: '#1f1f1f', padding: '8px', borderRadius: '4px', overflowX: 'auto', fontSize: '12px' }}>
          {Object.keys(variables).length === 0
            ? 'No variables'
            : JSON.stringify(variables, null, 2)}
        </pre>
      </div>

      <div>
        <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Call Stack</h4>
        {callStack.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Empty</p>
        ) : (
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            {callStack.map((frame, i) => (
              <li key={i}>{frame}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}