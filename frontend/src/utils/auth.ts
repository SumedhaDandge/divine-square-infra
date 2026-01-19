export const getAuthUser = () => {
  const user = sessionStorage.getItem("auth_user");
  return user ? JSON.parse(user) : null;
};

export const getUserRole = (): string | null => {
  const user = getAuthUser();
  return user?.role ?? null;
};

export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem("auth_token");
};
