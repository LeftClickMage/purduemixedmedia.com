import { clearSessionCookie } from '../_lib/jwt';

export const onRequestGet: PagesFunction = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': clearSessionCookie(),
    },
  });
};
