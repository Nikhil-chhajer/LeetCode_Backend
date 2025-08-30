import Redis from "ioredis";


const redisConfig={
    host:process.env.REDIS_HOST||"localhost",
    port:Number(process.env.REDIS_PORT)||6379,
    maxRetriesPerRequest:null
}


export const redisClient=new Redis(redisConfig);
redisClient.on('error',(err)=>{
    console.log("redis not connected",err)
})
redisClient.on('connect',()=>{
    console.log("redis connected")
})
export const createNewRedisConnection=()=>{
    return new Redis(redisConfig)
}