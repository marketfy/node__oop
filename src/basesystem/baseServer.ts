import { Redis } from "../plugin/redis/redisClient";
import { MongooseClient } from "../plugin/mongoose/mongooseClient";
import { applyMixins } from "./classesMixin";

export interface BaseServer extends Redis, MongooseClient {}

export class BaseServer implements BaseServer {}

applyMixins(BaseServer, [Redis, MongooseClient]);
