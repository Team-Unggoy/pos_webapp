import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from 'semantic-ui-react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Search } from 'semantic-ui-react'
import Grid from '@material-ui/core/Grid';
import _ from 'lodash'
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        flexGrow: 1,
      },

    search:{
        margin:15
    },
    paper: {
        padding:5,
        textAlign: 'center',
        backgroundColor:'#D6D6D6'
      },
    form:{
        height:700,
        margin:5,
        marginLeft:30,
        backgroundColor:'#D6D6D6',
        border:'1px solid black',
        padding:5
    },
    table:{
        
        minHeight:700
    },
  });

class Buying extends React.Component{
    constructor(props){
        super(props)
        this.state={
            buyingForm:{
                posting_datetime: new Date(),
                status:'Draft',
                supplier:'',
                items:[],
            },
            value:'',
            itemDropDown:[],
            isLoading:false,
            results:[],
        }
        
        this.fetchItem = this.fetchItem.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)


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
            var url = 'http://127.0.0.1:8000/api/item-list/'

            fetch(url)
            .then(response => response.json())
            .then(data => this.setState({
                itemDropDown:data
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
            }).then((response) => {
                this.setState({
                    buyingForm:{
                        ...this.state.buyingForm,
                        posting_datetime: new Date(),
                        status:'Draft',
                        supplier:'',
                        items:[],
                    }
                })
                var sumbitDate = new Date()
                this.formatDate(sumbitDate)

            })
        }
    
    
        handleDateChange(date){
            this.setState({
                posting_datetime:date
            })
        }

        handleSearchChange = (e, {value}) => {

        const itemList = this.state.itemDropDown.map((row, index)=>({
            key: index,
            title: row.name,
            description: row.srp,
            price: row.cost,
            srp:row.srp,
            
        }));    
            this.setState({
                isLoading: true, value
            })
            setTimeout(() => {
            if(this.state.value.length < 1)return this.setState({
                isLoading:false,
                results:[],
                value:'',
                })

                const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
                const isMatch = (result) => re.test(result.title)
                this.setState({
                  isLoading: false,
                  results: _.filter(itemList, isMatch),
                })
            }, 300);
        }
        

        handleResultSelect = (e, {result}) =>{
            // check if item is already in list
            const itemIndex = this.state.buyingForm.items.findIndex(
                (item) => item.key === result.key
                
              );
            if(itemIndex !== -1){
                this.setState(prevState => ({
                    value:'',
                    buyingForm:{
                        ...this.state.buyingForm,
                        items:prevState.buyingForm.items.map(
                        
                            el => el.key === result.key? { ...el, qty:parseInt(el.qty) +1, total:(el.qty+ 1) * parseFloat(el.cost).toFixed(2) }: el
                        ),
                    },    
                }))
            }
            else{
            const obj = {'key':result.key, 'name': result.title, 'cost':parseFloat(result.price).toFixed(2), 'qty':1, 'total':parseFloat(result.price).toFixed(2) * 1}

            this.setState(() =>({
                buyingForm:{
                    ...this.state.buyingForm,
                    items:[
                        ...this.state.buyingForm.items,
                        obj,
                    ],
                },
                value:'',

                
            }))
        }
        }

        qtyHandle = (event, row, index) => {
            this.setState(prevState => ({
                buyingForm:{
                    ...this.state.buyingForm,
                    items:prevState.buyingForm.items.map(
                            el => el.key === row.key? { ...el, qty: parseInt(event.target.value), total: event.target.value * parseFloat(el.cost).toFixed(2)}: el
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
        

        

        
    render(){
        const { classes } = this.props;
        const qty_total = this.state.buyingForm.items.reduce((qty_total, list) => qty_total + parseInt(list.qty),0)
        const list_total = this.state.buyingForm.items.reduce((list_total,list) => list_total + list.total, 0)
        list_total.toFixed(2)

        return(
     
            <>
            
            
       

            <div className={classes.root}>
            <Grid className={classes.search}>
            <TextField style={{marginBottom:10}} label="DATE" variant='outlined' className='date' type='datetime-local' onChange={this.handleDateChange} value={this.state.buyingForm.posting_datetime}></TextField>

            <Search
            className='searchbar'
            size='big'
            input={{ icon: 'search', iconPosition: 'left' }}
            loading={this.state.isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
            })}
            results={this.state.results}
            value={this.state.value}
            />

            </Grid>
            <Grid container spacing={2}>
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
                        
                        {this.state.buyingForm.items.map((row, index) =>(
                            <TableRow hover key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell size='small'><TextField type='number' value={row.qty} fullWidth variant='standard' size='small' onChange={(e) => {this.qtyHandle(e, row,index)}} /></TableCell>
                                <TableCell align='right'>{row.cost}</TableCell>
                                <TableCell align='right'>{row.total}</TableCell>
                                <TableCell><DeleteIcon onClick={() => {this.deleteItem(row,index)}}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
                </Grid>


            <Grid item xs={5}>
            <Paper className={classes.form}>

            <Grid container spacing={2}>        
                <Grid item xs={12}>   
                <Typography variant="h1" style={{fontSize:30,textAlign:'left',borderRadius:10, color:'#333533',backgroundColor:'#ffd100'}} noWrap>Information</Typography>
                </Grid>                   
                <Grid item>
                    <TextField label='SUPPLIER' placeholder='Supplier' variant='outlined' onChange={this.handleSupplier} value={this.state.buyingForm.supplier} inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                </Grid>
                <Grid item>
                    <TextField label='STATUS' disabled variant='outlined' value={this.state.buyingForm.status} inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h1" style={{fontSize:30,textAlign:'left',borderRadius:10, color:'#333533',backgroundColor:'#ffd100'}} noWrap>Summary</Typography>
                </Grid>
                <Grid item>
                    <TextField label='GRAND TOTAL' disabled variant='outlined' value={list_total}  inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                </Grid>

                <Grid item>
                    <TextField label='TOTAL QUANTITY' disabled variant='outlined' value={qty_total}  inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white'}}}></TextField>
                </Grid>

            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h1" style={{fontSize:30,textAlign:'left',borderRadius:10, color:'#333533',backgroundColor:'#ffd100'}} noWrap>Action</Typography>
                </Grid>

                <Grid item>
                {this.state.buyingForm.items.length > 0 ? (
                <Button variant="contained" style={{padding:20}} type='button' color='yellow' onClick={(e) => this.handleSubmit(e)} primary> Submit</Button>
            ):<Button variant="contained" style={{padding:20}} basic disabled color='yellow' type='button' onClick={(e) => this.handleSubmit(e)} primary> Submit</Button>
            }
                </Grid>
            </Grid>
</          Paper>
            </Grid>
            </Grid>
            </div>
            
            
            </>
        )
    }
}

Buying.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Buying);