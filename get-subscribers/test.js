
const getSubscribers = require('./index').handler;

try {
    const event = {};
    const context = {};

    getSubscribers(event, context, (error, result) => {
        if (!!error)
            console.error('handlerError', error);

        else
            console.log('success', result);
    });
}
catch (moduleError) {
    console.error('moduleError', moduleError);
}
