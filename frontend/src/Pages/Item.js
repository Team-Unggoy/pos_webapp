import React from 'react'
import '../App.css'
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MUIDataTable from "mui-datatables";

class Item extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            itemList:[],
            posList:[],
            filteredData: [],
            itemCreate:{
                id:null,
                name:'',
                cost:'',
                srp:'',

            },
            page:0,
            rowsPerPage:10,
            query:'',
            searchInput:'',
            itemCreateModal: false,
            posPaymentModal: false,
            addToPosTable:0, 
            totalPayment:0,
            payment:'',
            change:0,
            

        }
        this.fetchItem = this.fetchItem.bind(this)
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addToPosTable = this.addToPosTable.bind(this)
        this.handleItemCreateOpen = this.handleItemCreateOpen.bind(this)
        this.handleItemCreateClose = this.handleItemCreateClose.bind(this)
        this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
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
        console.log('fetching...')
        var url = 'http://127.0.0.1:8000/api/item-list/'

        fetch(url)
        .then(response => response.json())
        .then(data => this.setState({
            itemList:data
        }))
    }


    handleChangePage(event, newPage){
        console.log('testing')
        this.setState({
            page:newPage,
        })
    }

    handleChangeRowsPerPage(event){
        this.setState({
            rowsPerPage:event.target.value,
        })
    }

    handleChange(event){
        console.log('testing', event.target.value)
        this.setState({
            columnToQuery:event.target.value
        })
    }

    addToPosTable(i, name, srp){
        const obj = {'name':name, 'srp':srp, 'total':srp * i,  'qty':i}
        this.setState({
            posList:[
                ...this.state.posList,
                obj,
            ],

            totalPayment: this.state.totalPayment + obj.total
            
        })  
    }

    getChange = (event) =>{
      this.setState({
        payment:event.target.value,
        change: event.target.value - this.state.totalPayment 
      })
    }

    handlePaymentOpen = () => {
      this.setState({
        posPaymentModal:true,
      })
    }

    handlePaymentClose = () =>{
      this.setState({
        posPaymentModal:false,
        payment:'',
        change:''
      })
    }

    handlePaymentSubmit = (event) =>{
      console.log(this.state.posList)
    }


    handleItemCreateOpen = () =>{
        this.setState({
            itemCreateModal:true,
        })  
    }
    handleItemCreateClose = () =>{
        this.setState({
            itemCreate:{
                id:null,
                name:'',
                srp:'',
                cost:'',
            },
            itemCreateModal:false,
        })
    }

    handleCreate(event){

        this.setState({
            itemCreate:{
                ...this.state.itemCreate,
                [event.target.id]:event.target.value,

            }
        })
    }


    handleSubmit(e){
        e.preventDefault()
        var csrftoken = this.getCookie('csrftoken')
        var url = 'http://127.0.0.1:8000/api/item-create/'
        fetch(url,{
            method: 'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            'body': JSON.stringify(this.state.itemCreate)
        }).then((response) => {
            this.fetchItem()
            this.setState({
                itemCreate:{
                    id:null,
                    name:'',
                    srp:'',
                    cost:'',
                }
            })
        })
    }
    


    render(){
      const columns = [
        {
          name: 'name',
          label: 'Item Name',
          options:{
            filter: true,
            sort: true,
          }
        },
        {
          name: 'srp',
          label: 'SRP',
          options:{
            filter:true,
            sort:true,
          }
        },
        {
          name: 'balance',
          labal: 'Balance',

        },
          
      ]

      const options = {
        filterType: "dropdown",
        download:false,
        selectableRows:'none',
        print:false,
        rowsPerPage:10,
        onRowClick: (rowData, rowMeta) => {
          const obj = {name: rowData[0], srp:rowData[1]}
          this.setState({
            posList:[
              ...this.state.posList,
              obj,
            ]
          })
        }


      }
        var items = this.state.itemList
        return(
        <>
        <div className='grid-container'>
        <div className='grid-item'>

        <MUIDataTable
      title={"Item List"}
      data={items}
      columns={columns}
      options={options}
    />

        {/* <TableContainer>

        <TextField label="Item Search" style={{marginTop:5, marginBottom:5}} className={this.props.toggle ? 'item-search active' : 'item-search' } variant="outlined" value={this.state.searchInput || ''} onChange={this.handleSearch}/>
            
        <Table aria-label="sticky table">
        <TableHead style={{backgroundColor:'#139bf7', borderRadius:50, width:50, border:0.5}}>
          <TableRow >
            <TableCell align="left">Items Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='table-row'>
          {items.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((item, index) => (
            <TableRow key={index}  onClick={() => this.addToPosTable(index, item.name, item.srp)}>
              <TableCell component="th" scope="row">{item.name}</TableCell>
              <TableCell align="right">{item.srp}</TableCell>
              <TableCell align="right">{item.srp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    <TablePagination
        rowsPerPageOptions={[10, 20]}
        component="div"
        count={items.length}
        rowsPerPage={this.state.rowsPerPage}
        page={this.state.page}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        

      </TableContainer> */}
        
        </div>

        <div className='grid-item'>

            <div>
              
    <TableContainer >
      <Table aria-label="spanning table">
      <TableHead className='class-table'>
          <TableRow>
            <TableCell>Desc.</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.posList.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.srp}</TableCell>
              <TableCell align="right">{row.total}</TableCell>
            </TableRow>
          ))}

      </TableBody>
        </Table>
        </TableContainer>

          </div>
          </div>        
          </div>
          <Button variant="contained" color="primary" onClick={this.handleItemCreateOpen}>
            Create Item
          </Button>

            <div className='pos-item-summary'>
            <Button onClick={this.handlePaymentSubmit} style={{marginLeft:20, height:200, width:120, backgroundColor:'#3595b5', color:'white', fontSize:25}} variant="outlined" size='large'>
                Submit
            </Button>
            </div>
          
            <div className='pos-item-summary'>
              <TextField id="totalpayment" type='number' onClick={this.getTotal} label="Total" value={this.state.totalPayment} InputProps={{readOnly: true,}} variant="outlined"/>
              <br></br>
              <TextField id='payment' onChange={(e) =>this.getChange(e)} placeholder='0' value={this.state.payment} type='number' margin='normal' label='Enter Amount' variant='outlined'/>
              <br></br>
              <TextField id='change' type='number' margin='normal' label='Change' variant='outlined' InputProps={{readOnly:true}} value={this.state.change}/>
            </div>

            




        <Dialog open={this.state.itemCreateModal} onClose={this.handleItemCreateClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Item</DialogTitle>
        <DialogContent >
          <TextField autoFocus onChange={(e) =>this.handleCreate(e)} margin="normal" id="name" value={this.state.itemCreate.name} placeholder="Item Name" label="Item Name" type="name" fullWidth variant="outlined"/>
          <TextField autoFocus onChange={(e) =>this.handleCreate(e)} margin="normal" id="cost" placeholder='0' value={this.state.itemCreate.cost}label="Item Cost" type="name" fullWidth variant="outlined"/>
          <TextField autoFocus onChange={(e) => this.handleCreate(e)} margin="normal" id="srp" placeholder='0' value={this.state.itemCreate.srp} label="Item SRP" type="srp" fullWidth variant="outlined"/>
        </DialogContent>
        <DialogActions>
          <Button variant='contained'  onClick={this.handleItemCreateClose}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={this.handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>


      
        </>
        
        )
    }
}

export default Item 