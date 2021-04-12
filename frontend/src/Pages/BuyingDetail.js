import React, { useEffect, useState } from 'react';
import styles, { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    paperDetail:{
        padding:5,
        backgroundColor:'#d6d6d6',
        minHeight:125,
        margin:15,
    },

    form:{
        minHeight:650,
        margin:15,
        marginLeft:15,
        backgroundColor:'#D6D6D6',
        padding:5
    },

    paper: {
        padding:5,
        margin:15,
        textAlign: 'center',
        backgroundColor:'#D6D6D6'
      },

}))


function BuyingDetail(props) {
    
    const classes = useStyles();
    const [purchaseOrder, setPurchaseOrder] = useState({purchase_order_number:'', status:'', supplier:'', items:[]})
    const [itemList, setItemList] = useState([])
    const [columnToQuery, setColumnToQuery] = useState('name')
    const [search, setSearch] = useState('')


    useEffect(() => {
        fetchPurchaseOrder();
        fetchItem()
    },[])

    const fetchPurchaseOrder = () =>{
        var url = `http://127.0.0.1:8000/api/purchaseorder-detail/${props.match.params.purchase_order_number}`
        fetch(url)
        .then(response => response.json())
        .then(response => {setPurchaseOrder(response)})
    }

    const fetchItem = () =>{
        var url = 'http://127.0.0.1:8000/api/item-list-active/'

        fetch(url)
        .then(response => response.json())
        .then(response => setItemList(response))
    }


    return (
        <>
          <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Paper className={classes.paperDetail}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField style={{margin:10}} fullWidth label="Date" variant='outlined' size='small' className='date' type='datetime-local'></TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField style={{margin:10}} fullWidth label="Purchase Order" variant='outlined' size='small' value={purchaseOrder.purchase_order_number}></TextField>
                            </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField style={{margin:10}} fullWidth label='Supplier' variant='outlined' size='small' value={purchaseOrder.supplier}></TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField style={{margin:10}} fullWidth label="Status" variant='outlined' size='small' value={purchaseOrder.status}></TextField>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={6}>
                    <Paper className={classes.paperDetail}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label='Total Amount' style={{margin:10}} size='small' disabled variant='outlined'></TextField>
                            </Grid>
                            <Grid item xs={6}>  
                                <TextField label='Total Qty' style={{margin:10}} size='small' disabled variant='outlined'></TextField>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Button fullWidth style={{margin:10}} variant="contained" type='button' color='yellow' color='primary'> Submit</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>

            <Grid item xs={12}>
            <Paper className={classes.form}>

                <TableContainer style={{maxHeight:650}} className={classes.table}>
                    <Table stickyHeader size='small'>
                    <TableHead>
                    <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell width='15%'>Qty</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchaseOrder.items.map((item, index) =>(
                            <TableRow hover key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell>{item.cost}</TableCell>
                                <TableCell>{(item.cost*item.qty).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default BuyingDetail;