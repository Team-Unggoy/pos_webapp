import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'semantic-ui-react'
import { TextField } from '@material-ui/core';
import { Button } from 'semantic-ui-react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Search } from 'semantic-ui-react'
import Grid from '@material-ui/core/Grid';
import _ from 'lodash'



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
                // enter reponse here
                
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
                        
                            el => el.key === result.key? { ...el, qty:el.qty +1, total:(el.qty+ 1) * parseFloat(el.cost).toFixed(2) }: el
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
                            el => el.key === row.key? { ...el, qty: event.target.value, total: event.target.value * parseFloat(el.cost).toFixed(2)}: el
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
            
           

            <div style={{float: 'right', margin:5}}>
            <Button type='button' onClick={(e) => this.handleSubmit(e)} primary> Submit</Button>
            <Button type='button' secondary> Delete</Button>  
            </div>

            <form className='buying-form'>
          
            <div className='buying-input'>
 
            

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

            <div className='table-container'>

                <Table size='large' celled fixed selectable compact color={'yellow'}>
                    <Table.Header style={{  position:'sticky'}}>
                    <Table.Row>
                        <Table.HeaderCell width={4}>Item Name</Table.HeaderCell>
                        <Table.HeaderCell width={1}>Qty</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Rate</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Total</Table.HeaderCell>
                        <Table.HeaderCell width={1}></Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        
                        {this.state.buyingForm.items.map((row, index) =>(
                            <Table.Row key={index}>
                                <Table.Cell>{row.name}</Table.Cell>
                                <Table.Cell> <TextField  type='number' value={row.qty} fullWidth variant='standard' size='small' onChange={(e) => {this.qtyHandle(e, row,index)}} /></Table.Cell>
                                <Table.Cell>{row.cost}</Table.Cell>
                                <Table.Cell>{row.total}</Table.Cell>
                                <Table.Cell><DeleteIcon onClick={() => {this.deleteItem(row,index)}}/></Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                

            </div>
            <Button type='button' style={{marginTop: 5}} onClick={this.getList}>Get all Items</Button>
            </div>
            
            <div className='table-info' style={{backgroundColor:'#D6D6D6'}}>
            <div className='table-info-grid'>
            <h1 style={{fontSize:30,textAlign:'left',borderRadius:10, color:'#333533',backgroundColor:'#ffd100'}}>Information</h1>
            <Grid container spacing={3}>
                <Grid item>
                    <TextField label="DATE" variant='outlined' className='date' type='datetime-local' onChange={this.handleDateChange} value={this.state.buyingForm.posting_datetime}></TextField>
                </Grid>
                <Grid item>
                    <TextField label='SUPPLIER' variant='outlined' onChange={this.handleSupplier} value={this.state.buyingForm.supplier} inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                </Grid>
                <Grid item>
                    <TextField label='STATUS' variant='outlined' value={this.state.buyingForm.status} inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                </Grid>
            </Grid>
            </div>
            <div className='table-info-grid'>
            <h1 style={{fontSize:30,textAlign:'left',borderRadius:10, color:'#333533',backgroundColor:'#ffd100'}}>Summary</h1>
            <Grid container spacing={3}>
                <Grid item>
                    <TextField label='GRAND TOTAL'  variant='outlined' value={list_total}  inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white', borderSpacing:5}}}></TextField>
                </Grid>

                <Grid item>
                    <TextField label='TOTAL QUANTITY' variant='outlined' value={qty_total}  inputProps={{ style: { fontSize:15,color: 'black', borderColor:'white'}}}></TextField>
                </Grid>
            </Grid>
            </div>
            </div>

            </form>

            
            
            </>
        )
    }
}

export default Buying