import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MEMBER_FOLLOW_CREATE,
  MEMBER_FOLLOW_DELETE,
} from '@src/modules/member-friendship/listeners/member-friendships.listeners';

@Injectable()
export class MemberFriendshipsEvent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  follow(toMemberId: number, fromMemberId: number): boolean {
    return this.eventEmitter.emit(
      MEMBER_FOLLOW_CREATE,
      toMemberId,
      fromMemberId,
    );
  }

  unfollow(toMemberId: number, fromMemberId: number): boolean {
    return this.eventEmitter.emit(
      MEMBER_FOLLOW_DELETE,
      toMemberId,
      fromMemberId,
    );
  }
}
