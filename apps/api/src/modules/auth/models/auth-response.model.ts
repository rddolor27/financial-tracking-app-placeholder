export class AuthUserModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  currency: string;
}

export class AuthResponseModel {
  access_token: string;
  refresh_token: string;
  user: AuthUserModel;
}
