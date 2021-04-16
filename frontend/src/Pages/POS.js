import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, FormControl, Select, MenuItem, Button} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear';


const useStyles = makeStyles((theme) => ({

  paper:{
    margin:10
  },

  form:{
    backgroundColor:'#D6D6D6',
    minHeight:120,
    marginTop:10,
    margin:10,
},

  formTable:{
    backgroundColor:'#D6D6D6',
    minHeight:700,
    marginTop:10,
    margin:10,

}

}))

function POS() {
  const classes = useStyles();
  const [itemList, setItemList] = useState([])
  const [search, setSearch] = useState('')
  const [posObj, setPosObj] = useState({posting_datetime: new Date(), sales_invoice:0, costumer:'Walk-in', items:[]})
  const [columnToQuery, setColumnToQuery] = useState('name')


  useEffect(() => {
    formatDate(posObj.posting_datetime)
    fetchItem()
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
  setPosObj({...posObj, posting_datetime:year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second})
  }

  const fetchItem = () =>{
    var url = 'http://127.0.0.1:8000/api/item-list-active/'
    fetch(url)
    .then(response => response.json())
    .then(response => setItemList(response))
    
    
  }

  const qtyHandle = (e, item) => {
    setPosObj({
    ...posObj,
        items:posObj.items.map(
        el => el.item  === item.item ? {...el, qty:parseInt(e.target.value)}:el
    ),
    })
}
  const itemInsertHandler = (e, item) => {
    const itemIndex = posObj.items.findIndex(
        (list) => list.item === item.id                
      );

      if(itemIndex !== -1){
          setPosObj({
        ...posObj,
             items:posObj.items.map(
               el => el.item === item.id ? {... el, qty:parseInt(el.qty) + 1}:el
             )
              
             })
      }
      else{
          const obj = {item: item.id, name:item.name, barcode_number:item.barcode_number, qty:1, cost:item.srp}
          setPosObj({
            ...posObj,
            items:[...posObj.items,
            obj,
            ],
          })
      }
}

  const handleSave = (e) => {
    e.preventDefault()
    var url = 'http://127.0.0.1:8000/api/salesinvoice-create/'
    var csrftoken = getCookie('csrftoken')
    console.log(posObj)
    fetch(url,{
      method:'POST',
      headers:{
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      'body':JSON.stringify(posObj)
    })
  }

    const handleDelete = (e, index) => {
      var list = [...posObj.items]
      list.splice(index,1)
      setPosObj(prevState => ({
        ...prevState,
        items:list
      }))
    }

    console.log(posObj)

    const posList = {...posObj}
    const grandTotal = posList.items.reduce((total,current) => total + (current.qty * current.cost),0)
    const change = grandTotal - posList.sales_invoice

  return (

    <>

  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Paper className={classes.form}>
        <Grid item xs={3}>
          <TextField style={{margin:10}} type='datetime-local' value={posObj.posting_datetime} label='Date' size='small' variant='outlined'></TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField style={{margin:10}} label='Costumer' value={posObj.costumer} onChange={(e) => setPosObj({...posObj, costumer:e.target.value})} size='small' variant='outlined'></TextField>
        </Grid>
      </Paper>
    </Grid>

    <Grid item xs={6}>
      <Paper className={classes.form}>
          <TextField style={{margin:10}} label='Grand Total' value={grandTotal} size='small' variant='outlined'></TextField>
          <TextField style={{margin:10}} type='number' value={posObj.sales_invoice} label='Payment' onChange={(e) => setPosObj({...posObj, sales_invoice:e.target.value})} size='small' variant='outlined'></TextField>
          <TextField style={{margin:10}} label='Change' value={change} size='small' variant='outlined'></TextField>

      <Grid container spacing={2}>
        <Grid item xs={4}>
        <Button style={{margin:10}} fullWidth color='primary' onClick={(e) => handleSave(e)} variant='contained'>Save</Button>

        </Grid>
      </Grid>
      </Paper>
    </Grid>
  </Grid>

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
                                    <TableCell align='center' width='20%'>Inventory</TableCell>
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
                                  <TableRow hover onClick={(e) => itemInsertHandler(e, item)} key={key}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.barcode_number}</TableCell>
                                  <TableCell align='center'>{item.inventory}</TableCell>
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
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {posObj.items.map((item,key)=>(
                                  <TableRow hover key={key}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell><TextField  type='number' value={item.qty} variant='outlined' onChange={(e) => {qtyHandle(e, item, key)}} size='small'></TextField></TableCell>
                                  <TableCell>{item.cost}</TableCell>
                                  <TableCell align='center'>{(item.qty * item.cost).toFixed(2)}</TableCell>
                                  <TableCell align='center' width='10%'><ClearIcon onClick={(e) => handleDelete(e, key)}/></TableCell>
                                  </TableRow>
                                      ))}
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