import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class Message extends jspb.Message {
  getText(): string;
  setText(value: string): Message;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    text: string,
  }
}

export class PublishedMessage extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): PublishedMessage;

  getText(): string;
  setText(value: string): PublishedMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublishedMessage.AsObject;
  static toObject(includeInstance: boolean, msg: PublishedMessage): PublishedMessage.AsObject;
  static serializeBinaryToWriter(message: PublishedMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublishedMessage;
  static deserializeBinaryFromReader(message: PublishedMessage, reader: jspb.BinaryReader): PublishedMessage;
}

export namespace PublishedMessage {
  export type AsObject = {
    username: string,
    text: string,
  }
}

