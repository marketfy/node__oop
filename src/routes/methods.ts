import "reflect-metadata";
import { MethodKeys, RoutesKeys, MethodPropertyDescriptor } from "./types";

export function Get(path: string) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		Reflect.defineMetadata(RoutesKeys.method, { path, method: MethodKeys.get }, target, key);
	};
}

export function Post(path: string) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		Reflect.defineMetadata(RoutesKeys.method, { path, method: MethodKeys.post }, target, key);
	};
}

export function Put(path: string) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		Reflect.defineMetadata(RoutesKeys.method, { path, method: MethodKeys.put }, target, key);
	};
}

export function Del(path: string) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		Reflect.defineMetadata(RoutesKeys.method, { path, method: MethodKeys.del }, target, key);
	};
}

export function Patch(path: string) {
	return function (target: any, key: string, desc: MethodPropertyDescriptor) {
		Reflect.defineMetadata(RoutesKeys.method, { path, method: MethodKeys.patch }, target, key);
	};
}
