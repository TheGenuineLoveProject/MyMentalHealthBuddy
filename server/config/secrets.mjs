const isProduction = process.env.NODE_ENV === "production";

export const JWT_SECRET =
  process.env.JWT_SECRET || (isProduction ? null : "dev_secret_not_for_production");

export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || (isProduction ? null : "dev_refresh_secret_not_for_production");
