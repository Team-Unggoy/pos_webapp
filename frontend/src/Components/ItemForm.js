import React from 'react';

import {Grid, TextField} from '@material-ui/core'

function ItemForm(props) {
    return (
        <div>
            <Grid container spacing={2}> 
                        <Grid item xs={12}>
                        <TextField id='name' fullWidth variant='outlined' label='Name'></TextField>
                        </Grid>
                        <Grid item xs={8}>
                        <TextField id='barcode_number' fullWidth variant='outlined' label='Barcode'></TextField>
                        </Grid>
                        <Grid container item spacing={1}>
                        <Grid item xs={4}>
                        <TextField fullWidth id='cost' type='number' variant='outlined' label='Buying'></TextField>
                        </Grid>
                        <Grid item xs={4}>
                        <TextField fullWidth id='srp' type='number' variant='outlined' label='Selling'></TextField>
                        </Grid>
                        </Grid>
            </Grid>
        </div>
    );
}

export default ItemForm;