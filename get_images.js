
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({region: 'us-east-2', apiVersion: '2012-08-10'});

exports.handler = (event,context ,callback)=>{
  var arr = []
  var params = {
    TableName: 'albums' // evaluates to 'test-table',
      
  }
  
  // Call DynamoDB to read the item from the table
  dynamoDB.scan(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } 
    else {
            
      console.log(data.Count)
      for (var i =0; i<data.Count;i++){
        console.log(event.useremail);
        //if (Object.is(event.useremail['S'],data.Items[i].email['S'])){
          
          //console.log("Success", data.Items[0].image_source);
          arr.push(data.Items[i])
          
        //}
      }
    console.log("Images Count: "  ,arr.length)
    }
  });
  let response = arr
  callback(null, response)
}