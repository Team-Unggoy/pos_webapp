import React from 'react'
// import DatePicker from 'react-datepicker';
import Datepicker from '../Components/Datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'semantic-ui-react'
import { TextField, Checkbox } from '@material-ui/core';
import { Button } from 'semantic-ui-react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Search } from 'semantic-ui-react'
import _ from 'lodash'


class Buying extends React.Component{
    constructor(props){
        super(props)
        this.state={
            itemDropDown:[],
            selected:null,
            isLoading:false,
            results:[],
            buyingList:[],
            value:'',
            checked:false,
            

        }
        this.fetchItem = this.fetchItem.bind(this)
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
            // check if item is already in list
            const itemIndex = this.state.buyingList.findIndex(
                (item) => item.key === result.key
              );
            if(itemIndex !== -1){
                this.setState(prevState => ({
                    value:'',
                    buyingList:prevState.buyingList.map(
                        
                        el => el.key === result.key? { value:'', ...el, qty:el.qty +1, total:(el.qty+ 1) * el.cost }: el
                    )
                    
                }))
            }
            else{
            const obj = {'key':result.key, 'name': result.title, 'cost':result.price, 'qty':1, 'total':result.price * 1, isChecked:false}
            this.setState({
                buyingList:[
                    ...this.state.buyingList,
                    obj,

                ],
                value:'',

                
            })
            console.log(this.state.buyingList)
        }
        }

        qtyHandle = (event, row, index) => {
            this.setState(prevState => ({
                buyingList:prevState.buyingList.map(
                    el => el.key === row.key? { ...el, qty: parseInt(event.target.value), total: parseInt(event.target.value) * el.cost}: el
                )
            }))
        }

        getList = () =>{
            this.setState({
                

            })
        }

        deleteItem = (row,index) =>{
            var list = [...this.state.buyingList]
            list.splice(index, 1);
            this.setState({
                buyingList:list
            })
        }
        

        

        
    render(){

        console.log(this.state.buyingList)

        return(
     
            <>
            
            <div>
            <form className='buying-form'>
            <div className='buying-input'>

            <div style={{float: 'right'}}>
            <Button primary> Submit</Button>
            <Button secondary> Delete</Button>  
            </div>

 
            <Datepicker />

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

                <Table size='large' celled fixed selectable compact inverted>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={4}>Item Name</Table.HeaderCell>
                        <Table.HeaderCell width={1}>Qty</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Cost</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Total</Table.HeaderCell>
                        <Table.HeaderCell width={1}></Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        
                        {this.state.buyingList.map((row, index) =>(
                            <Table.Row key={index}>
                                <Table.Cell>{row.name}</Table.Cell>
                                <Table.Cell> <TextField  type='number' value={row.qty} fullWidth variant='standard' size='small' onChange={(e) => {this.qtyHandle(e, row,index)}} InputProps={{style: {color: "white"}}}/></Table.Cell>
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
            
            </form>
            </div>
            
            </>
        )
    }
}

export default Buying