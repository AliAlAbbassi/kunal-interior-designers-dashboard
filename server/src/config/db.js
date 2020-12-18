import { connect } from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

dotenv.config()

const connectDB = async () => {
  const conn = await connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

export default connectDB
