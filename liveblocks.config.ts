
declare global {
  interface Liveblocks {
    Presence: {
    };

    Storage: {
      leftMargin: number;
      rightMargin: number;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };

    RoomEvent: {};
    ThreadMetadata: {
    };

    RoomInfo: {
    };
  }
}

export {};
