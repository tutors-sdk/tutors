module.exports = {
    ruleArchive: "latest",
    policies: ["IBM_Accessibility"],
    failLevels: ["violation", "potentialviolation"],
    reportLevels: [
        "violation",
        "potentialviolation",
        "recommendation",
        "potentialrecommendation",
        "manual",
        "pass",
    ],
    outputFormat: ["json"],
    label: [process.env.TRAVIS_BRANCH],
    outputFolder: "results",
    baselineFolder: "test/baselines",
};