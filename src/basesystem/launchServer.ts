import app, { router } from "./rootApplication";
import "../hooks/hooksBaseSystem";
import { event } from "../hooks/hooksBaseSystem";
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "../routes";
import { mongoose } from "../mongoose/mongooseClient";
import { HooksKey } from "../hooks/types";

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
	mongodb?: boolean;
	mongodbUri?: string;
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

		/// callBack function
		const ServerStartCallback = target.prototype["OnReady"];

		if (target.prototype["UseMiddlwares"] && target.prototype["UseMiddlwares"]().length > 0) {
			app.use(target.prototype["UseMiddlwares"]());
		}

		const OnRequestHook = Reflect.getMetadata(HooksKey.OnRequestHook, target);

		const OnResponseHook = Reflect.getMetadata(HooksKey.OnResponseHook, target);

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

		if (config.mongodb) {
			(async () => {
				try {
					await mongoose.connect(config.mongodbUri!, {
						useNewUrlParser: true,
						useFindAndModify: false,
						useUnifiedTopology: true,
					});
					console.log(`>>>> service ${config.serviceName}  connected to mongodb`);
				} catch (error) {
					console.log("mongodb error :" + error);
				}
			})();
		}

		/// server port
		const PORT = config.port !== undefined ? config.port : 3000;

		// Callback function

		const SERVER_CAllBACK_FUNCTION = !ServerStartCallback
			? () => console.log(` >>>> ${config.serviceName} server is running on port ${PORT}`)
			: ServerStartCallback;

		/// start server

		app.listen(PORT, SERVER_CAllBACK_FUNCTION);
	};
}
