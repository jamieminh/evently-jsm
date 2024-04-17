"server-only";

import Rollbar, { Configuration } from "rollbar";

const rollbar = new Rollbar(process.env.ROLLBAR_SERVER_TOKEN as Configuration);

export const logServerInfo = (message: string) => {
  rollbar.info(message);
};
