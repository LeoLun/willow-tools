module.exports = {
  skip: {
    tag: true,
  },
  types: [
    { type: "feat", section: "🚀 Features" },
    { type: "fix", section: "🐞 Bug Fixes" },
    { type: "docs", section: "docs", hidden: false },
    { type: "chore", section: "chore", hidden: false },
    { type: "style", section: "style", hidden: false },
    { type: "refactor", section: "refactor", hidden: false },
    { type: "perf", section: "perf", hidden: false },
    { type: "test", section: "test", hidden: false },
    { type: "build", section: "build", hidden: false },
    { type: "ci", section: "ci", hidden: false },
    { type: "revert", section: "revert", hidden: false },
  ],
};