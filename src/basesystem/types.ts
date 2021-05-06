export enum ServerBaseKeys {
	AppMiddleware = "AppMiddleware",
	ServerCallback = "ServerCallback",
}

export interface baseServer {
	OnReady?: () => void;
	UseMiddlewares?: () => [];
}
