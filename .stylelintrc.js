module.exports = {
  extends: [
    'stylelint-config-standard-scss'
  ],
  rules: {
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'selector-type-no-unknown': [true, { ignoreTypes: ['page']}]
  }
}