import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import styles, { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination';


const useStyles = makeStyles((theme) => ({
    root:{

    },
    paper:{
        margin:10,
        marginLeft:55,
        marginRight:25,     
    },
    search:{
        margin:10,
        marginLeft:55,
        marginRight:25,
        backgroundColor:'#d6d6d6'
    },
    table:{
        minHeight:250,
        margin:10,
        marginLeft:55,
        marginRight:25,
        backgroundColor:'#d6d6d6',
        
    }
}))

export default function BuyingList() {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = useState('')
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    useEffect(() => {
        fetchPurchaseOrders()
    },[])

    const fetchPurchaseOrders = () =>{
        var url = 'http://127.0.0.1:8000/api/purchaseorder-list'
        fetch(url)
        .then(response => response.json())
        .then(response => setPurchaseOrderList(response))
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(0)
    }

    const handleCreateNew = (e) =>{
        history.push('/buying')
    }

    const getTotalAmount = (purchaseOrder) =>{
        var total = 0
        {purchaseOrder.items.map((item, key) => (
            total += parseFloat(item.cost * item.qty)
        ))}
        return total.toFixed(2)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const handleView = (e, item) => {
        history.push(`/buying/${item.purchase_order_number}`)
    }

    return(
        <>
        <Grid container direction="row-reverse">
        <Paper className={classes.paper}>
                <Button to style={{float:'right'}} onClick={(e) => handleCreateNew(e)} variant='contained' color='primary'>Create Purchase Order</Button>
        </Paper>
        </Grid>
    
        <Paper className={classes.search}>
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <TextField type='search' onChange={(e) => handleSearch(e)} fullWidth label='Search' style={{margin:5}} variant='outlined' size='small' InputProps={{startAdornment:(
                    <InputAdornment position='start'>
                        <SearchIcon />
                    </InputAdornment>)}}/>
            </Grid>
        </Grid>
        </Paper>

        <Grid container>
            <Grid item xs={12}>
            <Paper className={classes.table}>
                <TableContainer style={{maxHeight:650}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Purchase Order</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Delivered</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                            {purchaseOrderList.filter((val) => {
                                if(search === ''){
                                    return val
                                }else if(val['purchase_order_number'].toLowerCase().includes(search.toLowerCase())){
                                    return val}
                            }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, key) => (
                                <TableRow onClick={(e) => handleView(e, item)} key={key} hover>
                                    <TableCell>{item.purchase_order_number}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    {item.is_received == true ? (<TableCell>Yes</TableCell>):(<TableCell>No</TableCell>)}
                                    <TableCell>{getTotalAmount(item)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {search === '' ? (
                        <TableFooter>
                             <TableRow>
                                 <TablePagination colSpan={0} count={purchaseOrderList.length} rowsPerPage={rowsPerPage} page={page} onChangeRowsPerPage={handleChangeRowsPerPage} onChangePage={handleChangePage}/>
                             </TableRow>
                        </TableFooter>
                        ): (
                        <TableFooter>
                        </TableFooter>
                        )}
                       
                    </Table>
                    
                </TableContainer>
            </Paper>
            </Grid>
        </Grid>
        </>
    )
}