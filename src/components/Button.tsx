import React from "react";
import Grid from '@mui/material/Grid';

function Button(props: { imgSrc: string; name: string; onClick: () => void; }) {
    return (
        <Grid item xs={3}>
            <img 
                className="btn-imoji"
                src={props.imgSrc} 
                alt={props.name}
                onClick={() => {
                    props.onClick();
                }}
            />
        </Grid>
    );
}

export default Button;