/**
 * Checks if a user has at least one of the given permission codes
 * @param {Object} user - user object with roles and permissions
 * @param {string[]} permissionCodes - array of required permission codes
 * @returns {boolean}
 */
export const hasPermission = (user, permissionCodes = []) => {
  if (
    !user ||
    !Array.isArray(permissionCodes) ||
    permissionCodes.length === 0
  ) {
    return false;
  }

  return user?.user_roles?.some((userRole) =>
    userRole?.roles?.role_permissions?.some((rolePermission) =>
      permissionCodes.includes(rolePermission?.permissions?.code)
    )
  );
};
