import './App.css';
import Header from './Components/Header'
import Item from './Pages/Item'
import About from './Pages/About'
import Home from './Pages/Home'
import Buying from './Pages/Buying'
import Receive from './Pages/Receive'
import POS from './Pages/POS'
import BuyingList from './Pages/BuyingList'
import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import PurchaseOrderDetail from './Pages/PurchaseOrderDetail';

class App extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
        <div className='App'>
      <Router>
      <Header/>
        <Switch>
          <Route path='/'  exact component={Home}/>
          <Route path='/buying' exact component={Buying}/>
          <Route path='/buyingList' exact component={BuyingList}/>
          <Route path='/buying/:purchase_order_number' exact component={PurchaseOrderDetail}/>
          <Route path='/item' exact component={Item}/>
          <Route path='/receive' exact component={Receive}/>
          <Route path='/pos' exact component={POS}/>
          <Route path='/about' exact component={About}/>
        </Switch>
      </Router>
        
        </div>
    )
  }
}

export default App;
