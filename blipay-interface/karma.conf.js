module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("karma-spec-reporter"),
    ],
    client: {
      jasmine: {},
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/blipay-interface"),
      subdir: ".",
      reporters: [{ type: "text-summary" }, { type: "html" }],
    },
    reporters: ["spec", "progress", "coverage"],
    browsers: ["ChromeHeadlessNoSandbox"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    singleRun: true,
    restartOnFileChange: true,
  });
};
