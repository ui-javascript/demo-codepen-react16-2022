import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import styles from './style.less';

interface AutoScrollProps<P> {
  list: P[];
  renderItem: (item: P) => React.ReactNode;
  length: number;
  scrollInterval: number;
  scrollSpeed: number;
  scrollStep: number;
}

function useVisibleList<P>(
  list: P[],
  length: number,
  scrollStep: number,
): [P[], () => void, number] {
  const [animateTimes, setAnimateTimes] = useState(0);
  const cursorRef = useRef(0);
  const [visibleList, setVisibleList] = useState(
    list.slice(cursorRef.current, cursorRef.current + length),
  );
  function nextVisibleList() {
    cursorRef.current = (cursorRef.current + 1) % list.length;
    let nextList = list.slice(cursorRef.current, cursorRef.current + length);
    if (nextList.length < length) {
      nextList = [...nextList, ...list.slice(0, length - nextList.length)];
    }
    setVisibleList(nextList);
    setAnimateTimes((prevState) => prevState + 1);
  }
  return [visibleList, nextVisibleList, animateTimes];
}

function AutoScroll<P>(props: AutoScrollProps<P>) {
  const {
    list = [],
    renderItem,
    length,
    scrollInterval,
    scrollSpeed,
    scrollStep,
  } = props;
  const [isScroll, setIsScroll] = useState(false);
  const [visibleList, nextVisibleList, animateTimes] = useVisibleList(
    list,
    length,
    scrollSpeed,
  );

  // 间隔性滚动
  useEffect(() => {
    let timer: NodeJS.Timeout;
    // 总数小于可见数量，无需滚动
    if (list.length > length) {
      timer = setInterval(() => {
        setIsScroll(true);
        setTimeout(() => {
          // 趁动画结束间隙替换数据
          nextVisibleList();
          setIsScroll(false);
        }, scrollSpeed);
      }, scrollInterval);
    } else {
      nextVisibleList();
    }
    return () => clearInterval(timer);
  }, [list, length, scrollInterval, scrollSpeed, scrollStep]);

  return (
    <div className={styles.autoScrollContainer}>
      <div className={styles.autoScrollInner}>
        <div
          className={classNames(styles.autoScrollBody, {
            [styles.anim]: isScroll,
          })}
        >
          {visibleList.map((item, idx) => {
            // 色彩条交错
            let startOdd = false;
            if (animateTimes % 2 === 1) {
              startOdd = idx % 2 === 1;
            } else {
              startOdd = idx % 2 === 0;
            }
            return (
              <div
                className={classNames(styles.autoScrollItem, {
                  [styles.odd]: startOdd,
                })}
                key={idx}
              >
                {renderItem(item)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AutoScroll;
