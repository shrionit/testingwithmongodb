import ReportRoute from "./ReportRoute.js";

const maps = {
  reports: ReportRoute,
  // register routes here for api v1
};

function prependSlash() {
  let out = {};
  Object.entries(maps).forEach(([k, v]) => {
    out["/" + k] = v;
  });
  return out;
}

const V1MAP = prependSlash();

export default V1MAP;
