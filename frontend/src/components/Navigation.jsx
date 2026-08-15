import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Sparkles size={24} />
        <span>ThoughtLens</span>
      </div>
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink 
          to="/analyze" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Analyze
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          About
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;
