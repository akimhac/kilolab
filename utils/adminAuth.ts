// src/utils/adminAuth.ts
export const checkAdminAccess = (): boolean => {
  const adminBypass = localStorage.getItem('kilolab_admin_bypass');
  return adminBypass === 'true';
};

export const requireAdminAccess = (): void => {
  if (!checkAdminAccess()) {
    window.location.href = '/secret-admin';
  }
};
