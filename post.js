let count = 0
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({region: 'us-east-2', apiVersion: '2012-08-10'});



exports.handler = (event,context ,callback)=>{
    
   
    var params = {
        Item: {
            "Key": {"S": event.Item['Key']},
            "date_client":{"S": event.Item['date_client']},
            "email": {"S":event.Item['email']},
            "image_source": {"S":event.Item['link']}
                
                
        },
        TableName:'albums'
    };
    
    
    
    
    dynamoDB.putItem(params,function(err ,data){
        if (err){
            console.log(params)
            console.log("errrrror")
            callback(err,null)
        }
        else{
            console.log("sucsess")
            callback(null,data);
        }
    });
    
}