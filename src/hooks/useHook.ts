import { event } from "./hooksBaseSystem";
import { HooksKey } from "./types";
import { v4 } from "uuid";
import { Request, Response } from "express";
export function useRequestHook(listener: (req: Request, res: Response) => void) {
	return function (target: any, key: string, desc: PropertyDescriptor) {
		Reflect.defineMetadata(HooksKey.useRequestHook, { listener, id: v4() }, target, key);
	};
}

export function useResponseHook(listener: (req: Request, res: Response) => void) {
	return function (target: any, key: string, desc: PropertyDescriptor) {
		Reflect.defineMetadata(HooksKey.useResponseHook, { listener, id: v4() }, target, key);
	};
}
