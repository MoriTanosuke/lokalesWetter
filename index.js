/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const http = require('http');

const apiKey = '2b88c2a0bd276a562ab2293022a5266c';
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
const APP_ID = 'amzn1.ask.skill.a9c1f9bd-150f-45fa-a89d-2150329f63af';

function getWeather() {
    var city = 'Frille, Germany';
    var weather = 'Unknown';
    var url = baseUrl + city + "&APPID=" + apiKey;
    // get API response
    http.get(url, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];
    
      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type.\n` +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.log(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }
    
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          console.log(parsedData);
          weather = parsedData.weather[0].description;
          
      const speechOutput = this.t('GET_FACT_MESSAGE') + weather;
      this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), weather);
        } catch (e) {
          console.log(e.message);
        }
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });
}

const languageStrings = {
    'en-GB': {
        translation: {
            FACTS: [
                'Sunny',
                'Rainy',
                'Cold',
                'Warm',
            ],
            SKILL_NAME: 'Local weather',
            GET_FACT_MESSAGE: "It will be ",
            HELP_MESSAGE: 'You can ask "How is the weather, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'en-US': {
        translation: {
            FACTS: [
                'Sunny',
                'Rainy',
                'Cold',
                'Warm',
            ],
            SKILL_NAME: 'Local weather',
            GET_FACT_MESSAGE: "It will be ",
            HELP_MESSAGE: 'You can ask "How is the weather, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'de-DE': {
        translation: {
            FACTS: [
                'Sonnig',
                'Regnerisch',
                'Kalt',
                'Warm',
            ],
            SKILL_NAME: 'Lokales Wetter',
            GET_FACT_MESSAGE: 'Es wird ',
            HELP_MESSAGE: 'Du kannst sagen, „Wie wird das Wetter“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'LokalesWetter': function () {
        this.emit('GetFact');
    },
    'GetFact': getWeather,
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
	'Unhandled': function() {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
	},
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
