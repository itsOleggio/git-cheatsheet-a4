export type Lane = 'main' | 'feat' | 'fix' | 'rel';

export type Era = 'new' | 'old';

export interface Command {
  command: string;
  label: string;
  era?: Era;
  hint?: string;
  warning?: string;
}

export type CommandPair = readonly [before: string, after: string];

export interface Section {
  title: string;
  lane: Lane;
  commands: readonly Command[];
  pairs?: readonly CommandPair[];
}

export interface BranchType {
  prefix: string;
  description: string;
  example: string;
  color: string;
}

export type CommitLane = 'main' | 'feat' | 'hot';

export interface CommitRow {
  lane: CommitLane;
  hash: string;
  message: string;
  tag?: string;
  merge?: boolean;
}

export interface CommitType {
  name: string;
  description: string;
  bump: string;
  color: string;
  bumpColor?: string;
}

export interface CommitExample {
  bad: string;
  why: string;
  good: string;
}
