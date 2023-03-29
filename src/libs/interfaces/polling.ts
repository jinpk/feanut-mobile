export interface UserRound {
  roundId: string;
  pollIds: string[];
  complete: boolean;
}

export interface PollingRound {
  todayCount: number;
  recentCompletedAt: string;
  data: UserRound;
}
