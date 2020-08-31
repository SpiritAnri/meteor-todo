import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import _ from 'lodash'
import { Task } from './Task'
import { Tasks } from '/imports/api/tasks'
import { TaskForm } from './TaskForm'
import { LoginForm } from './LoginForm'

const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call('tasks.setChecked', _id, !isChecked)
}

const togglePrivate = ({ _id, isPrivate }) => {
  Meteor.call('tasks.setPrivate', _id, !isPrivate)
}

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id)

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