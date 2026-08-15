import { Check, RotateCcw } from 'lucide-react';

function ReflectionSection({ answers, onChange, onSave, isSaved, onReset }) {
  return (
    <div className="reflection-section">
      <h2>Guided Reflection</h2>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Take a moment to challenge the patterns identified above.
      </p>

      <div className="reflection-question">
        <p>1. What evidence supports this thought?</p>
        <textarea 
          className="reflection-input" 
          placeholder="e.g., I did fail one exam..."
          value={answers['1'] || ''}
          onChange={(e) => onChange('1', e.target.value)}
        />
      </div>

      <div className="reflection-question">
        <p>2. What evidence might challenge it?</p>
        <textarea 
          className="reflection-input" 
          placeholder="e.g., I have passed other assignments. One exam does not equal the whole semester..."
          value={answers['2'] || ''}
          onChange={(e) => onChange('2', e.target.value)}
        />
      </div>

      <div className="reflection-question">
        <p>3. Is there another way to look at this?</p>
        <textarea 
          className="reflection-input" 
          placeholder="e.g., I need to study differently for the next one..."
          value={answers['3'] || ''}
          onChange={(e) => onChange('3', e.target.value)}
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        {!isSaved ? (
          <button className="btn btn-primary" onClick={onSave}>Save Reflection</button>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: '600', marginBottom: '1rem' }}>
              <Check size={20} />
              <span>Reflection saved ✓</span>
            </div>
            <div className="card" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', marginBottom: '2rem', boxShadow: 'none' }}>
              <p style={{ color: '#166534', margin: 0, fontWeight: '500' }}>
                Reflection complete. You took a moment to examine your thought from different perspectives.
              </p>
            </div>
          </div>
        )}
      </div>

      {isSaved && (
        <button 
          className="btn" 
          onClick={onReset} 
          style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', marginTop: '1rem' }}
        >
          <RotateCcw size={18} /> Analyze another thought
        </button>
      )}
    </div>
  );
}

export default ReflectionSection;
