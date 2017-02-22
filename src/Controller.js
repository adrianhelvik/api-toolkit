import { Router } from 'express'

const tryCatch = Symbol('tryCatch')
const handleError = Symbol('handleError')
const createStaticRouteHandlers = Symbol('createStaticRouteHandlers')
const routeHandlerFactory = Symbol('routeHandlerFactory')
const privateModel = Symbol('model')

class Controller {
  static get model() {
    /*
    if (! this[privateModel]) {
      throw Error('[Controller]: No model set. Assign the model as a static member')
    }
    */
    return this[privateModel]
  }

  static set model(model) {
    this[privateModel] = model
  }

  constructor(req, res, model) {
    this.req = req
    this.res = res
    this.model = model
    this.startTime = new Date()
  }

  async create() {
    await this.model.create(this.req.body)
    this.res.status(201).json({
      success: true,
      time: new Date() - this.startTime
    })
  }

  async all() {
    const rawWhere = this.req.query.where
    const where = rawWhere
      ? JSON.parse(rawWhere)
      : null

    this.res.json({
      data: await this.model.all(where),
      success: true,
      time: new Date() - this.startTime
    })
  }

  async one() {
    const { req, res, model } = this

    res.json({
      data: await model.one(req.params.id),
      success: true,
      time: new Date() - this.startTime
    })
  }

  async destroy() {
    const { req, res, model } = this
    const { id } = req.params

    await model.destroy(id)
    res.status(202).json({
      success: true,
      time: new Date() - this.startTime
    })
  }

  async update() {
    const { req, res, model } = this
    const { id } = req.params

    const response = await model.update(id, req.body)

    res.status(202).json({
      success: true,
      time: new Date() - this.startTime
    })
  }

  /**
   * @private
   */
  async [handleError](error) {
    console.log('Called error handler')
    this.res.status(error.httpStatusCode || 500)
      .json({
        success: false,
        reason: error.message
      })
  }

  /**
   * Create a router for CRUD operations
   *
   * Method | Route            | Handler
   * ----------------------------------------
   * GET    | /{baseRoute}     | Controller.all
   * POST   | /{baseRoute}     | Controller.create
   * GET    | /{baseRoute}/:id | Controller.one
   * PUT    | /{baseRoute}/:id | Controller.update
   * DELETE | /{baseRoute}/:id | Controller.destroy
   */
  static resource(baseRoute) {
    const router = new Router()

    if (process.env.NODE_ENV !== 'test') {
      console.log(`Registering routes for ${baseRoute}:`.green)
    }

    router.get(baseRoute, this.all.bind(this))
    router.get(baseRoute + '/:id', this.one.bind(this))
    router.post(baseRoute, this.create.bind(this))
    router.delete(baseRoute + '/:id', this.destroy.bind(this))
    router.put(baseRoute + '/:id', this.update.bind(this))

    return router
  }

  /**
   * @private
   */
  static [createStaticRouteHandlers]() {
    // TODO: Find route methods automatically
    const routeMethods = ['create', 'all', 'one', 'destroy', 'update']

    for (const methodName of routeMethods) {
      this[methodName] = this[routeHandlerFactory](methodName)
    }
  }

  /**
   * @private
   */
  static [routeHandlerFactory](methodName) {
    async function routeHandler(req, res) {
      const instance = new this(req, res, this.model)
      try {
        await instance[methodName]()
      } catch (error) {
        console.error(error.message.red)
        console.error(error)
        instance[handleError](error)
      }
    }

    return routeHandler
  }
}

//
// Create a static alias for all route methods,
// which calls the errorHandler method of the
// instance if an error occurs.
//

Controller[createStaticRouteHandlers]()

export default Controller
