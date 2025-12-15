export enum AppStep {
  INTRODUCTION = 'INTRODUCTION',
  DATASET = 'DATASET',
  PARAMETERS = 'PARAMETERS',
  TRAINING = 'TRAINING',
  PLAYGROUND = 'PLAYGROUND'
}

export interface TrainingExample {
  text_input: string;
  output: string;
}

export interface Hyperparameters {
  epochs: number;
  batchSize: number;
  learningRate: number;
}

export interface TrainingLog {
  epoch: number;
  loss: number;
  accuracy: number;
}

export enum ModelType {
  BASE = 'BASE',
  TUNED = 'TUNED'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}