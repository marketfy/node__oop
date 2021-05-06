import "reflect-metadata";
import { ServerBaseKeys } from "../types";

export function CallBack(func: () => void) {
	return function (target: Function) {
		Reflect.defineMetadata(ServerBaseKeys.ServerCallback, func, target);
	};
}
