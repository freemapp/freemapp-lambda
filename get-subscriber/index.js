
const $aws = require('aws-sdk');
const $dynamo = new $aws.DynamoDB({
    region: 'us-east-2'
});

const fetchSubscriber = (subscriberid) => {
    return $dynamo.getItem({
        TableName: 'subscriber',
        Key: {
            subscriberid: { 'S': subscriberid }
        }
    }).promise()
        .then(response => {
            var rawSubscriber = response.Item;
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

            return Promise.resolve(mappedSubscriber);
        });
};

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    var subscriberid = event.pathParameters.subscriberid;

    fetchSubscriber(subscriberid)
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
