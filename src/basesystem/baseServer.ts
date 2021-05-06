import { Redis } from "../redis/redisClient";

export abstract class BaseServer extends Redis {
	public abstract OnReady?: () => void;
	protected abstract UseMiddlewares?: () => [];
}
