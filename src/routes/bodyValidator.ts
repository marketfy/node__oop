import "reflect-metadata";
import { RoutesKeys, MethodPropertyDescriptor } from "./types";

export function bodyValidator(...keys: string[]) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		Reflect.defineMetadata(RoutesKeys.bodyValidator, keys, target, key);
	};
}
