import redis, { ClientOpts } from "redis";

export class Redis {
	createRedisClient(options?: ClientOpts) {
		const __redis = redis.createClient(options);
		__redis.set("test", "1", (err, reply) => {
			if (err) {
				console.log("cannot connect to redis database");
			} else {
				console.log("connected to database");
			}
		});

		return __redis;
	}
}
