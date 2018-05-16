import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskDueDay.css';

class TaskDueDay extends Component {
  state = {
    dueDate: this.props.dueDate
  };

  handleChange = date => {
    this.props.handleDate(date);
    this.setState({
      dueDate: date
    });
  };

  render() {
    return (
      <DatePicker className='date-picker'
        selected={moment(this.state.dueDate) || moment()}
        onChange={this.handleChange}
        withPortal
        dateFormat="DD-MM-YYYY"
      />
    )
  }
}

export default TaskDueDay