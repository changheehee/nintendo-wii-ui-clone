import { useId } from 'react';
import catCardUrl from './catCard.png';
import './catChannel.css';

const CARD_VIEW_BOX = '0 0 244 135';
const TITLE_ARC_PATH = 'M28 76 Q122 18 216 76';

export function CatCard() {
  const titleArcId = useId();

  return (
    <div className="cat-channel-backdrop cat-card">
      <svg className="cat-card-title" viewBox={CARD_VIEW_BOX} aria-hidden="true">
        <path id={titleArcId} d={TITLE_ARC_PATH} fill="none" />
        <text className="cat-card-title-text">
          <textPath href={`#${titleArcId}`} startOffset="50%" textAnchor="middle">
            OIIA CAT
          </textPath>
        </text>
      </svg>
      <span className="cat-card-shadow" />
      <img className="cat-card-image" src={catCardUrl} alt="" />
    </div>
  );
}
