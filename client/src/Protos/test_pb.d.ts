import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class SecretReply extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): SecretReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SecretReply.AsObject;
  static toObject(includeInstance: boolean, msg: SecretReply): SecretReply.AsObject;
  static serializeBinaryToWriter(message: SecretReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SecretReply;
  static deserializeBinaryFromReader(message: SecretReply, reader: jspb.BinaryReader): SecretReply;
}

export namespace SecretReply {
  export type AsObject = {
    message: string,
  }
}

