import React, { useCallback, useState } from "react";
import Main from "./Main";
import PickScreen from "./PickScreen";
import Grid from "@mui/material/Grid";

function App() {
    const [isStarted, setIsStarted] = useState(false);

    const startPickingHolds = useCallback((): void => {
        setIsStarted(true);
    }, []);

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
        >
            {isStarted ? <PickScreen /> : <Main onStart={startPickingHolds} />}
        </Grid>
    );
}

export default App;
