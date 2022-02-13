import React from "react";
import Grid from '@mui/material/Grid';

function Button(props) {
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