// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.

// const path = require('path');

// const dotenv = require('dotenv');
// // Import required bot configuration.
// const ENV_FILE = path.join(__dirname, '.env');
// dotenv.config({ path: ENV_FILE });

// const restify = require('restify');

// // Import required bot services.
// // See https://aka.ms/bot-services to learn more about the different parts of a bot.
// const {
//     CloudAdapter,
//     ConfigurationBotFrameworkAuthentication,
//     BotFrameworkAdapter
// } = require('botbuilder');

// // This bot's main dialog.
// const { EchoBot } = require('./bot');

// // Create HTTP server
// const server = restify.createServer();
// server.use(restify.plugins.bodyParser());

// server.listen(process.env.port || process.env.PORT || 3978, () => {
//     console.log(`\n${ server.name } listening to ${ server.url }`);
//     console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
//     console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
// });

// // // sameple code of course is used BotFrameworkAdapter
// // const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({
// //     appId: '55063df4-14e0-4e6f-92cf-509c47bd23f9', // The client ID of the user-assigned managed identity.
// //     appPassword: "", // Not applicable. Leave this blank for a user-assigned managed identity bot.
// //     tenantId: '87a45d18-f2c7-4012-839e-c9cce6cd0aa4' // The tenant ID of the user-assigned managed identity.
// // });

// // // Create adapter.
// // // See https://aka.ms/about-bot-adapter to learn more about how bots work.
// // const adapter = new CloudAdapter(botFrameworkAuthentication);

// const adapter = new BotFrameworkAdapter({
//     appId: '6a0da5fa-6c38-4025-8d06-f2fa5795b5f0',
//     appPassword: 'b43300eb-2e3f-4902-ac09-eb7defb05b34'
// });

// // Catch-all for errors.
// const onTurnErrorHandler = async (context, error) => {
//     // This check writes out errors to console log .vs. app insights.
//     // NOTE: In production environment, you should consider logging this to Azure
//     //       application insights. See https://aka.ms/bottelemetry for telemetry
//     //       configuration instructions.
//     console.error(`\n [onTurnError] unhandled error: ${ error }`);

//     // Send a trace activity, which will be displayed in Bot Framework Emulator
//     await context.sendTraceActivity(
//         'OnTurnError Trace',
//         `${ error }`,
//         'https://www.botframework.com/schemas/error',
//         'TurnError'
//     );

//     // Send a message to the user
//     await context.sendActivity('The bot encountered an error or bug.');
//     await context.sendActivity('To continue to run this bot, please fix the bot source code.');
// };

// // Set the onTurnError for the singleton CloudAdapter.
// adapter.onTurnError = onTurnErrorHandler;

// // Create the main dialog.
// const myBot = new EchoBot();

// // Listen for incoming requests.
// server.post('/api/messages', async (req, res) => {
//     // Route received a request to adapter for processing
//     await adapter.process(req, res, (context) => myBot.run(context));
// });

// // Listen for Upgrade requests for Streaming.
// server.on('upgrade', async (req, socket, head) => {
//     // Create an adapter scoped to this WebSocket connection to allow storing session data.
//     const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);
//     // Set onTurnError for the CloudAdapter created for each connection.
//     streamingAdapter.onTurnError = onTurnErrorHandler;

//     await streamingAdapter.process(req, socket, head, (context) => myBot.run(context));
// });


// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');

const dotenv = require('dotenv');
// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// This bot's main dialog.
const { EchoBot } = require('./bot');

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});


// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Map configuration values values from .env file into the required format for each service.
// const QnAConfiguration = {
//     knowledgeBaseId: process.env.QnAKnowledgebaseId,
//     endpointKey: process.env.QnAAuthKey,
//     host: process.env.QnAEndpointHostName
// };

// const LuisConfiguration = {
//     applicationId: process.env.LuisAppId,
//     endpointKey: process.env.LuisAPIKey,
//     endpoint: process.env.LuisAPIHostName,
//     deploymentId: process.env.LuisAppDeployment
// }

// const SchedulerConfiguration = {
//     SchedulerEndpoint: process.env.SchedulerEndpoint
// }
// //pack each service configuration into 
const configuration = {
    // QnAConfiguration,
    // LuisConfiguration,
    // SchedulerConfiguration
}

// Create the main dialog.
const myBot = new EchoBot(configuration, {});

// Listen for incoming requests.
server.post('/api/messages', (req, res, next) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await myBot.run(context);
    });
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });
    // Set onTurnError for the BotFrameworkAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    streamingAdapter.useWebSocket(req, socket, head, async (context) => {
        // After connecting via WebSocket, run this logic for every request sent over
        // the WebSocket connection.
        await myBot.run(context);
    });
});
