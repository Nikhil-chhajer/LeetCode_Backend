import mongoose, { Document } from "mongoose";
export enum SubmissionStatus {
    PENDING = "pending",
    COMPILING = "compiling",
    ACCEPTED="accepted",
    WRONG_ANSWER="wrong_answer"
}
export enum SubmissionLanguage {
    CPP = "cpp",
    PYTHON = "python"
}
export interface ISubmission extends Document {
    problemId: string,
    code: string,
    language: SubmissionLanguage,
    status: SubmissionStatus,
    createdAt: Date,
    updatedAt: Date
}
export interface ISubmissionData {
    testCaseId: string;
    status: string;
}
const SubmissionSchema = new mongoose.Schema<ISubmission>({
    problemId: {
        type: String,
        required: [true, "Prolem Id is required"]
    },
    code: {
        type: String,
        required: [true, "code is required"]
    },
    language: {
        type: String,
        required: [true, "language is required"],
        enum: Object.values(SubmissionLanguage)
    },
    status: {
        type: String,

        required: [true, "Status is required"],
        enum: Object.values(SubmissionStatus),
        default:SubmissionStatus.PENDING
    }
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
SubmissionSchema.index({status:1,createdAt:-1});
export const Submission=mongoose.model<ISubmission>("Submission",SubmissionSchema)