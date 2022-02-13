import express from 'express'
import mongoose from 'mongoose'
import { StudentRoutes } from '../routes/studentRoute'
import { CommonRoutes } from '../routes/commonRoutes'
class App {
    public app: express.Application;
    private mongoUrl: string = process.env.MONGO_DB_URI || ""

    private studentRoutes: StudentRoutes = new StudentRoutes();

    private commonRoutes: CommonRoutes = new CommonRoutes();

    constructor () {
      this.app = express()
      this.config()
      this.mongoSetup()
      this.studentRoutes.route(this.app)
      this.commonRoutes.route(this.app)
    }

    private config (): void {
      // support application/json type post data
      this.app.use(express.json())
    }

    private async mongoSetup (): Promise<void> {
      await mongoose.connect(this.mongoUrl)
    }
}
export default new App().app
