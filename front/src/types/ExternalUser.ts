export interface ExternalUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    medium: string;
  };
  login: {
    uuid: string;
  };
}