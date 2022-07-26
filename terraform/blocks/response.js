/* This comes from the sentry project configuration page */
var SECURITY_HEADER_ENDPOINT =
  "https://o1211077.ingest.sentry.io/api/6600273/security/?sentry_key=19b6827eeb1d4f7d965da998276aceea";

/**
 * Decorates outgoing site headers for security purposes mostly.
 */
function handler(event) {
  var response = event.response;
  var headers = response.headers;
  var method = event.request.method;
  var uri = event.request.uri;
  var assetCacheControl = "public,max-age=31536000,immutable";

  // Very generous policy. We should strive towards removing 'unsafe-inline'.
  var csp = `default-src 'self' data: https: *.clouty.io *.google-analytics.com 'unsafe-inline'; report-uri ${SECURITY_HEADER_ENDPOINT}`;

  delete headers["server"];
  delete headers["x-amz-version-id"];
  delete headers["x-amz-meta-codebuild-buildarn"];
  delete headers["x-amz-meta-codebuild-content-md5"];
  delete headers["x-amz-meta-codebuild-content-sha256"];

  headers["x-content-type-options"] = { value: "nosniff" };
  headers["content-security-policy"] = { value: csp };

  if (method === "GET" && uri.startsWith("/assets/")) {
    headers["cache-control"] = { value: assetCacheControl };
  }

  return response;
}
