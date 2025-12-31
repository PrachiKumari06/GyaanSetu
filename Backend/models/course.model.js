import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
       type:String,
        required:true,  
    },
    price:{
         type:Number,
        required:true,
    },
    image:{
        public_id:{
         type:String,
        required:true,
        },
        url:{
           type:String,
        required:true,  
        }
    },
    creatorId:{
        type:mongoose.Types.ObjectId,
        ref:"Admin",   //jo admin ne create kiya h course wo hi usse update ya delete kr paye 
        required:true,
    }
})
export const Course=mongoose.model("Course",courseSchema)  //yha orange wala "Course ke name se mongodb me store hoga "