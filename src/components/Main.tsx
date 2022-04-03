import React from "react";
import Grid from "@mui/material/Grid";
import GitHubIcon from "@mui/icons-material/GitHub";

function Main({
    onStart,
}: {
    onStart: React.MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <Grid container justifyContent="center" rowSpacing={2}>
            <Grid item xs={12} className="heading">
                <span style={{ color: "#409EEF" }}>PICK</span>
                <span style={{ color: "#98C379" }}>YOUR</span>
                <span style={{ color: "#C85358" }}>HOLDS</span>
            </Grid>
            <Grid item xs={12}>
                <img
                    className="climber"
                    src="img/climber1.png"
                    alt="climber1"
                />
                <img
                    className="climber"
                    src="img/climber2.png"
                    alt="climber2"
                />
            </Grid>
            <Grid item xs={12}>
                <button className="btn-start" onClick={onStart}>
                    START
                </button>
            </Grid>
            <Grid
                item
                xs={12}
                onClick={() => {
                    location.href = "https://github.com/younggeun0";
                }}
            >
                <GitHubIcon className="signiture" />
                <span className="signiture">by younggeun0</span>
            </Grid>
        </Grid>
    );
}

export default Main;
