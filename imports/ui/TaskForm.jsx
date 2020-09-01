import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { tasksInsert } from '../api/tasks'

export const TaskForm = () => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!text) return
    tasksInsert.call({ text }, (err, res) => {
      if (err) {
        alert(err)
      } else {
        console.log('ok')
      }
    })

    setText('')
  }

  return (
    <form className='task-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Type to add new task'
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button type='submit'>Add task</button>
    </form>
  )
}
