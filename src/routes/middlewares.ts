import { RequestHandler } from "express";
import "reflect-metadata";
import { RoutesKeys, MethodPropertyDescriptor } from "./types";

export function use(middleware: RequestHandler) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		const middlewares = Reflect.getMetadata(RoutesKeys.middlewares, target, key) || [];
		Reflect.defineMetadata(RoutesKeys.middlewares, [...middlewares, middleware], target, key);
	};
}
