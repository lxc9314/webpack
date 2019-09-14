import buildConf from "../ci/build.json"

const domains = {
  uat: {},
  qa: {},
  stg: {},
  prd: {}
}

export const getDomain = domainName => {
  return domains[buildConf.env][domainName]
}

export default domains
