import mongoose from "mongoose";

export default mongoose;

export class MongooseClient {
	async createMongodbConnection(uri: string) {
		try {
			await mongoose.connect(uri, {
				useFindAndModify: false,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log("connected to mongodb ");
		} catch (error) {
			console.log("mongodb connection error :" + error);
		}
	}
}
