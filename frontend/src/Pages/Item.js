import React, { useEffect, useState } from 'react'
import ItemForm from '../Components/ItemForm'

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
    }

}));



export default function Item() {
    const classes = useStyles();
    const [itemList, setItemList] = useState([])
    const [itemObj, setItem] = useState({name:'', barcode_number:'', cost:'', srp:''})
    const [itemFormStatus, setItemForm] = useState('Create')

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

    const handleSubmit = (e) =>{
        e.preventDefault()
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
            setItem({...itemObj, name:'', barcode_number:'', srp:'', cost:''})
        })
    }

    const itemCreate = (e) =>{
        setItem({...itemObj, [e.target.id]:e.target.value})
    }

    const handleClearForm = (e) =>{
        setItemForm('Create')
        setItem({...itemObj, name:'', barcode_number:'', cost:'', srp:''})
    }

    var timer
    const viewItemHandler = (e, item) => {
        clearTimeout(timer)
        if(e.detail === 1){
            timer = setTimeout(() => {
                setItem({...itemObj, name:item.name, barcode_number:item.barcode_number, cost:item.cost, srp:item.srp})
                setItemForm('View')
            }, 200)
        }
        else{
            setItemForm('Edit')
        }
        
        
    }
    
        return(
            <div className={classes.root}>
            
            <Grid container spacing={1}>
                <Grid item xs={7}> 
                <Paper className={classes.paper}>
                <TableContainer className={classes.table}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Barcode</TableCell>
                                <TableCell>Rate</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell width='10'>Modified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {itemList.map((item,key) =>(
                        <TableRow onClick={(e) => viewItemHandler(e, item)} key={item.id} hover>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>{item.barcode_number}</TableCell>
                           <TableCell>{item.cost}</TableCell>
                           <TableCell>{item.srp}</TableCell>
                           <TableCell>{item.modified}</TableCell>
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
                        <Typography variant="h1" style={{fontSize:30,textAlign:'left',borderRadius:5, color:'#333533',backgroundColor:'#ffd100'}} noWrap>Item {itemFormStatus}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField id='name' onChange={(e) => {itemCreate(e)}} fullWidth variant='outlined' value={itemObj.name} label='Name'></TextField>
                        </Grid>
                        <Grid item xs={8}>
                        <TextField id='barcode_number' onChange={(e) => {itemCreate(e)}} fullWidth variant='outlined' value={itemObj.barcode_number} label='Barcode'></TextField>
                        </Grid>
                        <Grid container item spacing={1}>
                        <Grid item xs={4}>
                        <TextField fullWidth id='cost' onChange={(e) => {itemCreate(e)}} type='number' value={itemObj.cost} variant='outlined' label='Buying'></TextField>
                        </Grid>
                        <Grid item xs={4}>
                        <TextField fullWidth id='srp' onChange={(e) => {itemCreate(e)}} type='number' value={itemObj.srp} variant='outlined' label='Selling'></TextField>
                        </Grid>
                        <Grid container item spacing={1}>
                        <Grid item xs={6}>
                            {itemFormStatus === 'Create' && (itemObj.name !== '' && itemObj.barcode_number !== '' && itemObj.cost !== '' && itemObj.srp !== '') ? (
                            <Button fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleSubmit(e)}>Submit</Button>
                            ):itemFormStatus === 'Edit' && (itemObj.name === '' || itemObj.barcode_number === '' || itemObj.cost === '' || itemObj.srp === '') ? (
                            <Button disabled fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleSubmit(e)}>Save</Button>
                            ):itemFormStatus === 'Edit' && (itemObj.name !== '' || itemObj.barcode_number !== '' || itemObj.cost !== '' || itemObj.srp !== '') ? (
                            <Button fullWidth size='large' variant='contained' color='primary' onClick={(e) => handleSubmit(e)}>Save</Button>
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
            </div>
        );
    }
