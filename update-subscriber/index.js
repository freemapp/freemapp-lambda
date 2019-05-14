
const $aws = require('aws-sdk');
const $dynamo = new $aws.DynamoDB({
    region: 'us-east-2'
});

const updateSubscriber = (subscriberid, subscriber) => {
    var writableAttributes = Object.keys(subscriber)
        .filter(key => !['subscriberid', 'email'].some(exception => exception === key))
    var updateExpressions = writableAttributes.reduce((updates, key) => {
        updates.push(`#${ key }=:${ key }`);
        
        return updates;
    }, []).join(',');
    var attributeNames = writableAttributes.reduce((attributes, key) => {
        attributes[`#${ key }`] = key;
        
        return attributes;
    }, { });
    var attributeValues = writableAttributes.reduce((attributes, key) => {
        var type = 'S';
        var value = subscriber[key];

        if (typeof value === 'number' || typeof value === 'bigint')
            type = 'N';

        else if (typeof value === 'string')
            type = 'S';

        else if (Date.parse(value) !== NaN)
            type = 'S';

        else if (typeof value === 'boolean')
            type = 'BOOL';

        else if (typeof value === 'object')
            throw 'Object/Array';

        else
            throw 'Invalid type';

        attributes[`:${ key }`] = { [type]: value };
        
        return attributes;
    }, { });

    return $dynamo.updateItem({
        TableName: 'subscriber',
        Key: {
            subscriberid: { 'S': subscriberid }
        },
        UpdateExpression: 'SET ' + updateExpressions,
        ExpressionAttributeNames: attributeNames,
        ExpressionAttributeValues: attributeValues,
        ReturnValues: 'ALL_NEW'
    }).promise();
};

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    var subscriberid = event.pathParameters.subscriberid;
    var subscriber = JSON.parse(event.body);
    
    updateSubscriber(subscriberid, subscriber)
        .then(result => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(result.Attributes)
            };

            callback(null, response);
        })
        .catch(error => {
            const response = {
                statusCode: 500,
                body: JSON.stringify(error)
            };

            callback(response);
        });
};
