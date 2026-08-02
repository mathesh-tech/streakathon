import EventEmitter from 'events';

class AppEventEmitter extends EventEmitter {}

export const AppEvents = new AppEventEmitter();

// Define strong types for events
export enum EventTypes {
  USER_REGISTERED = 'USER_REGISTERED',
  TEAM_CREATED = 'TEAM_CREATED',
  HACKATHON_STARTED = 'HACKATHON_STARTED',
  CREDITS_AWARDED = 'CREDITS_AWARDED',
  ATTENDANCE_MARKED = 'ATTENDANCE_MARKED'
}

// Ensure listeners are set up
export function initializeEventHandlers() {
  AppEvents.on(EventTypes.USER_REGISTERED, (data) => {
    console.log(`[Event] USER_REGISTERED:`, data);
  });

  AppEvents.on(EventTypes.TEAM_CREATED, (data) => {
    console.log(`[Event] TEAM_CREATED:`, data);
  });

  AppEvents.on(EventTypes.CREDITS_AWARDED, (data) => {
    console.log(`[Event] CREDITS_AWARDED:`, data);
  });
}
