import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button  from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from "@material-ui/icons/Search";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl'
import { useHistory } from "react-router-dom";


const styles = theme => ({
    root: {
        
      },

    searchForm:{
        backgroundColor:'#D6D6D6',
        minHeight:125,
        marginTop:20,
        margin:15,
    },

    search:{
        margin:15,
    },
    paper: {
        padding:5,
        margin:15,
        textAlign: 'center',
        backgroundColor:'#D6D6D6'
      },
    form:{
        minHeight:650,
        margin:15,
        marginLeft:15,
        backgroundColor:'#D6D6D6',
        padding:5
    },
    table:{
        minHeight:600
    },
  });

class Buying extends React.Component{
    constructor(props){
        super(props)
        this.state={
            buyingForm:{
                posting_datetime: new Date(),
                status:'',
                supplier:'',
                items:[],
            },

            search:'',
            itemList:[],
            columnToQuery:'name',



        }
        
        this.fetchItem = this.fetchItem.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getItemsUnderSupplier = this.getItemsUnderSupplier.bind(this)
        this.rerouteToPurchasOrder = this.rerouteToPurchasOrder.bind(this)

    }

        getCookie(name) {
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
        
        componentWillMount(){
            this.fetchItem()
        }

        componentDidMount(){
            this.formatDate(this.state.buyingForm.posting_datetime)
        }

        initializeForm(){
            this.setState({
                ...this.state.buyingForm,
                buyingForm:{
                    posting_datetime: new Date(),
                    status:'Draft',
                    supplier:'',
                    items:[],
                },
                

            })
        }

        formatDate = (date) =>{
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var hour = (date.getHours()).toString();
            hour = hour.length > 1? hour :  '0' + hour;
            var minute = date.getMinutes().toString()
            minute = minute.length > 1 ?  minute: '0' + minute;
            var second = date.getSeconds().toString();
            second = second.length > 1 ?  second: '0' + second;
            this.setState({
                buyingForm:{
                    ...this.state.buyingForm,
                    posting_datetime:year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second
                }
                
            })
        }

        handleDateChange = (event) =>{
    
            this.setState({
                buyingForm:{...this.state.buyingForm,
                    posting_datetime: event.target.value
            }
                
            })
        }

        fetchItem(){
            var url = 'http://127.0.0.1:8000/api/item-list-active/'

            fetch(url)
            .then(response => response.json())
            .then(data => this.setState({
                itemList:data
            }))
        }

        handleSubmit = (e) =>{
            e.preventDefault()
            var csrftoken = this.getCookie('csrftoken')
            var url = 'http://127.0.0.1:8000/api/purchaseorder-create/'
            console.log(this.state.buyingForm);
            fetch(url,{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,

                },
                'body' :JSON.stringify(this.state.buyingForm)
            }).then((response) => { response.json()
                .then(response => this.rerouteToPurchasOrder(response['purchase_order_number']))
            })
        }
    
    
        handleDateChange(date){
            this.setState({
                posting_datetime:date
            })
        }

        qtyHandle = (event, row) => {
            this.setState(prevState => ({
                buyingForm:{
                    ...this.state.buyingForm,
                    items:prevState.buyingForm.items.map(
                            el => el.item === row.item? { ...el, qty: parseInt(event.target.value)}: el
                        ),
                }
               
            }))
        }


        deleteItem = (row,index) =>{
            var list = [...this.state.buyingForm.items]
            list.splice(index, 1);
            this.setState(prevState =>({
                buyingForm:{
                    ...this.state.buyingForm,
                    items:list,
                }
            }))
        }

        handleSupplier = (e) =>{
            this.setState({
                buyingForm:{
                    ...this.state.buyingForm,
                    supplier:e.target.value
                }
                
            })
        }

        handleSelect = (e) => {
            this.setState({
                columnToQuery:e.target.value
            })
        }

        selectItemHandler = (e, item) => {
            console.log(this.state.buyingForm.items, item, 'testing')
            const itemIndex = this.state.buyingForm.items.findIndex(
                (list) => list.item === item.id                
              );

        if(itemIndex !== -1){
        this.setState(prevState => ({
            buyingForm:{
                ...this.state.buyingForm,
                items:prevState.buyingForm.items.map(
                
                    el => el.item === item.id? { ...el, qty:parseInt(el.qty) +1}: el
                ),
            },    
            }))
        }
        else{
            const obj = {item: item.id, name:item.name, barcode_number:item.barcode_number, qty:1, cost:item.cost}
            this.setState(() => ({
                buyingForm:{
                    ...this.state.buyingForm,
                    items:[
                        ...this.state.buyingForm.items,
                        obj,
                    ],
                }
            }))
        }

        
            
        }

        rerouteToPurchasOrder = (purchaseOrder) => {
                this.props.history.push(`/buying/${purchaseOrder}`)
        }
     

        getItemsUnderSupplier = () => {
            console.log(this.state.buyingForm.supplier)
            var url = `http://127.0.0.1:8000/api/item-list-supplier/${this.state.buyingForm.supplier}/`
            fetch(url)
            .then(response => response.json())
            .then(response =>  {
                let list = []
                response.map((item, key) => {
                    const obj = {'item':item.id, 'name': item.name, 'barcode_number':item.barcode_number, 'cost':parseFloat(item.cost).toFixed(2), 'qty':1}
                    list.push(obj)
                    return list
                })
                console.log(list, 'testing new lsit')
                this.setState(prevState =>({
                buyingForm:{
                    ...this.state.buyingForm,
                    items:list,
                }
            }))}
            )
            
            
            
        }
        
        

        

        
    render(){
        const { classes } = this.props;
        const qty_total = this.state.buyingForm.items.reduce((qty_total, current) => qty_total + parseInt(current.qty),0)
        const list_total = this.state.buyingForm.items.reduce((list_total,current) => list_total + (current.cost*current.qty), 0)
        console.log(this.state.buyingForm)

        return(
     
            <>

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Paper className={classes.searchForm}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField style={{margin:10}} label="Date" variant='outlined' size='small' className='date' type='datetime-local' onChange={this.handleDateChange} value={this.state.buyingForm.posting_datetime}></TextField>
                            </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField style={{margin:10}}  label='Supplier' variant='outlined' size='small' onChange={this.handleSupplier} value={this.state.buyingForm.supplier} inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                            </Grid>
                            <Grid item xs={5}>
                                {this.state.buyingForm.supplier === '' ? (
                                <Button color='primary' disabled variant='contained' onClick={(e) => this.getItemsUnderSupplier()} style={{margin:10}}>Get Items Under Supplier</Button>
                                ):(
                                <Button color='primary' variant='contained' onClick={(e) => this.getItemsUnderSupplier()} style={{margin:10}}>Get Items Under Supplier</Button>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={6}>
                    <Paper className={classes.searchForm}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label='Total Amount' style={{margin:10}} size='small' disabled variant='outlined' value={list_total.toFixed(2)}  inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label='Total Qty' style={{margin:10}} size='small' disabled variant='outlined' value={qty_total}  inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white'}}}></TextField>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                            {this.state.buyingForm.items.length > 0 ? (
                            <Button fullWidth style={{margin:10}} variant="contained" type='button' color='yellow' onClick={(e) => this.handleSubmit(e)} color='primary'> Save</Button>)
                            :<Button fullWidth style={{margin:10}} variant="contained" basic disabled color='yellow' type='button' onClick={(e) => this.handleSubmit(e)} primary> Save</Button>}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
            <Grid item xs={6}> 
                <Paper className={classes.paper}>
                <Grid container style={{padding:5}} spacing={2}>
                    <Grid item xs={6}>
                        <TextField type="search" onChange={(e) => this.setState({search:e.target.value})} value={this.state.search} label='SEARCH' size='small' fullWidth variant='outlined' InputProps={{startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon />
                        </InputAdornment>)}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant='outlined' size='small'>
                        <Select onChange={(e) => this.handleSelect(e)} fullWidth variant='outlined'>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.itemList.filter((val) => {
                        if(this.state.search === ''){
                            return val
                        }else if(val[this.state.columnToQuery].toLowerCase().includes(this.state.search.toLowerCase())){
                            return val}
                    }).map((item,key) =>(
                        <TableRow className={classes.tableRow} onClick={(e) => this.selectItemHandler(e, item)} key={item.id} hover>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>{item.barcode_number}</TableCell>
                           <TableCell>{item.cost}</TableCell>
                           <TableCell>{item.srp}</TableCell>
                           
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                </Paper>
                </Grid>


            <Grid item xs={6}>
            <Paper className={classes.form}>

                <TableContainer style={{maxHeight:70}} className={classes.table}>
                    <Table stickyHeader size='small'>
                    <TableHead>
                    <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell width='15%'>Qty</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell width='10'>Delete</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {this.state.buyingForm.items.map((item, index) =>(
                            <TableRow hover key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell size='small'><TextField type='number' value={item.qty} fullWidth variant='standard' size='small' onChange={(e) => {this.qtyHandle(e, item)}} /></TableCell>
                                <TableCell>{item.cost}</TableCell>
                                <TableCell>{(item.cost*item.qty).toFixed(2)}</TableCell>
                                <TableCell><DeleteIcon onClick={() => {this.deleteItem(item,index)}}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
                </Grid>
            </Grid>

            
            
            </>
        )
    }
}

Buying.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Buying);