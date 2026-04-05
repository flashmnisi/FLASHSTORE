export interface KafkaMessage {
  key?: string;
  value: any;
  headers?: Record<string, string>;
}

export interface PublishOptions {
  topic: string;
  message: any;
  key?: string;
  partition?: number;
}

export interface ConsumerConfig {
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
}

export type KafkaEvent = {
  event: string;
  data: any;
  timestamp: string;
  service: string;
};