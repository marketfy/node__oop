import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { router } from "../basesystem";
import { event } from "../hooks";
import { HooksKey } from "../hooks";
import { RoutesKeys, MethodKeys } from "./types";

function validateBody(keys: string) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (!req.body) {
			res.status(422).send("oppes , missing params");
			return;
		}
		for (let key of keys) {
			if (!req.body[key]) {
				res.status(422).send(`oppes,  missing ${key} params`);
				return;
			}
		}

		next();
	};
}

function routeHookMiddleware(path: string) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (event.eventNames().includes(path)) {
			event.emit(path, req, res);
			next();
		}
		next();
	};
}

function useResponseHookMiddleware(path: string) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (event.eventNames().includes(path)) {
			next();
			event.emit(path, req, res);
		}
		next();
	};
}

/**
 *
 * @param prefix optional
 * @param version optional
 *
 */

export function Controller(prefix?: string, version?: string) {
	if (version && version[0] === "/") {
		throw new Error("do not include  '/'  in the version it's included by default");
	}

	return function (target: Function) {
		if (target.name === "Server") {
			throw new Error("cannot use Controller route with server class");
		}

		const pathPrefix: () => string | undefined = () => {
			if (prefix && version) {
				return `${prefix}/${version}`;
			} else if (prefix && !version) {
				return prefix;
			} else if (!prefix && version) {
				throw new Error("you cannot add version to path without prefix");
			} else {
				return "";
			}
		};

		for (let key in target.prototype) {
			const route = Reflect.getMetadata(RoutesKeys.method, target.prototype, key);
			const routeMethod: MethodKeys = route.method;
			const path = route.path;

			const middlewares = Reflect.getMetadata(RoutesKeys.middlewares, target.prototype, key) || [];

			const bodyKeys = Reflect.getMetadata(RoutesKeys.bodyValidator, target.prototype, key) || [];

			const useRequestHooks = Reflect.getMetadata(HooksKey.useRequestHook, target.prototype, key) || {};

			if (useRequestHooks && useRequestHooks.listener && useRequestHooks.id) {
				event.on(`${path}---${routeMethod}--${useRequestHooks.id}`, (req, res) => {
					useRequestHooks.listener(req, res);
				});
			}

			const useResponseHooks = Reflect.getMetadata(HooksKey.useResponseHook, target.prototype, key) || {};

			if (useResponseHooks && useResponseHooks.listener && useResponseHooks.id) {
				event.on(`${path}---${routeMethod}--${useResponseHooks.id}`, (req, res) => {
					useResponseHooks.listener(req, res);
				});
			}

			const RequestBodyValidation = validateBody(bodyKeys);

			if (route) {
				router[routeMethod](
					`${pathPrefix()}${path}`,
					RequestBodyValidation,
					routeHookMiddleware(`${path}---${routeMethod}--${useRequestHooks.id}`),
					useResponseHookMiddleware(`${path}---${routeMethod}--${useResponseHooks.id}`),
					...middlewares,
					target.prototype[key]
				);
			}
		}
	};
}
