import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import { TableContainer, TextField,  } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
      },
      appBar: {
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        })
      },
      appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: drawerWidth
      },
      title: {
        flexGrow: 1
      },
      hide: {
        display: "none"
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0
      },
      drawerPaper: {
        width: drawerWidth
      },
      drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-start"
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        marginRight: -drawerWidth
      },
      contentShift: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: 0
      },

    drawerPaperForm:{

        minHeight:500,
    },

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
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const [purchaseReceiptForm, setPurchaseReceiptForm] = useState({posting_datetime:new Date().toISOString(),items:[], supplier:'', status:'', invoice_amount:'', purchase_order_number:''})
        useEffect(() => {
        formatDate(purchaseReceiptForm.posting_datetime)
        var url = 'http://127.0.0.1:8000/api/purchaseorder-list-submitted/'
        fetch(url)
        .then(response => response.json())
        .then(response => setPurchaseOrderList(response))

        

    },[])

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }



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
            setPurchaseReceiptForm({...purchaseReceiptForm,  purchase_order_number:value.purchase_order_number , supplier:value.supplier, status:'Draft', items:value.items})
            
        }
        catch{
            setPurchaseReceiptForm({...purchaseReceiptForm ,purchase_order_number:'' ,supplier:'', status:'', items:[], invoice_amount:''})
        }


       
    }


    
    const qtyHandle = (e, item) => {
        setPurchaseReceiptForm({
        ...purchaseReceiptForm,
            items:purchaseReceiptForm.items.map(
            el => el.id === item.id ? {...el, qty:parseInt(e.target.value)}:el
        ),
        })
    }

    const costHandle = (e, item) => {
        setPurchaseReceiptForm({
            ...purchaseReceiptForm,
            items:purchaseReceiptForm.items.map(
                el => el.id === item.id ? {...el, cost:e.target.value}: el
            )
        })
    }

    const invoice_amountHandle = (e) => {
        setPurchaseReceiptForm({...purchaseReceiptForm, invoice_amount:e.target.value})
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        var csrftoken = getCookie('csrftoken')
        var url = 'http://127.0.0.1:8000/api/purchasereceipt-create/'
        console.log(purchaseReceiptForm)
        fetch(url,{
            method:'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            'body' :JSON.stringify(purchaseReceiptForm)
        })

    }

    const itemList = {...purchaseReceiptForm}
    const grandTotal = itemList.items.reduce((total, current) => total + (current.qty * current.cost),0)
    const qtyTotal = itemList.items.reduce((total, current) => total + (current.qty),0)

    
    

    return(
        <div>
        <Grid container spacing={1}>
            <Grid item xs={6}>
            <Paper className={classes.formPaper}>
                <Grid container spacing={3}>
                    <Grid item xs={5}>
                        <TextField size='small' label='Date' onChange={(e) => handleDateChange(e)} value={purchaseReceiptForm.posting_datetime} style={{marginLeft:10}} fullWidth variant='outlined' type='datetime-local'></TextField>
                    </Grid>
                    <Grid item xs={5}>
                    <Autocomplete size='small' onChange ={getPurchaseOrderItems} options={purchaseOrderList} getOptionLabel={(option) => option.purchase_order_number} autoHighlight style={{ width: 300 }} 
                        renderInput={(params) => <TextField {...params} label="Purchase Order" variant="outlined" />}/>
                    </Grid>
       
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={5}>
                        <TextField style={{marginLeft:10}} read_only='true' fullWidth size='small' variant='outlined' label='Supplier' value={purchaseReceiptForm.supplier}></TextField>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField size='small' fullWidth variant='outlined' label='Status' value={purchaseReceiptForm.status}></TextField>
                    </Grid>
                </Grid>
            </Paper>
            </Grid>

            <Grid item xs={6}>
            <Paper className={classes.formPaper}>
                <Grid style={{marginLeft:5}} container spacing={3}>
                    <Grid item xs={3}>
                        <TextField size='small' helperText='Auto Compute' fullWidth variant='outlined' read_only='true' value={grandTotal.toFixed(2)} label='Grand Total:'></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField size='small' fullWidth variant='outlined' label='Total Qty' value={qtyTotal}></TextField>
                    </Grid>
       
                </Grid>

                <Grid style={{marginLeft:5}} container spacing={3}>
                    <Grid item xs={3}>
                        <TextField size='small' onChange={(e) => {invoice_amountHandle(e)}} fullWidth variant='outlined' type='number' label='Invoice Amount' value={purchaseReceiptForm.invoice_amount}></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        {purchaseReceiptForm.items.length > 0 ? (
                        <Button variant='contained' onClick={(e) => {handleSubmit(e)}} color='primary'>Submit</Button>
                        ):purchaseReceiptForm.status === 'Submitted' ? (
                        <Button disabled variant='contained' color='secondary'>Cancel</Button>
                        ):(
                        <Button disabled variant='contained' color='secondary'>Submit</Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>
            </Grid>        
        </Grid>



            <Paper className={classes.formTable}>   
                <Grid container spacing={3}>
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell width='50%'>Description</TableCell>
                                    <TableCell width='10%'>Qty</TableCell>
                                    <TableCell width='10%'>Rate</TableCell>
                                    <TableCell align='center' width='30%'>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseReceiptForm.items.map((item,key)=>(
                                    <TableRow hover key={key}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell><TextField  type='number' value={item.qty} variant='outlined' onChange={(e) => {qtyHandle(e, item, key)}} size='small'></TextField></TableCell>
                                        <TableCell><TextField  type='number' value={item.cost} variant='outlined' onChange={(e) => {costHandle(e, item, key)}} size='small'></TextField></TableCell>
                                        <TableCell align='center'><TextField read_only='true' variant='outlined' size='small' value={(item.qty * item.cost).toFixed(2)}></TextField></TableCell>
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