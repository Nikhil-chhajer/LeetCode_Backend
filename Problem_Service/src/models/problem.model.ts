import mongoose,{Document} from "mongoose";

interface ITestcase{
    input:string,
    output:string

}
export interface IProblem extends Document{
    title:string,
    description:string,
    difficulty:"easy"|"medium"|"hard";
    createdAt:Date,
    updatedAt:Date,
    editorial?:string,
    testcases:ITestcase[];

}
const testSchema=new mongoose.Schema<ITestcase>({
    input :{
        type:String,
        required:[true,"Input is required"],
        trim:true
    },
    output:{
        type:String,
        required:[true,"Output is required"],
        trim:true
    }
},{
    // _id:false if we want to hide the id in the problem schema testacase we can do _id:false 
})
const problemSchema =new mongoose.Schema<IProblem>({
    title:{
        type:String,
        required:[true,"title is required"],
        maxLength:[100,"tilte must be less than 100 characters"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"description is required"],
        trim:true
    },
    difficulty:{
        type:String,
        enum:{
            values:["easy","medium","hard"],
            message:"invalid difficulty level",
        },
        default:"easy",
        required:[true,"Difficulty level is required"]
    },
    editorial:{
        type:String,
        trim:true
    },
    testcases:[testSchema]
},{
    timestamps:true,
    toJSON: {
        transform: (_, record) => {
            delete (record as any).__v; // delete __v field
            record.id = record._id; // add id field
            delete record._id; // delete _id field
            return record;
        }
    }
})
problemSchema.index({title:1},{unique:true}),
problemSchema.index({difficulty:1})
export const Problem=mongoose.model<IProblem>("Promblem",problemSchema)