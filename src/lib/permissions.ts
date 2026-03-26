import { UserRole } from "@prisma/client";

const weights: Record<UserRole, number> = {
  ADMIN: 4,
  MANAGER: 3,
  MEMBER: 2,
  VIEWER: 1
};

export function hasRole(userRole: UserRole, minimumRole: UserRole) {
  return weights[userRole] >= weights[minimumRole];
}

export function assertCanMutate(role: UserRole) {
  if (role === "VIEWER") throw new Error("Insufficient permissions");
}

export function canManageUsers(role: UserRole) {
  return role === "ADMIN";
}
