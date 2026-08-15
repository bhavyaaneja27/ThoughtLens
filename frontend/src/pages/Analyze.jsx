import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import PredictionCard from '../components/PredictionCard';
import ReflectionSection from '../components/ReflectionSection';

const STORAGE_KEY_TEXT = 'thoughtLens_text';
const STORAGE_KEY_RESULTS = 'thoughtLens_results';
const STORAGE_KEY_REFLECTIONS = 'thoughtLens_reflections';
const STORAGE_KEY_SAVED = 'thoughtLens_reflection_saved';

function Analyze() {
  const [text, setText] = useState(() => localStorage.getItem(STORAGE_KEY_TEXT) || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [error, setError] = useState(null);
  
  const [reflections, setReflections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REFLECTIONS);
      return saved ? JSON.parse(saved) : { '1': '', '2': '', '3': '' };
    } catch (e) {
      return { '1': '', '2': '', '3': '' };
    }
  });

  const [isReflectionSaved, setIsReflectionSaved] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SAVED) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEXT, text);
  }, [text]);
  
  useEffect(() => {
    if (results) {
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
    } else {
      localStorage.removeItem(STORAGE_KEY_RESULTS);
    }
  }, [results]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REFLECTIONS, JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, isReflectionSaved);
  }, [isReflectionSaved]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    if (results && newText !== results.original_text) {
      setResults(null);
      setReflections({ '1': '', '2': '', '3': '' });
      setIsReflectionSaved(false);
    }
  };

  const handleReflectionChange = (id, value) => {
    setReflections(prev => ({ ...prev, [id]: value }));
    setIsReflectionSaved(false); // If they edit after saving, they can save again
  };

  const handleReset = () => {
    setText('');
    setResults(null);
    setReflections({ '1': '', '2': '', '3': '' });
    setIsReflectionSaved(false);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    setIsReflectionSaved(false);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Unable to analyze your thought right now. Please try again.');
      }
      
      const data = await response.json();
      if (!data || !data.predictions) {
        throw new Error('Invalid response from server.');
      }
      
      setResults(data);
    } catch (err) {
      setError('Unable to analyze your thought right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="disclaimer">
        <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <p>
          <strong>Disclaimer:</strong> ThoughtLens is an educational self-reflection tool and is not a medical diagnosis. 
          If you are in distress, please reach out to a mental health professional.
        </p>
      </div>

      <div className="textarea-container">
        <textarea
          className="thought-textarea"
          placeholder="What's on your mind? e.g., 'I failed one exam, so I am going to fail this entire semester.'"
          value={text}
          onChange={handleTextChange}
          disabled={loading}
        />
        <div className="char-count">{text.length} characters</div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleAnalyze} 
          disabled={loading || text.length === 0}
        >
          {loading ? <><Loader2 size={20} className="animate-spin" /> Analyzing...</> : 'Analyze Thought'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {results && results.predictions && (
        <div className="results-container animate-fade-in">
          <h2>Possible Thinking Patterns</h2>
          <div className="card">
            {results.predictions.map((pred, idx) => (
              <PredictionCard key={idx} rank={idx + 1} prediction={pred} />
            ))}
          </div>

          <ReflectionSection 
            answers={reflections} 
            onChange={handleReflectionChange} 
            onSave={() => setIsReflectionSaved(true)}
            isSaved={isReflectionSaved}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}

export default Analyze;
