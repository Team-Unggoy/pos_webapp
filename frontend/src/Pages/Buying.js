import React from 'react'
import DatePicker from 'react-datepicker';
 
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Table from '@material-ui/core/Table';
import { Table } from 'semantic-ui-react'
// import TableBody from '@material-ui/core/TableBody';
// import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import { TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';
import { Button } from 'semantic-ui-react'
import { Input } from 'semantic-ui-react'

import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import _ from 'lodash'
import { blue, green } from '@material-ui/core/colors';


class Buying extends React.Component{
    constructor(props){
        super(props)
        this.state={
            startDate:new Date(),
            startTime:new Date(),
            itemDropDown:[],
            selected:null,
            isLoading:false,
            results:[],
            buyingList:[],
            value:'',
            

        }
        this.handleDateChange = this.handleDateChange.bind(this)
        this.fetchItem = this.fetchItem.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.addToBuyingTable = this.addToBuyingTable.bind(this)


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

        fetchItem(){
            var url = 'http://127.0.0.1:8000/api/item-list/'

            fetch(url)
            .then(response => response.json())
            .then(data => this.setState({
                itemDropDown:data
            }))
        }
    
    
        handleDateChange(date){
            console.log(date)
            this.setState({
                startDate:date
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
            console.log(this.state.buyingList.length)
            const obj = {'id':this.state.buyingList.length, 'name': result.title, 'cost':result.price, 'qty':1, 'total':result.price * 1}
            console.log(obj);
            this.setState({
                buyingList:[
                    ...this.state.buyingList,
                    obj,

                ],
                value:'',

                
            })
            console.log(this.state.buyingList)
        }

        addToBuyingTable = (event, data) => {
            console.log('testing', data.value)
            console.log(this.state.selected)
        }

        qtyHandle = (event, row, index) => {
            console.log(event.target.value, row,index, 'testint run here');
            this.setState(prevState => ({
                buyingList:prevState.buyingList.map(
                    el => el.id === index? { ...el, qty: parseInt(event.target.value), total: parseInt(event.target.value) * el.cost}: el
                )
            }))
        }
        

        

        
    render(){
        console.log(this.state.buyingList, 'udpate')

        return(
     
            <>
            
            <div>
            <form className='buying-form'>
            <div className='buying-input'>

 

            <DatePicker
              className='testing'
              selected={ this.state.startDate }
              onChange={ this.handleDateChange }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={10}
              timeCaption="time"
              dateFormat="MM dd, yyyy h:mm aa"
            />

            <div style={{float: 'right'}}>
            <Button primary> Submit</Button>
            <Button secondary> Delete</Button>  
            </div>

            <Search
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

          
                <Table size='large' celled fixed selectable compact>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Item Name</Table.HeaderCell>
                        <Table.HeaderCell width={1}>Qty</Table.HeaderCell>
                        <Table.HeaderCell>Cost</Table.HeaderCell>
                        <Table.HeaderCell>Total</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.buyingList.map((row, index) =>(
                            <Table.Row key={index}>
                                <Table.Cell>{row.name}</Table.Cell>
                                <Table.Cell> <TextField type='number' defaultValue={row.qty} fullWidth variant='standard' size='small' onChange={(e) => {this.qtyHandle(e, row,index)}}/></Table.Cell>
                                <Table.Cell>{row.cost}</Table.Cell>
                                <Table.Cell>{row.total}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

{/* 
            <TableContainer>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.buyingList.map((row, index) =>(
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.qty}</TableCell>
                                <TableCell>{row.cost}</TableCell>
                                <TableCell>{row.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            </div>
            
            </form>
            </div>
            
            </>
        )
    }
}

export default Buying