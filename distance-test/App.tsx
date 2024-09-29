import { useRef, useEffect, MouseEventHandler } from "react";

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const top = document.getElementById('box')?.getBoundingClientRect().top;
    console.log('box pageY', e.pageY);
    console.log('box clientY', e.clientY);
    // 坑：react 事件是合成事件，所以它少了一些原生事件的属性，比如这个offsetY
    // console.log('box offsetY', e.offsetY);
    console.log('box offsetY', e.pageY - top - window.scrollY); // 窗口滚动距离： window.pageYOffset(过时) 即 window.scrollY
    // 元素滚动距离用element.scrollTop
    console.log('box screenY', e.screenY);
  }

  useEffect(() => {
    document.getElementById('box')!.addEventListener('click', (e) => {
      console.log('box2 pageY', e.pageY);
      console.log('box2 clientY', e.clientY)
      console.log('box2 offsetY', e.offsetY);
      console.log('box2 screenY', e.screenY);
    });
  }, []);

  return (
    <div>
      <div id="box" ref={ref} style={{
        marginTop: '800px',
        width: '100px',
        height: '100px',
        background: 'blue'
      }} onClick={clickHandler}></div>
    </div>
  )
}

export default App
