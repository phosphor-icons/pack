import type { Message } from "./types";

const DEFAULT_CHANNEL = "__worker_channel";

/**
 * A client for interacting with a Web Worker via async requests.
 */
export class WorkerClient<D> {
  #channel: string;
  #worker: Worker;
  #receiver: (event: MessageEvent<Message<D>>) => void;
  #pending = new Map();

  constructor(workerUrl: string, channel: string = DEFAULT_CHANNEL) {
    // Using a named channel will allow us to keep logic for sending and receiving
    // messages of a certain type scoped to specific consumers, and allow us to create
    // multiple independent channels.
    this.#channel = channel;

    // The client manages a worker internally
    this.#worker = new Worker(workerUrl, { type: "module" });

    // The client listens for messages on this channel. When it sees a message
    // corresponding to one of its pending Promises, it resolves or rejects that
    // Promise with the receivced payload.
    this.#receiver = (event) => {
      if (!event.data || !event.data.id) return;
      if (event.data.channel !== this.#channel) return;
      if (!this.#pending.has(event.data.id)) return;

      const [resolve, reject] = this.#pending.get(event.data.id);
      if ("payload" in event.data) {
        resolve(event.data.payload);
      } else if ("error" in event.data) {
        reject(event.data.error);
      } else {
        reject(new Error("Malformed response"));
      }
      this.#pending.delete(event.data.id);
    };

    this.#worker.addEventListener("message", this.#receiver);
  }

  async post<R>(payload: D) {
    // Create a pseudo-random ID for this request, so we can identify corresponding
    // messages from the host when they arrive. This does not need to be crypto-safe,
    // but should be "unique enough" to prevent collisions when making simultaneous
    // requests. Could also be an incrementing counter.
    const id = Math.floor(Math.random() * 1_000_000).toString(16);

    // Create an "empty" Promise and store a reference to it locally, identified by
    // its ID. This Promise is returned to the caller, and later resolved or rejected
    // based on receipt of a corresponding message from the Worker.
    return new Promise<R>((resolve, reject) => {
      this.#pending.set(id, [resolve, reject]);

      // Dispatch a message to the worker
      this.#worker.postMessage({
        id,
        channel: this.#channel,
        ...payload,
      });
    });
  }
}

/**
 * A Worker-based channel for communicating with a main-thread WorkerClient.
 */
export class WorkerHost<D> {
  #channel: string;
  #receivers = new Map();

  constructor(channel: string = DEFAULT_CHANNEL) {
    this.#channel = channel;
  }

  // Register an event listener that only receives messages on this channel
  on<R>(
    type = "message",
    callback: (message: MessageEvent<Message<D>>) => Promise<R>,
  ) {
    const wrapper = async (event: MessageEvent<Message<D>>) => {
      // Filter out irrelevant messages
      if (!event.data || !event.data.id) return;
      if (event.data.channel !== this.#channel) return;

      try {
        // Execute the callback and send a reply message with the result
        const payload = await callback(event);
        postMessage({
          id: event.data.id,
          channel: this.#channel,
          payload,
        });
      } catch (error) {
        // Handle errors and return them in a message
        postMessage({
          id: event.data.id,
          channel: this.#channel,
          error,
        });
      }
    };

    this.#receivers.set(callback, wrapper);
    addEventListener("message", wrapper);
  }

  // A convenience for unsubscribing to client messages
  off<R>(
    type = "message",
    callback: (message: MessageEvent<Message<D>>) => Promise<R>,
  ) {
    const wrapper = this.#receivers.get(callback);
    if (wrapper) {
      removeEventListener(type, wrapper);
      this.#receivers.delete(callback);
    }
  }
}
