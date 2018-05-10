import React, {Component} from 'react';
import './App.css';
import TaskList from "./components/TaskList/TaskList";
import AddTaskPopup from "./components/AddTaskPopup/AddTaskPopup";
import EditTaskPopup from "./components/EditTaskPopup/EditTaskPopup";

class App extends Component {
  state = {
    tasks: [],
    isFormVisible: false,
    currentForm: null, // 'add', 'edit'
    currentEditTask: null,
    showOnlyNotDoneEnabled: false,
    showOnlyDoneEnabled: false
  };

  addTask = (taskName, taskDescription, taskDueDate, taskPriority) => {
    this.setState(
      ({tasks}) => ({
        tasks: tasks.concat({
          id: tasks.length === 0 ? 1 : Math.max(...tasks.map(task => task.id)) + 1,
          name: taskName,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
          isDone: false
        })
      })
    )
  };

  removeTask = taskId => {
    this.setState(function (oldState) {
      return {
        tasks: oldState.tasks.filter(function (task) {
          return task.id !== taskId
        })
      }
    })
  };

  updateTask = (taskId, taskTitleText, taskDescription, taskDueDate, taskPriority) => {
    this.setState({
      tasks: this.state.tasks.map(
        task => task.id !== taskId ? task : {
          ...task,
          name: taskTitleText,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
        }
      )
    })
  };

  toggleTaskAttribute = attributeName => taskId => {
    this.setState({
      tasks: this.state.tasks.map(
        task => task.id !== taskId ? task : {
          ...task,
          [attributeName]: !task[attributeName],
        }
      )
    })
  };

  toggleShowAddTaskPopup = () => {
    this.setState({
      currentForm: this.state.currentForm !== 'add' ? 'add' : null
    })
  };

  toggleShowEditTaskPopup = (taskId = null) => {
    this.setState({
      currentEditTask: taskId,
      currentForm: this.state.currentForm !== 'edit' ? 'edit' : null
    })
  };

  toggleTaskDone = this.toggleTaskAttribute('isDone');

  displayForm = formType => {
    const options = {
      add: () => (
        <div>
          <AddTaskPopup
            addTask={this.addTask}
            toggleShowAddTaskPopup={this.toggleShowAddTaskPopup}
          />
        </div>
      ),
      edit: () => (
        <div>
          <h2>EditTaskPopup</h2>
          <EditTaskPopup
            task={this.state.tasks.find(task => task.id === this.state.currentEditTask)}
            updateTask={this.updateTask}
            toggleShowAddTaskPopup={this.toggleShowEditTaskPopup}
          />
        </div>
      )
    };
    return options[formType]()
  };

  render() {
    return (
      <div className="App">
        {this.state.currentForm === null
          ?
          <div>
            <TaskList
              tasks={this.state.tasks.filter(
                task => this.state.showOnlyNotDoneEnabled === false
                  ? true
                  : task.isDone === false
              ).filter(
                task => this.state.showOnlyDoneEnabled === false
                  ? true
                  : task.isDone === true
              )}
              removeTask={this.removeTask}
              toggleTaskDone={this.toggleTaskDone}
              toggleShowEditTaskPopup={this.toggleShowEditTaskPopup}
            />

            <nav className='nav-bottom'>
              {/* filters - bottom left */}
              <h3>Filtry</h3>

              <span>&nbsp;</span>
              {this.state.showOnlyDoneEnabled === false ?
                <button onClick={() => this.setState({
                  showOnlyDoneEnabled: true,
                  showOnlyNotDoneEnabled: false
                })}>Pokaż<br/>zrobione</button> :
                <button onClick={() => this.setState({
                  showOnlyNotDoneEnabled: true,
                  showOnlyDoneEnabled: false
                })}>Pokaż<br/>niezrobione</button>
              }

              <span>&nbsp;</span>
              <button onClick={() => this.setState({
                showOnlyNotDoneEnabled: false,
                showOnlyDoneEnabled: false
              })}>Pokaż<br/>wszystkie
              </button>

              {/* button - bottom right */}
              <span>&nbsp;</span>
              <button onClick={this.toggleShowAddTaskPopup}>Dodaj<br/>zadanie</button>
            </nav>
          </div>
          :
          this.displayForm(this.state.currentForm)
        }
      </div>
    );
  }

  componentDidMount() {
    const tasksAsText = localStorage.getItem('storedTasks');
    const tasksFromLocalStorage = JSON.parse(tasksAsText);
    this.setState({
      tasks: tasksFromLocalStorage || []
    })
  }

  componentDidUpdate() {
    const tasks = this.state.tasks;
    localStorage.setItem('storedTasks', JSON.stringify(tasks));
  }
}

export default App;
