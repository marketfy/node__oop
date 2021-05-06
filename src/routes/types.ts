import { RequestHandler } from "express";

export enum MethodKeys {
	post = "post",
	get = "get",
	put = "get",
	del = "delete",
	patch = "patch",
}

export enum RoutesKeys {
	method = "methods",
	middlewares = "middlewares",
	bodyValidator = "bodyValidator",
}

export interface MethodPropertyDescriptor extends PropertyDescriptor {
	value?: RequestHandler;
}
