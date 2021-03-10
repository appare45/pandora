import { useState, createContext, FC, Component } from 'react';

// Wrapperの状態を管理するContext
type WrapperContextProps = {
  currentDisplayState: Boolean;
  currentDisplayType?: string | null | Component;
  setCurrentDisplayState?: Function;
  setCurrentDisplayType?: Function;
};

const WrapperContext = createContext<WrapperContextProps>({
  currentDisplayState: true,
});

const WrapperProvider: FC = ({ children }) => {
  // 表示非表示の状態管理用state
  const [currentDisplayState, setCurrentDisplayState] = useState<Boolean>(true);
  // 表示されているものの状態間利用state
  const [currentDisplayType, setCurrentDisplayType] = useState<string>();
  return (
    <WrapperContext.Provider
      value={{
        currentDisplayState: currentDisplayState,
        currentDisplayType: currentDisplayType,
        setCurrentDisplayState: setCurrentDisplayState,
        setCurrentDisplayType: setCurrentDisplayType,
      }}
    >
      {currentDisplayState && children}
    </WrapperContext.Provider>
  );
};

export { WrapperContext, WrapperProvider };
