export default function tokenInterceptor(requestConfig) {
  const token = sessionStorage.getItem('ccpAdminAccessToken');
  if (!token) {
    return requestConfig;
  }
  return {
    ...requestConfig,
    headers: {
      ...requestConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  };
}
