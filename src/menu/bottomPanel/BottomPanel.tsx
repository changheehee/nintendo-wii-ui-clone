import { BRAND_NAME } from '../../brandName.ts';
import bottomPanelUrl from './assets/bottomPanel@2x.png';
import mailIconUrl from './assets/mailIcon@2x.png';
import sdCardUrl from './assets/sdCard@2x.png';
import './bottomPanel.css';
import { MenuClock } from './MenuClock.tsx';
import { RoundButton } from '../controls/RoundButton.tsx';

const UNREAD_MESSAGE_COUNT = 1;

export function BottomPanel() {
  return (
    <footer className="bottom-panel">
      <img className="bottom-panel-shape" src={bottomPanelUrl} alt="" />
      <MenuClock />

      <RoundButton className="bottom-panel-menu-button" label={`${BRAND_NAME} 메뉴`}>
        <span className="bottom-panel-menu-label">{BRAND_NAME}</span>
      </RoundButton>
      <img className="bottom-panel-sd" src={sdCardUrl} alt="SD 카드" />
      <RoundButton className="bottom-panel-mail-button" label={`메시지 ${UNREAD_MESSAGE_COUNT}개`}>
        <img className="bottom-panel-mail-icon" src={mailIconUrl} alt="" />
        <span className="bottom-panel-mail-count">{UNREAD_MESSAGE_COUNT}</span>
      </RoundButton>
    </footer>
  );
}
