import { Application, Request, Response } from 'express'
import { errorResponse, successResponse } from '../modules/common/response'
import NotFoundError from '../modules/errors/notFoundError'

export class CommonRoutes {
  public route (app: Application) {
    /* Route to check health of server */
    app.get('', (req: Request, res: Response) => {
      successResponse(200, 'Server is running', null, res)
    })

    /* Generic Not Found Response for all
           Routes that are not defined */
    app.use('*', (req: Request, res: Response) => {
      errorResponse(new NotFoundError(`Route Not Found with Url ${req.originalUrl} Method ${req.method}`), res)
    })

    /* Middleware to Catch Internal Errors
           Such as invalid JSON will throw Error
           at middleware */
    app.use((err: Error, req: Request, res: Response, next: any) => {
      errorResponse(err, res)
    })
  }
}
