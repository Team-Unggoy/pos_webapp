import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles((theme) => ({
    root:{
        flexGrow:1,
    },
    form:{
        marginTop: 15,
        marginRight:10,
        backgroundColor:'#D6D6D6',
        padding:10,
        minHeight:700,
    },

    paper:{
        margin:14,
        backgroundColor:'#D6D6D6',
        minHeight:700,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    table:{
        maxHeight:700,
    },
    tableRow: {
        "&.Mui-selected, &.Mui-selected:hover": {
          backgroundColor: "#e9c46a",
        }
      },
      


}));



export default function Item() {
    var timer
    const classes = useStyles();
    const [message, setMessage] = useState(false)
    const [itemList, setItemList] = useState([])
    const [itemObj, setItem] = useState({name:'', barcode_number:'', cost:'', srp:'', enable:true, supplier:''})
    const [itemFormStatus, setItemForm] = useState('Create')
    const [columnToQuery, setColumnToQuery] = useState('name')
    const [search, setSearch] = useState('')
    const [markup, setMarkup] = useState(0)
    const [inventory, setInventory] = useState(0)
    const [margin, setMargin] = useState(0)
    const [selectedRow, setSelectedRow] = useState(0)

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
    

    useEffect(() => {
        // fetchItems
        var url = 'http://127.0.0.1:8000/api/item-list/'
        fetch(url)
        .then(response => response.json())
        .then(response => setItemList(response))
        },[itemObj])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setMessage(false);
      };

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(itemObj)
        var csrftoken = getCookie('csrftoken')
        var url = 'http://127.0.0.1:8000/api/item-create/'

        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            'body': JSON.stringify(itemObj)
        }).then((response) => {
            handleClearForm()
            
        })
    }

    const itemCreate = (e) =>{
        if(itemFormStatus === 'View'){
            setItemForm('Edit')
            setItem({...itemObj, [e.target.id]:e.target.value})
        }else{
            setItem({...itemObj, [e.target.id]:e.target.value})
        }
    }

    const handleEdit = (e) =>{
        e.preventDefault()
        var csrftoken = getCookie('csrftoken')
        var url = `http://127.0.0.1:8000/api/item-update/${itemObj.id}/`
        fetch(url, {
            method: 'PUT',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            'body': JSON.stringify(itemObj)
        })
        .then((response) => {
            setMessage(true)
            handleClearForm()
        })
    }

    const handleClearForm = (e) =>{
        setItemForm('Create')
        setSelectedRow('')
        setMarkup(0)
        setMargin(0)
        setItem({...itemObj, id:null, name:'', barcode_number:'', cost:'', srp:'', supplier:'', enable:true})
    }

    const fetchItemInv = (item) => {
        console.log(item, 'fetching item inv...')
    };

    
    const viewItemHandler = (e, item) => {
        clearTimeout(timer)
        if(e.detail === 1){
            timer = setTimeout(() => {
            setSelectedRow(item.id)
            setMargin((((item.srp - (item.cost))/ item.srp)* 100).toFixed(2)+' %')
            setMarkup((((item.srp - (item.cost))/item.cost) * 100).toFixed(2) +' %')
            setInventory(item.inventory)
            setItem({...itemObj, id:item.id, name:item.name, barcode_number:item.barcode_number, cost:item.cost, srp:item.srp, enable:item.enable, supplier:item.supplier})
            setItemForm('View')
            }, 200)
        }
        else{
            setSelectedRow(item.id)
            setMargin((((item.srp - (item.cost))/ item.srp)* 100).toFixed(2)+' %')
            setMarkup((((item.srp - (item.cost))/item.cost) * 100).toFixed(2) +' %')
            setInventory(item.inventory)
            setItem({...itemObj, id:item.id, name:item.name, barcode_number:item.barcode_number, cost:item.cost, srp:item.srp, enable:item.enable, supplier:item.supplier})
            setItemForm('Edit')
        }


        
        
    }

    const handleSelect = (e) =>{
        setSearch('')
        setColumnToQuery(e.target.value)
    }

    const handleCheckChange = () =>{
        setItem({...itemObj, enable:!itemObj.enable})
    }


    const formatModifiedDate = (date_modified) =>{
        var current_date = new Date()
        var modified = new Date(date_modified)
        var diff = current_date - modified
        if(diff < 60000){
            return ('Now')
        }else if(diff > 60000 && diff < 3600000){
            var mins_ago = diff/60000
            return (Math.floor(mins_ago) + ' m')
        }else if(diff > 3600000 && diff < 86400000){
            var hours_ago = diff/3600000
            return (Math.floor(hours_ago) + 'h')
        }else if(diff > 86400000 && diff < 2.6280E+9){
            var days_ago = diff/86400000
            return(Math.floor(days_ago) + ' d')
        }else if(diff > 2.6280E+9 && diff < 3.1536E+10){
            var months_ago = diff/2.6280E+9
            return(Math.floor(months_ago) + ' M')
        }else if(diff >= 3.1536E+10){
            var years_ago = diff/3.1536E+10
            return(Math.floor(years_ago) + ' Y')
        }

    }

    console.log(itemList)
    
    
        return(
            <div className={classes.root}>
            
            <Grid container spacing={1}>
                <Grid item xs={7}> 
                <Paper className={classes.paper}>
                <Grid container style={{padding:5}} spacing={2}>
                    <Grid item xs={6}>
                        <TextField type="search" onChange={(e) => setSearch(e.target.value)} value={search} label='SEARCH' size='small' fullWidth variant='outlined' InputProps={{startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon />
                        </InputAdornment>)}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant='outlined' size='small'>
                        <Select onChange={(e) => handleSelect(e)} fullWidth variant='outlined'>
                            <MenuItem value='name'>Name</MenuItem>
                            <MenuItem value='barcode_number'>Barcode</MenuItem>
                            <MenuItem value='cost'>Buying</MenuItem>
                            <MenuItem value='srp'>Selling</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <TableContainer className={classes.table}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Barcode</TableCell>
                                <TableCell>Buying</TableCell>
                                <TableCell>Selling</TableCell>
                                <TableCell width='10'>Modified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {itemList.filter((val) => {
                        if(search === ''){
                            return val
                        }else if(val[columnToQuery].toLowerCase().includes(search.toLowerCase())){
                            return val}
                    }).map((item,key) =>(
                        <TableRow className={classes.tableRow} selected={selectedRow === item.id} onClick={(e) => viewItemHandler(e, item)} key={item.id} hover>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>{item.barcode_number}</TableCell>
                           <TableCell>{item.cost}</TableCell>
                           <TableCell>{item.srp}</TableCell>
                           <TableCell>{formatModifiedDate(item.modified)} </TableCell>
                           
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                </Paper>
                </Grid>
                
                <Grid item xs={5}>
                    <Paper className={classes.form}>
                        <Grid container item spacing={2}>
                        <Grid item xs={12}>
                        <Typography variant="h1" style={{fontSize:30,textAlign:'left',borderRadius:5, color:'#333533',backgroundColor:'#ffd100'}} noWrap>Item {itemFormStatus} </Typography>
                        
                        </Grid>
                        <Grid item xs={12}>
                        <TextField id='name' onChange={(e) => {itemCreate(e)}} fullWidth variant='outlined' value={itemObj.name} label='Name'></TextField>
                        </Grid>
                        <Grid item xs={8}>
                        <TextField id='barcode_number' onChange={(e) => {itemCreate(e)}} fullWidth variant='outlined' value={itemObj.barcode_number} label='Barcode'></TextField>
                        </Grid>
                        {/* <Grid item xs={4}>
                        <TextField id='packing' onChange={(e) => {itemCreate(e)}} type='number' fullWidth variant='outlined' value={itemObj.packing} label='Packing'></TextField>
                        </Grid> */}
                        <Grid container item spacing={1}>
                        <Grid item xs={4}>
                        <TextField fullWidth id='cost' size='small' onChange={(e) => {itemCreate(e)}} type='number' value={itemObj.cost} variant='outlined' label='Buying'></TextField>
                        </Grid>
                        <Grid item xs={4}>
                        <TextField fullWidth id='srp' size='small' onChange={(e) => {itemCreate(e)}} type='number' value={itemObj.srp} variant='outlined' label='Selling'></TextField>
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel control={<Checkbox color={'primary'} onChange={() => handleCheckChange()} checked={itemObj.enable}/>} label='Enable'/>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField fullWidth id='supplier' onChange={(e) => {itemCreate(e)}} size='small' value={itemObj.supplier} variant='outlined' label='Supplier'></TextField>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField fullWidth read_only size='small' value={inventory} variant='outlined' label='Inventory'></TextField>
                        </Grid>
                        {itemFormStatus === 'Create' ? (
                        <Grid container item style={{paddingTop:20}} spacing={1}>
                            <Grid item xs={6}>
                            <TextField disabled read_only size='small' fullWidth value={margin} variant='outlined' label='Margin'></TextField>
                            </Grid>
                            <Grid item xs={6}>
                            <TextField disabled read_only size='small' fullWidth value={markup} variant='outlined' label='Markup'></TextField>
                            </Grid>
                        </Grid>
                        ):
                        <Grid container item style={{paddingTop:20}} spacing={1}>
                            <Grid item xs={6}>
                            <TextField read_only size='small' fullWidth value={margin} variant='outlined' label='Margin'></TextField>
                            </Grid>
                            <Grid item xs={6}>
                            <TextField read_only size='small' fullWidth value={markup} variant='outlined' label='Markup'></TextField>
                            </Grid>
                        </Grid>
                        }
                        
                        <Grid container item spacing={1}>
                        <Grid item xs={6}>
                            {itemFormStatus === 'Create' && (itemObj.name !== '' && itemObj.barcode_number !== '' && itemObj.cost !== '' && itemObj.srp !== '') ? (
                            <Button fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleSubmit(e)}>Submit</Button>
                            ):itemFormStatus === 'Edit' && (itemObj.name === '' || itemObj.barcode_number === '' || itemObj.cost === '' || itemObj.srp === '') ? (
                            <Button disabled fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleSubmit(e)}>Save</Button>
                            ):itemFormStatus === 'Edit' && (itemObj.name !== '' || itemObj.barcode_number !== '' || itemObj.cost !== '' || itemObj.srp !== '') ? (
                            <Button fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleEdit(e, itemObj)}>Save</Button>
                            ):<Button disabled fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleSubmit(e)}>Submit</Button>

                            }
                        </Grid>
                        <Grid item xs={6}>
                            {itemObj.name !== '' || itemObj.barcode_number !== '' || itemObj.cost !== '' || itemObj.srp !== ''? (
                            <Button fullWidth size='large' variant='contained' color='secondary' onClick={(e) => handleClearForm(e)}>Clear</Button>
                            ):<Button disabled fullWidth size='large' variant='contained' color='secondary' onClick={(e) => handleClearForm(e)}>Clear</Button>
                        }
                        </Grid>
                        </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                
            </Grid>   
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal:'right'}} autoHideDuration={6000} open={message} onClose={handleClose}>
            <Alert variant='filled' elevation={6} onClose={handleClose} severity="success">
                Saved
            </Alert>
            </Snackbar>
            </div>
        );
    }
