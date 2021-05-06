import { event } from "./hooksBaseSystem";
import "reflect-metadata";
import { HooksKey } from "./types";
import { Request, Response } from "express";
export function OnRequests(listener: (req: Request, res: Response) => void) {
	return function (target: Function) {
		if (target.name !== "Server") {
			throw new Error("OnRequest hooks can be used only in Server class ");
		} else {
			event.on("OnRequest", (req: Request, res: Response) => {
				listener(req, res);
			});
			Reflect.defineMetadata(HooksKey.OnRequestHook, { registerd: true }, target);
		}
	};
}
