import { createContext, useContext } from "react";

// context的用法：
// 用 createContext 创建 context 对象，用 Provider 修改其中的值
// function 组件使用 useContext 的 hook 来取值, class 组件使用 Consumer 来取值
const countContext = createContext(111);

function Counter() {
  const count = useContext(countContext);
  return <div>count 的值为：{count}</div>
}

function Aaa() {
  return <div>
    <countContext.Provider value={333}>
      <Counter />
    </countContext.Provider>
  </div>
}

export default Aaa;