import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import { Grid, TableContainer, TextField,  } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'



const useStyles = makeStyles((theme) => ({
    formPaper:{
        backgroundColor:'#D6D6D6',
        minHeight:125,
        marginTop:25,
        margin:5,
    },

    formTable:{
        backgroundColor:'#D6D6D6',
        minHeight:700,
        marginTop:20,
        margin:5,

    }
}))

export default function Receive() {
    const classes = useStyles();
    const [purchaseOrderList, setPurchaseOrderList] = useState([{}])
    const [purchaseReceiptForm, setPurchaseReceiptForm] = useState({posting_datetime:new Date().toISOString(),items:[{}], status:'Draft'})

    useEffect(() => {
        formatDate(purchaseReceiptForm.posting_datetime)
        var url = 'http://127.0.0.1:8000/api/purchaseorder-list/'
        fetch(url)
        .then(response => response.json())
        .then(response => setPurchaseOrderList(response))

        

    },[])


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
        setPurchaseReceiptForm({...purchaseReceiptForm, posting_datetime:year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second})
        }

    const handleDateChange = (e) =>{
        setPurchaseReceiptForm({...purchaseReceiptForm, posting_datetime:e.target.value})
    }


    const getPurchaseOrderItems = (e, value) => {

        try{
            setPurchaseReceiptForm({...purchaseReceiptForm,  supplier:value.supplier, items:value.items})
            console.log(purchaseReceiptForm)
            
        }
        catch{
            setPurchaseReceiptForm({...purchaseReceiptForm ,supplier:'', items:[{}]})
        }

        console.log(purchaseOrderList.items)
        
       
    }


    
    const qtyHandle = (e, item) => {
        setPurchaseReceiptForm({
        ...purchaseReceiptForm,
            items:purchaseReceiptForm.items.map(
            el => el.key === item.key ? {...el, qty:e.target.value}:el
        ),
        })
    }


    
    

    return(
        <div>
            <Paper className={classes.formPaper}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <TextField size='small' onChange={(e) => handleDateChange(e)} value={purchaseReceiptForm.posting_datetime} style={{marginLeft:10}} fullWidth variant='outlined' type='datetime-local'></TextField>
                    </Grid>
                    <Grid item xs={3}>
                    <Autocomplete size='small' onChange ={getPurchaseOrderItems} options={purchaseOrderList} getOptionLabel={(option) => option.purchase_order_number} autoHighlight style={{ width: 300 }} 
                        renderInput={(params) => <TextField {...params} label="Purchase Order" variant="outlined" />}/>
                    </Grid>
                    <Grid item xs={3}>
                    <TextField size='small' variant='outlined' label='Status' value={purchaseReceiptForm.status}></TextField>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <TextField style={{marginLeft:10}} disabled fullWidth size='small' variant='outlined' value={purchaseReceiptForm.supplier}></TextField>
                    </Grid>
                </Grid>
            </Paper>

            <Paper className={classes.formTable}>   
                <Grid container spacing={3}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell width='10%'>Qty</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseReceiptForm.items.map((item,key)=>(
                                    <TableRow hover key={key}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell ><TextField type='number' value={item.qty} variant='standard' onChange={(e) => {qtyHandle(e, item, key)}} size='small'></TextField></TableCell>
                                        <TableCell>{item.cost}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Paper>
        </div>
    )
}