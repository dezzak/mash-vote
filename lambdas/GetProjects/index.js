'use strict';
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, ctx, callback) {

    var params = {
          TableName: 'Projects',

            KeyConditionExpression: "#event = :event",
                 ExpressionAttributeNames:{
            "#event": "event"
        },
                     ExpressionAttributeValues: {
            ":event":'test'
        }
    };

    docClient.query(params, function(err, data){
        if(err){
            callback(err, null);
        }else{
            callback(null, data);
        }
    });
}
