export type User = {
  id: number;
  handle: string;
  moniker: string;
  email: string;
  phone: string;
  rsi_url: string;
  timezone: string;
  account_status: string;
  profile_image: string;
  language: UserLanguage;
  reputation: number;
  orgs: Org[];
};

export type UserLanguage = {
  code: string;
  name: string;
};

export type Org = {
  id: number;
  name: string;
  spectrum_id: string;
  spectrum_link: string;
  description: string;
};
