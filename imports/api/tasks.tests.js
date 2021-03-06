import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { assert } from 'chai'

import { Tasks } from './tasks'

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id()
      let taskId

      beforeEach(() => {
        Tasks.remove({})

        taskId = Tasks.insert({
          text: 'Test Task',
          createdAt: new Date(),
          owner: userId,
          username: 'meteorite',
        })
      })

      it('can delete owned task', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove']

        const invocation = { userId }

        deleteTask.apply(invocation, [taskId])

        assert.equal(Tasks.find().count(), 0)
      })
    })
  })
}
