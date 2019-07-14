import * as Alexa from "ask-sdk-core";
import { RequestEnvelope } from "ask-sdk-model";

import { DekitayoIntentHandler } from "./dekitayoHandler";

let skill: Alexa.Skill;

export const handler = async (event: RequestEnvelope, context: any) => {
	if (!skill) {
		skill = Alexa.SkillBuilders.custom()
			.addRequestHandlers(
				LaunchRequestHandler,
				DekitayoIntentHandler,
				HelpIntentHandler,
				CancelAndStopIntentHandler,
				SessionEndedRequestHandler,
				IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers      .addErrorHandlers(ErrorHandler)
			.addErrorHandlers(
				ErrorHandler)
			.create();
	}
	return skill.invoke(event, context);
};

const LaunchRequestHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === "LaunchRequest";
	},
	handle(handlerInput: Alexa.HandlerInput) {
		const speechText = "なにを出来たか言ってみて";
		const repromptSpeechText = "なにを出来たの？";
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(repromptSpeechText)
			.withSimpleCard("できたよスキル", speechText)
			.getResponse();
	},
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest"
			&& handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
	},
	handle(handlerInput) {
		const speechText = "いつ、何を、どれくらい、できたのか言ってみて";
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	},
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest"
			&& (handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent"
			|| handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent");
	},
	handle(handlerInput) {
		const speechText = "またね";
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	},
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
	},
	handle(handlerInput) {
		// Any cleanup logic goes here.
		return handlerInput.responseBuilder.getResponse();
	},
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest";
	},
	handle(handlerInput) {
		const intentName = handlerInput.requestEnvelope.request.intent.name;
		const speechText = `You just triggered ${intentName}`;
		return handlerInput.responseBuilder
			.speak(speechText)
			// .reprompt('add a reprompt if you want to keep the session open for the user to respond')
			.getResponse();
	},
};

const ErrorHandler = {
	canHandle(handlerInput: Alexa.HandlerInput, error: Error) {
		return true;
	},
	handle(handlerInput: Alexa.HandlerInput, error: Error) {
		console.log(`Error handled: ${error.message}`);
		const speechText = `エラーが発生したよ。もう一度やってみるかログを確認してね`;
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	},
};
