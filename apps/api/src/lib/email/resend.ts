import { Resend } from "resend";

import type { Bindings } from "../../types";

export const createResend = (env: Bindings) => {
  return new Resend(env.RESEND_API_KEY);
};