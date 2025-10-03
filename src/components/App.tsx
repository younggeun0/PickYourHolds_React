import React, { useCallback, useState } from 'react';
import Main from './Main';
import PickScreen from './PickScreen';

function App() {
  const [isStarted, setIsStarted] = useState(false);

  const startPickingHolds = useCallback((): void => {
    setIsStarted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isStarted ? <PickScreen /> : <Main onStart={startPickingHolds} />}
    </div>
  );
}

export default App;
