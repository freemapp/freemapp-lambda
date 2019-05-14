
const $aws = require('aws-sdk');
const $dynamo = new $aws.DynamoDB({
    region: 'us-east-2'
});

const fetchSubscribers = (filter, all, token) => {
    return $dynamo.scan({
        TableName: 'subscriber',
        ExclusiveStartKey: token
    }).promise()
        .then(response => {
            all = (all || []).concat(response.Items);

            if (!!response.LastEvaluatedKey)
                return fetchSubscribers(filter, all, response.LastEvaluatedKey);

            return Promise.resolve(all);
        })
        .then(rawSubscribers => {
            const mappedSubscribers = rawSubscribers.map(rawSubscriber => {
                var mappedSubscriber = Object.keys(rawSubscriber).reduce((object, key, index) => {
                    /** TYPES:
                     * S: String/Date
                     * N: Number
                     * BOOL: Boolean
                     * B: Binary
                     * SS/NS/BS: Set collection
                     */
                    if (!!rawSubscriber[key]["S"])
                        object[key] = rawSubscriber[key]["S"];
    
                    else if (!!rawSubscriber[key]["N"])
                        object[key] = rawSubscriber[key]["N"];
    
                    else if (!!rawSubscriber[key]["BOOL"])
                        object[key] = rawSubscriber[key]["BOOL"];
    
                    else if (!!rawSubscriber[key]["B"])
                        object[key] = rawSubscriber[key]["B"];
    
                    else if (!!rawSubscriber[key]["SS"])
                        object[key] = rawSubscriber[key]["SS"];
    
                    else if (!!rawSubscriber[key]["NS"])
                        object[key] = rawSubscriber[key]["NS"];
    
                    else if (!!rawSubscriber[key]["BS"])
                        object[key] = rawSubscriber[key]["BS"];

                    return object;
                }, { });

                return mappedSubscriber;
            });

            return Promise.resolve(mappedSubscribers);
        });
};

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    fetchSubscribers({})
        .then(subscribers => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(subscribers)
            };

            callback(null, response);
        })
        .catch(dataError => {
            const response = {
                statusCode: 500,
                body: JSON.stringify(dataError)
            };

            callback(response);
        });
};
