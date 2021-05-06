export function applyMixins(derivedCtor: any, constructors: any[]) {
	constructors.forEach((basector) => {
		Object.getOwnPropertyNames(basector.prototype).forEach((name) => {
			Object.defineProperty(
				derivedCtor.prototype,
				name,
				Object.getOwnPropertyDescriptor(basector.prototype, name) || Object.create(null)
			);
		});
	});
}
