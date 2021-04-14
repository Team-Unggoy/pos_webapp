import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, FormControl, Select, MenuItem} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'


const useStyles = makeStyles((theme) => ({

  form:{
    background:'#D6D6D6',
    margin:10,
    padding:10,
    
  },

  formTable:{
    backgroundColor:'#D6D6D6',
    minHeight:700,
    marginTop:20,
    margin:10,

}

}))

function POS() {
  const classes = useStyles();
  const [itemList, setItemList] = useState([])
  const [search, setSearch] = useState('')
  const [posObj, setPosObj] = useState([])
  const [columnToQuery, setColumnToQuery] = useState('name')


  useEffect(() => {
    fetchItem()
  },[])

  const fetchItem = () =>{
    var url = 'http://127.0.0.1:8000/api/item-list-active/'
    fetch(url)
    .then(response => response.json())
    .then(response => setItemList(response))
    
    
  }

  const qtyHandle = () => {
    console.log('testing')
  }

  const handlePOSInsert = (e, item) => {
    console.log(item)
  }

  return (

    <>

  <Paper className={classes.form}>
    <Grid container spacing={1}>
      <Grid item xs={2}>
          <TextField type='datetime-local' label='Date' size='small' variant='outlined'></TextField>
      </Grid>
    </Grid>
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <TextField label='Costumer' size='small' variant='outlined'></TextField>
      </Grid>
    </Grid>
  </Paper>

    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Paper className={classes.formTable}>
          <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField type="search" onChange={(e) => setSearch(e.target.value)} value={search} label='Search' size='small' fullWidth variant='outlined' InputProps={{startAdornment: (
            <InputAdornment position="start">
          <SearchIcon />
          </InputAdornment>)}}/>
        </Grid>
            <Grid item xs={6}>
            <FormControl fullWidth variant='outlined' size='small'>
            <Select onChange={(e) => {setColumnToQuery(e.target.value)}} fullWidth variant='outlined'>
                <MenuItem value='name'>Name</MenuItem>
                <MenuItem value='barcode_number'>Barcode</MenuItem>
                <MenuItem value='cost'>Buying</MenuItem>
                <MenuItem value='srp'>Selling</MenuItem>
            </Select>
            </FormControl>
            </Grid>
        </Grid>
                <Grid container spacing={0}>
                  <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width='50%'>Sku</TableCell>
                                    <TableCell width='30%'>Barcode</TableCell>
                                    <TableCell width='20%'>Inv</TableCell>
                                    <TableCell width='20%'>SRP</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemList.filter((val) => {
                                  if(search === ''){
                                    return val
                                  }else if(val[columnToQuery].toLowerCase().includes(search.toLowerCase())){
                                    return val}
                                }).map((item,key)=>(
                                  <TableRow hover onClick={(e) => handlePOSInsert(e, item)} key={key}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.barcode_number}</TableCell>
                                  <TableCell>{item.inventory}</TableCell>
                                  <TableCell>{item.srp}</TableCell>
                                  </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Paper>
          </Grid>

          <Grid item xs={6}>
        <Paper className={classes.formTable}>   
                <Grid container spacing={0}>
                  <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width='50%'>Description</TableCell>
                                    <TableCell width='10%'>Qty</TableCell>
                                    <TableCell width='10%'>Srp</TableCell>
                                    <TableCell align='center' width='30%'>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* {purchaseReceiptForm.items.map((item,key)=>(
                                  <TableRow hover key={key}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell><TextField  type='number' value={item.qty} variant='outlined' onChange={(e) => {qtyHandle(e, item, key)}} size='small'></TextField></TableCell>
                                  <TableCell><TextSkuField  type='number' value={item.cost} variant='outlined' onChange={(e) => {costHandle(e, item, key)}} size='small'></TextField></TableCell>
                                  <TableCell align='center'><TextField read_only='true' variant='outlined' size='small' value={(item.qty * item.cost).toFixed(2)}></TextField></TableCell>
                                  </TableRow>
                                      ))} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Paper>
          </Grid>
      </Grid>
    </>
  );
}

export default POS;