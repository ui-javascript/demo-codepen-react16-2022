import ReactDOM from "react-dom"
import React, { useState, useRef } from 'react';
import HammerPic from './images/hammer.png';
import FullEgg from './images/full_egg.png';
import BrokenEgg from './images/broken_egg.png';

import classNames from 'classnames';
import AutoScroll from './components/AutoScroll';
import { users, phones, prizes } from './users';
import { message } from 'antd';
import _ from 'lodash';
import styles from './style.less';

const initMsgs = new Array(10).fill(null).map(() => msgFactory());
const Hammer: React.FC<{ x: number; y: number; active: boolean }> = ({
  x,
  y,
  active,
}) => {
  return (
    <img
      className={classNames(styles.hammer, {
        [styles.hammerAnim]: active,
      })}
      src={HammerPic}
      alt="hammer"
      style={{ left: x - 13, top: y - 56 }}
    />
  );
};

interface GoldenEggProps {
  width: string | number;
  x: string | number;
  y: string | number;
  onClick: () => void;
}

enum EggState {
  full,
  broken,
}

const GoldenEgg: React.FC<GoldenEggProps> = (props) => {
  const [eggState, setEggState] = useState(EggState.full);
  const { width, x, y, onClick } = props;
  function handleClick(e: React.MouseEvent) {
    onClick();
    setTimeout(() => setEggState(EggState.broken), 1000);
  }
  return (
    <div className={styles.goldenEgg} style={{ width, left: x, top: y }}>
      {eggState === EggState.full && (
        <img
          className={styles.fullEgg}
          src={FullEgg}
          alt="full_egg"
          style={{ width: '100%' }}
        />
      )}
      {eggState === EggState.broken && (
        <img className={styles.brokenEgg} src={BrokenEgg} alt="broken_egg" />
      )}
      {eggState === EggState.full && (
        <div className={styles.hotZone} onClick={handleClick} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const [smashing, setSmashing] = useState(false);
  const [msgs, setMsgs] = useState<string[]>(initMsgs);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleSmash = () => {
    setSmashing(true);
    setTimeout(() => {
      setSmashing(false);
      const msg = msgFactory();
      message.success(msg);
      setMsgs((prevState) => [...prevState, msg]);
    }, 1000);
  };
  function handleMouseMove(e: React.MouseEvent) {
    const rect = boardRef.current!.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }
  function handleMouseLeave(e: React.MouseEvent) {
    setMouse({
      x: -100,
      y: -100,
    });
  }
  return (
    <div className={styles.container}>
      <div className={styles.playGround}>
        <div
          ref={boardRef}
          className={styles.playGroundInner}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: 860, height: 370 }}
        >
          {eggPositions.map((egg, idx) => {
            return (
              <GoldenEgg
                key={idx}
                onClick={handleSmash}
                width={180}
                x={egg.x}
                y={egg.y}
              />
            );
          })}
          <Hammer x={mouse.x} y={mouse.y} active={smashing} />
        </div>
      </div>
      <AutoScroll<string>
        list={msgs}
        length={9}
        scrollInterval={3000}
        scrollSpeed={1000}
        scrollStep={1}
        renderItem={(item) => <span>{item}</span>}
      ></AutoScroll>
    </div>
  );
};

// export default App;

const eggPositions = [
  { x: '13%', y: '24%' },
  { x: '33%', y: '24%' },
  { x: '53%', y: '24%' },
  { x: '73%', y: '24%' },
  { x: '5%', y: '41%' },
  { x: '25%', y: '41%' },
  { x: '45%', y: '41%' },
  { x: '65%', y: '41%' },
];

function msgFactory() {
  const user = users[_.random(4)];
  const phone = phones[_.random(4)];
  const prize = prizes[_.random(4)];
  return `${user}（${phone}）砸中${prize}`;
}


ReactDOM.render(<App />, mountNode);