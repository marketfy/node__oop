import "reflect-metadata";
import { ServerBaseKeys } from "../types";

export function useMiddlewares(middleware: () => any[]) {
	return function (target: Function) {
		Reflect.defineMetadata(ServerBaseKeys.AppMiddleware, middleware, target);
	};
}
