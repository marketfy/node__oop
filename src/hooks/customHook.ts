import { event } from "./hooksBaseSystem";

export function createcCustomHook(eventKey: string, listener: () => void) {
	event.on(eventKey, () => {
		listener();
	});
}

export function callCustomHook(eventKey: string | string[]) {
	if (typeof eventKey === "string") {
		event.emit(eventKey);
	} else if (eventKey.length > 0) {
		for (let i = 0; i < eventKey.length; i++) {
			event.emit(eventKey[i]);
		}
	} else if (eventKey.length === 0) {
		console.warn("you are passing an empty array ");
	} else {
		throw new Error(`you can only pass string or an array of strings, but you pass args with typeof   ${typeof eventKey}`);
	}
}
