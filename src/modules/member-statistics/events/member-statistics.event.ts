import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MEMBER_STATISTICS_COUNT } from '@src/modules/member-statistics/listeners/member-statistics.listeners';
import { IMemberStatisticsEvent } from '@src/modules/member-statistics/types/member-statistics.type';

@Injectable()
export class MemberStatisticsEvent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  register(memberId: number, event: IMemberStatisticsEvent): boolean {
    const { fieldName, action, count = 1 } = event;

    return this.eventEmitter.emit(MEMBER_STATISTICS_COUNT, memberId, {
      fieldName,
      action,
      count,
    });
  }
}
