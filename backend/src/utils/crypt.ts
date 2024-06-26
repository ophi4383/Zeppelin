import { Pool, spawn, Worker } from "threads";
import { env } from "../env.js";
import "../threadsSignalFix.js";
import { MINUTES } from "../utils.js";

const pool = Pool(() => spawn(new Worker("./cryptWorker"), { timeout: 10 * MINUTES }), 8);

export async function encrypt(data: string) {
  return pool.queue((w) => w.encrypt(data, env.KEY));
}

export async function decrypt(data: string) {
  return pool.queue((w) => w.decrypt(data, env.KEY));
}
