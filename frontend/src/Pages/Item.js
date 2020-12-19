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

import orderBy from "lodash/orderBy";

class Item extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            itemList:[],
            posList:[],
            itemCreate:{
                id:null,
                name:'',
                cost:0,
                srp:0,

            },
            page:0,
            rowsPerPage:10,
            query:'',
            columnToQuery: 'ItemName',
            showModal: false,

        }
        this.fetchItem = this.fetchItem.bind(this)
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addToPosTable = this.addToPosTable.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
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
        console.log('added item', i, name ,srp)
        const obj = {'name':name, 'srp':srp, 'qty':i}
        this.setState({
            posList:[
                ...this.state.posList,
                obj,
            ]
            
        })
        console.log(this.state.posList)
        
    }

    handleOpen = () =>{
        this.setState({
            showModal:true,
        })  
    }

    handleClose = () =>{
        this.setState({
            itemCreate:{
                id:null,
                name:'',
                srp:0,
                cost:0,
            },
            showModal:false,
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
                    srp:0,
                    cost:0,
                }
            })
        })
    }
    


    render(){
        var items = this.state.itemList
        console.log(items)
        return(
        <div className="pos-main-content">
        <div className='grid-container'>
        <TableContainer>

        <TextField label="Item Search" style={{marginTop:5, marginBottom:5}} className={this.props.toggle ? 'item-search active' : 'item-search' } variant="outlined" value={this.state.value} onChange={e => this.setState({query:e.target.value}) }/>
            
        <Table aria-label="sticky table">
        <TableHead style={{backgroundColor:'#139bf7', borderRadius:50, width:50, border:0.5,}}>
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={items.length}
        rowsPerPage={this.state.rowsPerPage}
        page={this.state.page}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
        <Button style={{marginLeft:250}} variant="contained" color="primary" onClick={this.handleOpen}>
            Create Item
        </Button>
        
        <Dialog open={this.state.showModal} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Item</DialogTitle>
        <DialogContent >
          <TextField autoFocus onChange={(e) =>this.handleCreate(e)} margin="normal" id="name" value={this.state.itemCreate.name} placeholder="Item Name" label="Item Name" type="name" fullWidth variant="standard"/>
          <TextField autoFocus onChange={(e) =>this.handleCreate(e)} margin="normal" id="cost" value={this.state.itemCreate.cost}label="Item Cost" type="name" fullWidth variant="standard"/>
          <TextField autoFocus onChange={(e) => this.handleCreate(e)} margin="normal" id="srp" value={this.state.itemCreate.srp} label="Item SRP" type="srp" fullWidth variant="standard"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button onClick={this.handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      </TableContainer>

    <TableContainer style={{marginTop: 66, maxHeight:'100%'}}>
      <Table stickyHeader aria-label="sticky table" className='class-table' aria-label="spanning table">
      <TableHead  style={{backgroundColor:'#139bf7', borderRadius:50, width:50, border:0.5}}>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.posList.reverse().map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.srp}</TableCell>
              <TableCell align="right">{row.srp * row.qty}</TableCell>
            </TableRow>
          ))}

          <TableRow stickyHeader>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell align="right">0</TableCell>
            <TableCell align="right">0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">0</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

            </div>
        </div>
        
        )
    }
}

export default Item