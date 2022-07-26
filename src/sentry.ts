import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { config } from "./configuration";

Sentry.init({
  integrations: [new BrowserTracing()],
  ...config.sentry,
});
