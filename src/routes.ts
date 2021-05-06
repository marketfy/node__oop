import { NextFunction, Request, Response } from "express";
import { Controller } from "./routes/controller";
import { Get, Post } from "./routes/methods";
import { use } from "./routes/middlewares";
import { bodyValidator } from "./routes/bodyValidator";
import { OnRequests } from "./hooks/RequestHooks";
import { useRequestHook, useResponseHook } from "./hooks/useHook";
import { callCustomHook } from "./hooks/customHook";

function test(req: Request, res: Response, next: NextFunction) {
	console.log("middleware called");
	next();
}

@Controller()
export default class Route {
	@Get("/hello")
	// @bodyValidator("email", "password")
	@useRequestHook((req, res) => console.log("useRequesthook called 1"))
	@useResponseHook((req, res) => console.log("useresponseHook called"))
	@use(test)
	hello(req: Request, res: Response) {
		console.log("hello world");
		res.send("hello world");
		callCustomHook("test");
		callCustomHook("test3");
	}

	@Post("/hello")
	@useRequestHook((req, res) => {
		console.log("hello from post route", req.ip);
	})
	@useResponseHook((req, res) => {
		console.log(req.ip);
	})
	hi(req: Request, res: Response) {
		res.send("hello");
	}
}
