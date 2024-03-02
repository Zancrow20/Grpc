/**
 * @fileoverview gRPC-Web generated client stub for ChatService
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v4.25.3
// source: Protos/chatservice.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as Protos_chatservice_pb from '../Protos/chatservice_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class ChatServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorSendMessage = new grpcWeb.MethodDescriptor(
    '/ChatService.ChatService/SendMessage',
    grpcWeb.MethodType.UNARY,
    Protos_chatservice_pb.Message,
    google_protobuf_empty_pb.Empty,
    (request: Protos_chatservice_pb.Message) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  sendMessage(
    request: Protos_chatservice_pb.Message,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  sendMessage(
    request: Protos_chatservice_pb.Message,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  sendMessage(
    request: Protos_chatservice_pb.Message,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ChatService.ChatService/SendMessage',
        request,
        metadata || {},
        this.methodDescriptorSendMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ChatService.ChatService/SendMessage',
    request,
    metadata || {},
    this.methodDescriptorSendMessage);
  }

  methodDescriptorSubscribeMessages = new grpcWeb.MethodDescriptor(
    '/ChatService.ChatService/SubscribeMessages',
    grpcWeb.MethodType.SERVER_STREAMING,
    google_protobuf_empty_pb.Empty,
    Protos_chatservice_pb.PublishedMessage,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_chatservice_pb.PublishedMessage.deserializeBinary
  );

  subscribeMessages(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<Protos_chatservice_pb.PublishedMessage> {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/ChatService.ChatService/SubscribeMessages',
      request,
      metadata || {},
      this.methodDescriptorSubscribeMessages);
  }

}

