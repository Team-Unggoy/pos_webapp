import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import { Grid, TextField,  } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';



const useStyles = makeStyles((theme) => ({
    formPaper:{
        backgroundColor:'#D6D6D6',
        minHeight:125,
        marginLeft:5,
        margin:20,
    },
}))

export default function Receive() {
    const classes = useStyles();
    const [date, setDate] = useState(new Date().toISOString())
    const [purchaseOrderList, setPurchaseOrderList] = useState({})

    useEffect(() => {
        var url = 'http://127.0.0.1:8000/api/purchaseorder-list/'
        fetch(url)
        .then(response => response.json())
        .then(response => setPurchaseOrderList(response))

        formatDate(date)
    },[])

    console.log(purchaseOrderList)

    const formatDate = (date) =>{
        var formatDate = new Date(date)
        var year = formatDate.getFullYear();
        var month = (1 + formatDate.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = formatDate.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = (formatDate.getHours()).toString();
        hour = hour.length > 1? hour :  '0' + hour;
        var minute = formatDate.getMinutes().toString()
        minute = minute.length > 1 ?  minute: '0' + minute;
        var second = formatDate.getSeconds().toString();
        second = second.length > 1 ?  second: '0' + second;
        setDate(year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second)
        }

    const handleDateChange = (e) =>{
        setDate(e.target.value)
    }


    return(
        <div>
            <Paper className={classes.formPaper}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <TextField size='small' onChange={(e) => handleDateChange(e)} value={date} style={{marginLeft:10}} fullWidth variant='outlined' type='datetime-local'></TextField>
                    </Grid>
                    <Grid item xs={3}>
                    <Autocomplete
                    size='small '
                    id="combo-box-demo"
                    options={purchaseOrderList}
                    getOptionLabel={(option) => option.order_number.toString()}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                    />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}