import dotenv from 'dotenv'
dotenv.config();



type Serverconfig={
    PORT:Number,
    DB_URL:string
}
type DBConfig={
    DB_HOST:string,
    DB_USER:string,
    DB_PASSWORD:string,
    DB_NAME:string
}
export const dbConfig:DBConfig={
    DB_HOST:process.env.DB_HOST||'localhost',
    DB_USER:process.env.DB_USER||'root',
    DB_PASSWORD:process.env.DB_PASSWORD||'9214',
    DB_NAME:process.env.DB_NAME||'test_db'
}
export const serverconfig:Serverconfig={

    PORT:Number(process.env.PORT)||3001,
    DB_URL:process.env.DB_URL||"mongodb://localhost:27017/lc_problem_db"
}