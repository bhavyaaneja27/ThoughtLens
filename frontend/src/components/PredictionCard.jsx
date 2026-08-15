import { DISTORTIONS } from '../utils/distortions';

function PredictionCard({ rank, prediction }) {
  const explanation = DISTORTIONS[prediction.distortion] || "Possible cognitive distortion identified by the model.";
  
  return (
    <div className={`prediction-item ${rank === 1 ? 'rank-1' : ''}`}>
      <div className="prediction-header">
        <span className={`rank-badge ${rank > 1 ? 'rank-other' : ''}`}>#{rank}</span>
        <span className="distortion-name">{prediction.distortion}</span>
      </div>
      <p className="prediction-explanation">{explanation}</p>
    </div>
  );
}

export default PredictionCard;
