import Controller from '../src/Controller'
import express from 'express'
import request from 'supertest'
import bodyParser from 'body-parser'

describe('Controller', () => {
  let app
  let Ctrl
  beforeEach(() => {
    Ctrl = class extends Controller {
      static model = {
        one: jest.fn(),
        all: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
      }
    }
    app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(Ctrl.resource('/model-name'))
  })

  describe('.one', () => {
    it('calls instance.model.one with the passed id', (done) => {
      request(app)
        .get('/model-name/1')
        .end((err, res) => {
          expect(Ctrl.model.one).toBeCalledWith('1')
          done()
        })
    })
  })

  describe('.all', () => {
    it('calls instance.model.all', (done) => {
      request(app)
        .get('/model-name')
        .end((err, res) => {
          expect(Ctrl.model.all).toBeCalledWith(null)
          done()
        })
    })
  })

  describe('.update', () => {
    it('calls instance.model.update', (done) => {
      const changes = { some: 'changes', to: 'be made' }

      request(app)
        .put('/model-name/1')
        .send(changes)
        .end((err, res) => {
          expect(Ctrl.model.update).toBeCalledWith('1', changes)
          done()
        })
    })
  })

  describe('.destroy', () => {
    it('calls instance.model.destroy', (done) => {
      request(app)
        .delete('/model-name/1')
        .end((err, res) => {
          expect(Ctrl.model.destroy).toBeCalledWith('1')
          done()
        })
    })
  })
})

