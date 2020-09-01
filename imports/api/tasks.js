import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Tasks = new Mongo.Collection('tasks')

export const tasksInsert = new ValidatedMethod({
  name: 'tasks.insert1',

  validate: new SimpleSchema({
    text: { type: String },
  }).validator(),

  run({ text }) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.')
    }
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      isChecked: false,
      username: Meteor.users.findOne(this.userId).username,
    })
  },
})

export const tasksRemove = new ValidatedMethod({
  name: 'tasks.remove',

  validate: new SimpleSchema({
    taskId: { type: String },
  }).validator(),

  run({ taskId }) {
    const task = Tasks.findOne(taskId)

    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.')
    }

    Tasks.remove(taskId)
  },
})

export const tasksSetChecked = new ValidatedMethod({
  name: 'tasks.setChecked',

  validate: new SimpleSchema({
    taskId: { type: String },
    isChecked: { type: Boolean },
  }).validator(),

  run({ taskId, isChecked }) {
    const task = Tasks.findOne(taskId)

    if (task.isPrivate && task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.')
    }

    Tasks.update(taskId, {
      $set: {
        isChecked,
      },
    })
  },
})

export const tasksSetPrivate = new ValidatedMethod({
  name: 'tasks.setPrivate',

  validate: new SimpleSchema({
    taskId: { type: String },
    isPrivate: { type: Boolean },
  }).validator(),

  run({ taskId, isPrivate }) {
    const task = Tasks.findOne(taskId)

    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.')
    }

    Tasks.update(taskId, {
      $set: {
        isPrivate,
      },
    })
  },
})

if (Meteor.isServer) {
  Meteor.publish('tasks', function () {
    return Tasks.find({
      $or: [{ private: { $ne: true } }, { owner: this.userId }],
    })
  })
}
