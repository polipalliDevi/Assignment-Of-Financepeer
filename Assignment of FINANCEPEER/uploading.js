const mongoose= require('mongoose')

const Schema=mongoose.Schema
//json file
const fs=require('fs')

const userScheme= new Schema({
    
    userId: {type:Number,required:true},
    id: {type:Number,required:true},
    title: {type:String,required:true},
    body: {type:String,required:true}
  }
)

const Data =mongoose.model("Data",userScheme)

async function uploadingdata(){
    await mongoose.connect('mongodb://localhost:27017/myAssignment');
    console.log('connected sucessfully to server ')


    
    
    console.log('connected sucessfully to server ')

    fs.readFile('./data.json','utf-8',async (err,jsonString)=> {
        if(err){
            console.log(err)
        }else {
            const element=JSON.parse(jsonString)
            await Data.create(element)
        }

    })


}



uploadingdata()
module.exports=Data