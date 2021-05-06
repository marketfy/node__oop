import app, { router } from "./rootApplication";
import "../hooks/hooksBaseSystem";
import { event } from "../hooks/hooksBaseSystem";
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "../routes";
import { HooksKey } from "../hooks/types";
import { ServerBaseKeys } from "./types";

interface bodyParserJsonOptions {
	limit?: number;
	type?: string | string[];
}

interface bodyParserUrlencodedOptions {
	extended?: boolean;
	parameterLimit?: number;
}

interface bodyParserRawOptions {
	inflate?: boolean;
	limit?: number;
	type?: string | string[];
}

interface bodyParserTextOptions {
	defaultCharset?: string;
}

type encoding_types = "json" | "raw" | "text" | "urlencoded";

interface ServerConfig {
	encodingType?: encoding_types;
	port: number;
	serviceName: string;
	bodyParserOptions?: bodyParserJsonOptions | bodyParserUrlencodedOptions | bodyParserRawOptions | bodyParserTextOptions;
}

/**
* @param  encodingtype = "json" | "raw" | "text" | "urlencoded"  optional ,  default to json
	@param	port default 3000
	@param	serviceName default to  ""
 */

export function LaunchServer(config: ServerConfig) {
	return function (target: Function): void {
		if (target.name !== "Server") {
			throw new Error('cannot create server with this class name  , THE SERVER CLASS NAME SHOULD BE "Server" ');
		}

		const getMiddlewares =
			Reflect.getMetadata(ServerBaseKeys.AppMiddleware, target) ||
			function () {
				return [];
			};

		if (getMiddlewares() && getMiddlewares().length > 0) {
			app.use(getMiddlewares());
		}

		const OnRequestHook = Reflect.getMetadata(HooksKey.OnRequestHook, target);

		const OnResponseHook = Reflect.getMetadata(HooksKey.OnResponseHook, target);

		const callback =
			Reflect.getMetadata(ServerBaseKeys.ServerCallback, target) ||
			function (__servicesName: string, __port: number) {
				console.log(` >>>> ${__servicesName} server is running on port ${__port} `);
			};

		app.use(function (req: Request, res: Response, next: NextFunction) {
			if (OnRequestHook && OnRequestHook.registerd) {
				event.emit("OnRequest", req, res);
				next();
			} else {
				next();
			}
		});

		app.use(function (req: Request, res: Response, next: NextFunction) {
			if (OnRequestHook && OnRequestHook.registerd) {
				next();
				event.emit("OnResponse", req, res);
			} else {
				next();
			}
		});

		/// default to json
		app.use(express[!config.encodingType ? "json" : config.encodingType](config.bodyParserOptions));
		app.use(router);

		// connect to mongodb

		/// server port
		const PORT = config.port !== undefined ? config.port : 3000;

		/// start server

		app.listen(PORT, callback(config.serviceName, PORT));
	};
}
