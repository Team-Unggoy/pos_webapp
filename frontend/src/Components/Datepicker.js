import React from 'react';

class Datepicker extends React.Component{
    constructor(props){
        super(props)
        this.state={
            startDate: new Date()
        }

        this.handleDateChange = this.handleDateChange.bind(this)
    }

    componentDidMount(){
        this.formatDate(this.state.startDate)
    }


    formatDate(date){
            var year = date.getFullYear();
    
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
        
    
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var hour = (date.getHours()).toString();
            hour = hour.length > 1? hour :  hour;
            var minute = date.getMinutes().toString()
            minute = minute.length > 1 ?  minute: '0' + minute;
            var second = date.getSeconds().toString();
            second = second.length > 1 ?  second: '0' + second;
            this.setState({
                startDate:year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second
            })
    }


    handleDateChange = (event) =>{
        console.log(event.target.value);

        this.setState({
            startDate: event.target.value
        })
    }


    
    


    render(){


        return(
            <>
                <div>
                    <input className='date' type='datetime-local' onChange={this.handleDateChange} value={this.state.startDate}></input>
                </div>
            </> 
        )
    }
}

export default Datepicker