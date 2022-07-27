/**
 * Temporary and easy caching fix. Really we need to push these headers to S3
 * and we can delete this function.
 */
function handler(event) {
  var headers = event.response.headers;
  var method = event.request.method;
  var uri = event.request.uri;

  delete headers["server"];
  delete headers["x-amz-version-id"];
  delete headers["x-amz-meta-codebuild-buildarn"];
  delete headers["x-amz-meta-codebuild-content-md5"];
  delete headers["x-amz-meta-codebuild-content-sha256"];

  if (method === "GET" && uri.startsWith("/assets/")) {
    headers["cache-control"] = {
      value: "public,max-age=31536000,immutable",
    };
  }

  return event.response;
}
