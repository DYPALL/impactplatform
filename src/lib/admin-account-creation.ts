export function userAccountAttributes(data: { email: string; password: string; name: string; country: string }) {
  return {
    email: data.email,
    password: data.password,
    email_confirm: false,
    user_metadata: { full_name: data.name, country: data.country },
  };
}