const sonarqubeScanner = require("sonarqube-scanner");

const sonarProjectName = "Website::common-utility-web-starter";

sonarqubeScanner(
  {
    serverUrl: "https://sonarqube.corp.dir",
    token: "a339e02add0a228db8742d2dacd44c7305d670ef",
    options: {
      "sonar.projectKey": sonarProjectName,
      "sonar.projectName": sonarProjectName,
      "sonar.projectDescription": sonarProjectName,
      "sonar.language": "typescript",
      "sonar.sources": "src",
      "sonar.tests": "src",
      "sonar.test.inclusions": "**/*.spec.ts",
      "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
    },
  },
  () => process.exit()
);
