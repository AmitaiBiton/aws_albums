const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2', apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();


exports.handler = (event,context ,callback)=>{
    var arr = []
    var params = {
            Key:{
                "Key":event.Key
            },
            
            TableName:'albums'
        };
  // Call DynamoDB to read the item from the table
 
    console.log(params.Key)
    docClient.delete(params,function(err ,data){
    if (err){
        console.log("errrrror")
        callback(err,null)
    }
    else{
        console.log("sucsess")
        callback(null,data);
    }
       
    
    
  });
  let response = arr
  callback(null, response)
}
    