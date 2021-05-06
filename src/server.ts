import { Request, Response } from "express";
import { LaunchServer } from "./basesystem/launchServer";
import { baseServer } from "./basesystem/types";
// import "./routes";
import { OnRequests } from "./hooks/RequestHooks";
import { Controller } from "./routes/controller";
import { Get } from "./routes/methods";
import { OnResponse } from "./hooks/ResponseHook";
import { createcCustomHook } from "./hooks/customHook";
import "./mongoose/mongooseClient";
import { Redis } from "./redis/redisClient";

createcCustomHook("test", () => {
	console.log("custom hook test");
});

createcCustomHook("test3", () => {
	console.log("custom hook test 3");
});

@LaunchServer({
	encodingType: "json",
	port: 3001,
	serviceName: "service",
})
@OnRequests(() => console.log("request hook called"))
@OnResponse((req, res) => console.log("response hook called"))
class Server extends Redis {}

const server = new Server();
