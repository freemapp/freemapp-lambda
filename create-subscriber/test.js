
const createSubscriber = require('./index').handler;

try {
    const event = {
        'body': JSON.stringify({
            subscriberid: '02cf94db-dca7-45c3-b3af-1127151cdaa4',
            email: 'jannie@pannie.co.za'
        })
    };
    const context = {};

    createSubscriber(event, context, (error, result) => {
        if (!!error)
            console.error('handlerError', error);

        else
            console.log('success', result);
    });
}
catch (moduleError) {
    console.error('moduleError', moduleError);
}
