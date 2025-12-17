import usersData from './mock/users.json';

export type UserRole = 'child' | 'parent' | 'investigator';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  [key: string]: any;
}

const AUTH_KEY = 'zyberhero_auth';

// export function signIn(role: UserRole, userId: string): User | null {
//   const user = usersData.find(u => u.id === userId && u.role === role);
//   if (user) {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(AUTH_KEY, JSON.stringify(user));
//     }
//     return user as User;
//   }
//   return null;
// }
export function signIn(role: UserRole, userData: any) {
  if (typeof window !== "undefined") {
    const payload = {
      id: userData.id || userData.userlogin || userData.username,
      role,
      name: userData.name || userData.username,
      accessToken: userData.accessToken,   // optional
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  }

  return userData;
}


export function signOut(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;

  const userData = localStorage.getItem(AUTH_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export function getDashboardPath(role: UserRole): string {
  return `/dashboard/${role}`;
}
