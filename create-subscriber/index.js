
const $aws = require('aws-sdk');
const $dynamo = new $aws.DynamoDB({
    region: 'us-east-2'
});

const createSubscriber = (user) => {
    var mappedSubscriber = Object.keys(user).reduce((mapper, key) => {
        var type = 'S';
        var value = user[key];

        if (typeof value === 'number' || typeof value === 'bigint')
            type = 'N';

        else if (typeof value === 'string')
            type = 'S';

        else if (!isNaN(Date.parse(value)))
            type = 'S';

        else if (typeof value === 'boolean')
            type = 'BOOL';

        else if (typeof value === 'object')
            throw 'Object/Array';

        else
            throw 'Invalid type';

        mapper[`${ key }`] = { [type]: value };
        
        return mapper;
    }, { });

    // mappedSubscriber.subscriberid = { 'S': $uuid() };

     return $dynamo.putItem({
        TableName: 'subscriber',
        Item: mappedSubscriber,
        // ExpressionAttributeNames: attributeNames,
        // ExpressionAttributeValues: attributeValues,
        // ReturnValues: 'ALL_NEW'
    }).promise().then(response => Promise.resolve(user));
};

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    var user = JSON.parse(event.body);
    
    // createUser(user)
    //     .then(user => createSubscriber(subscriber))
    createSubscriber(user)
        .then(result => {
            var response = {
                statusCode: 200,
                body: JSON.stringify(result)
            };

            callback(null, response);
        })
        .catch(error => {
            const response = {
                statusCode: 500,
                body: error.message || JSON.stringify(error)
            };

            callback(response);
        })
};
