import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
        _id?: string;
        isVerfified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    isVerfified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isVerfified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}