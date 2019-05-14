
const getSubscriber = require('./index').handler;

try {
    const event = {
        pathParameters: { subscriberid: 'c211f46f-89f5-4a47-bc08-fde2dad0d8f3' }
    };
    const context = {};

    getSubscriber(event, context, (error, result) => {
        if (!!error)
            console.error('handlerError', error);

        else
            console.log('success', result);
    });
}
catch (moduleError) {
    console.error('moduleError', moduleError);
}
