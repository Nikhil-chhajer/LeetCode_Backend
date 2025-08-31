import dotenv from "dotenv"
dotenv.config();



type Serverconfig={
    PORT:Number,
    // DB_URL:string,
    PROBLEM_SERVICE:string,
    SUBMISSION_SERVICE:string,
    

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

    PORT:Number(process.env.PORT)||3002,
    // DB_URL:process.env.DB_URL||"mongodb://localhost:27017/lc_problem_db",
    PROBLEM_SERVICE:process.env.PROBLEM_SERVICE||"http:\\localhost:3030/api/v1",
    SUBMISSION_SERVICE:process.env.SUBMISSION_SERVICE||"http:\\localhost:3031/api/v1"
}