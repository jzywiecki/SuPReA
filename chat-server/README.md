# How to run?

## Step 1
Create a .env file in the root directory of project and fill it with the following information:
```
MONGODB_URL=mongodb+srv://your_url
DATABASE_NAME=database_name
```

## Step 2
```
npm install
npm start
```
You should execute these commands in the root project directory.

# More information

## CORS
If you cannot establish a connection to the chat server due to an error:
> CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

Try: [Allow-Control-Allow-Origin](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en&fbclid=IwZXh0bgNhZW0CMTAAAR0dHWnBaQuzyMOTM469v7nUEcAZOHRhZuLb9y677QQLr7udO46IPWeAI4c_aem_LGhe5_nOVvZy6WjVm3zYNQ&pli=1) (only for test environments)

## Delivery Guarantee
#### Client side:
- No delivery guarantee. (At most one attempt to send the message)
- Order guaranteed
#### Server side:
- Guarantees the delivery of all pending messages to the client when it is connected to the network.
- Order guaranteed