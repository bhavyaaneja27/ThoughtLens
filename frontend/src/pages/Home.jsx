import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="hero">
      <h1>Understand your thoughts. <br />Recognize patterns. <br />Reflect with clarity.</h1>
      <p>
        ThoughtLens helps you identify common cognitive distortions in your everyday thinking. 
        Take a moment to reflect and reframe your thoughts.
      </p>
      <Link to="/analyze" className="btn btn-primary">
        Analyze a Thought <ArrowRight size={20} />
      </Link>
    </div>
  );
}

export default Home;
