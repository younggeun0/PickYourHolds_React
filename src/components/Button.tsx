import React from "react";
import Grid from "@mui/material/Grid";

function Button({
    imgSrc,
    name,
    onClick,
}: {
    imgSrc: string;
    name: string;
    onClick: () => void;
}) {
    return (
        <Grid item xs={3}>
            <img
                className="btn-imoji"
                src={imgSrc}
                alt={name}
                onClick={onClick}
            />
        </Grid>
    );
}

export default Button;
