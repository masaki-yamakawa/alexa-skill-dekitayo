import * as Alexa from "ask-sdk";
import { IntentRequest } from "ask-sdk-model";
import * as util from "util";

export const DekitayoIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest"
			&& handlerInput.requestEnvelope.request.intent.name === "DekitayoIntent";
	},
	async handle(handlerInput: Alexa.HandlerInput) {
		const request: IntentRequest = handlerInput.requestEnvelope.request as IntentRequest;
		const task = request.intent.slots.task.value;
		const day = request.intent.slots.day.value;
		const amount = request.intent.slots.amount.value;
		const unit = request.intent.slots.unit.value;
		console.log(`[Slot] task=${task}, day=${day}, amount=${amount}, unit=${unit}`);

		const session = handlerInput.attributesManager.getSessionAttributes();
		console.log(`[Session] task=${session.task}, day=${session.day}, amount=${session.amount}, unit=${session.unit}`);
		const newAttributes = {
			day: !day ? session.day : day,
			task: !task ? session.task : task,
			amount: !amount ? session.amount : amount,
			unit: !unit ? session.unit : unit,
		};
		if (newAttributes.day == null) {
			newAttributes.day = "今日";
		}
		console.log(`[NewSession] task=${newAttributes.task}, day=${newAttributes.day}, amount=${newAttributes.amount}, unit=${newAttributes.unit}`);
		handlerInput.attributesManager.setSessionAttributes(newAttributes);

		let speechText = null;
		let repromptSpeechText = null;
		let shouldEndSession = false;
		if (newAttributes.amount == null) {
			speechText = "どれくらいやったの？";
			repromptSpeechText = "早くいえよ。もたもたしないで";
		} else if (newAttributes.task == null) {
			speechText = "何をやったのか教えてよ";
		} else {
			// TODO デバッグ用
			const beforeData = await handlerInput.attributesManager.getPersistentAttributes();
			console.log(`[BeforeDynamoData] ${util.inspect(beforeData)}`);

			const sound = getRandomSound();
			speechText = `${newAttributes.day}は${newAttributes.task}を${newAttributes.amount}${newAttributes.unit}やったんだね。<audio src='${sound}'/>`;
			handlerInput.attributesManager.setPersistentAttributes({
				day: newAttributes.day,	// TODO yyyy-mm-ddに変換する
				task: newAttributes.task,
				amount: newAttributes.amount,
				unit: newAttributes.unit,
			});
			await handlerInput.attributesManager.savePersistentAttributes();
			shouldEndSession = true;

			// TODO デバッグ用
			const afterData = await handlerInput.attributesManager.getPersistentAttributes();
			console.log(`[AfterDynamoData] ${util.inspect(afterData)}`);
		}

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(repromptSpeechText)
			.withSimpleCard("何が出来たの", speechText)
			.withShouldEndSession(shouldEndSession)
			.getResponse();
	},
};

const getRandomSound = () => {
	const sounds: string[] =
		[
			"soundbank://soundlibrary/cartoon/amzn_sfx_boing_long_1x_01",
			"soundbank://soundlibrary/cartoon/amzn_sfx_boing_med_1x_02",
			"soundbank://soundlibrary/cartoon/amzn_sfx_boing_short_1x_01",
			"soundbank://soundlibrary/musical/amzn_sfx_bell_timer_01",
		];
	return sounds[getRandomInt(sounds.length)];
};

const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};
