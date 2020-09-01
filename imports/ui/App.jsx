import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import _ from 'lodash'
import { Task } from './Task'
import {
  Tasks,
  tasksRemove,
  tasksSetChecked,
  tasksSetPrivate,
} from '/imports/api/tasks'
import { TaskForm } from './TaskForm'
import { LoginForm } from './LoginForm'

const toggleChecked = ({ _id, isChecked }) => {
  tasksSetChecked.call({ taskId: _id, isChecked: !isChecked }, (err, res) => {
    if (err) {
      alert(err)
    }
  })
}

const togglePrivate = ({ _id, isPrivate }) => {
  tasksSetPrivate.call({ taskId: _id, isPrivate: !isPrivate }, (err, res) => {
    if (err) {
      alert(err)
    }
  })
}

const deleteTask = ({ _id }) =>
  tasksRemove.call({ taskId: _id }, (err, res) => {
    if (err) {
      alert(err)
    }
  })

export const App = () => {
  const filter = {}

  const [hideComleted, setHideCompleted] = useState(false)

  if (hideComleted) {
    _.set(filter, 'isChecked', false)
  }

  const { tasks, incompleteTasksCount, user } = useTracker(() => {
    Meteor.subscribe('tasks')

    return {
      tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
      incompleteTasksCount: Tasks.find({ isChecked: { $ne: true } }).count(),
      user: Meteor.user(),
    }
  })

  if (!user) {
    return (
      <div className='simple-todos-react'>
        <LoginForm />
      </div>
    )
  }

  return (
    <div className='simple-todos-react'>
      <h1>Todo List ({incompleteTasksCount})</h1>

      <div className='filters'>
        <label>
          <input
            type='checkbox'
            readOnly
            checked={Boolean(hideComleted)}
            onClick={() => setHideCompleted(!hideComleted)}
          />
          Hide Completed
        </label>
      </div>

      <ul className='tasks'>
        {tasks.map(task => (
          <Task
            key={task._id}
            task={task}
            onCheckBoxClick={toggleChecked}
            onDeleteClick={deleteTask}
            onTogglePrivateClick={togglePrivate}
          />
        ))}
      </ul>

      <TaskForm />
    </div>
  )
}
