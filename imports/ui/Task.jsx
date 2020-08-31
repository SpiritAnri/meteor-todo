import React from 'react'
import classnames from 'classnames'

export const Task = ({
  task,
  onCheckBoxClick,
  onDeleteClick,
  onTogglePrivateClick,
}) => {
  const classes = classnames('task', {
    checked: Boolean(task.isChecked),
  })

  return (
    <li className={classes}>
      <button onClick={() => onDeleteClick(task)}>&times;</button>
      <button onClick={() => onTogglePrivateClick(task)}>
        {task.isPrivate ? 'Private' : 'Public'}
      </button>
      <input
        type='checkbox'
        checked={Boolean(task.isChecked)}
        onClick={() => onCheckBoxClick(task)}
        readOnly
      />
      <span>{task.text}</span>
    </li>
  )
}
