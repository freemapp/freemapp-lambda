
const updateSubscriber = require('./index').handler;

try {
    const event = {
        'pathParameters': {
            'subscriberid': 'c211f46f-89f5-4a47-bc08-fde2dad0d8f3'
        },
        'body': '{"subscriberid":"c211f46f-89f5-4a47-bc08-fde2dad0d8f3","email":"kraai@lag.co.za","name":"Freek Comedy","bio":"Maak my breek, Freek"}'
    };
    const context = {};

    updateSubscriber(event, context, (error, result) => {
        if (!!error)
            console.error('handlerError', error);

        else
            console.log('success', result);
    });
}
catch (moduleError) {
    console.error('moduleError', moduleError);
}
