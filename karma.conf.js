// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const path = require("path");

const buildConfigsForLocalDevelopment = () => {
  const webpack = require("./webpack.dev.js");
  webpack.devtool = "inline-source-map";

  // since we have some libraries which don't have source maps, the source-map-loader will fail with some error-warnings
  // we can skip those warnings since the source maps are used only for loading our typescript code while debugging
  webpack.ignoreWarnings = [/Failed to parse source map/];

  // the cache is enabled in tests to improve the performance
  // if there are issues with changes not being picked up, please uncomment the following line
  // webpackConfig.cache = false;
  delete webpack.entry;
  delete webpack.output;
  delete webpack.optimization;

  return {
    frameworks: ['jasmine', 'webpack'],
    webpack,
    preprocessors: {
      'src/**/*.ts': ["webpack"],
    }
  }
}

const buildConfigsForCI = (enableAllReporters) => {
  return {
    frameworks: ['jasmine', 'karma-typescript'],
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        module: "commonjs",
      }
    },
    preprocessors: {
      'src/**/*.ts': 'karma-typescript',
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reporters: [
        { type: "cobertura", subdir: "." },
        ...(enableAllReporters
          ? [
            { type: "lcovonly", subdir: "." },
            { type: "html", subdir: "." },
            { type: "text-summary", subdir: "." },
          ]
          : []),
      ],
      check: {
        emitWarning: true,
        global: {
          statements: 70,
          lines: 70,
          branches: 50,
          functions: 70,
        },
      },
    },
  }
}

module.exports = function (config) {
  const ci = config.ci || false;
  const enableCoberturaReport = config.enableCoberturaReport || false;
  const enableAllReporters = config.enableAllCoverageReporters || false;

  const reporters = [];
  if (ci) {
    reporters.push("junit");
  }
  if (enableCoberturaReport) {
    reporters.push("coverage");
  }
  reporters.push("spec");

  config.set({
    basePath: '',

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-sonarqube-unit-reporter'),
      require('karma-typescript'),
      require('karma-spec-reporter'),
      require('karma-junit-reporter'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
    ],
    files: [
      { pattern: 'src/**/*.ts' },
      { pattern: 'src/**/*.js' },
      { pattern: 'test/**/**/*.css', served: true, included: false },
      { pattern: 'test/**/**/*.svg', served: true, included: false },
      { pattern: 'test/**/**/*.html', served: true, included: false },
      { pattern: 'test/**/**/*.woff2', served: true, included: false },
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      },
    },
    reporters,
    ...(ci && enableCoberturaReport
      ? buildConfigsForCI(enableAllReporters)
      : buildConfigsForLocalDevelopment()),

    specReporter: {
      prefixes: {
        success: '    OK: ',      // override prefix for passed tests, default is '✓ '
        failure: 'FAILED: ',      // override prefix for failed tests, default is '✗ '
        skipped: 'SKIPPED: '      // override prefix for skipped tests, default is '- '
      }
    },
    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      testFilePattern: '.spec.ts',
      overrideTestDescription: true,
      outputFile: '../reports/sonarqube.xml',
      useBrowserName: false,
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: !ci ? ["ChromeDebugging"] : ["ChromeHeadlessCI"],
    singleRun: !!ci,
    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"],
      },
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox --disable-gpu"],
      },
    },
    concurrency: Infinity,
  });
};
