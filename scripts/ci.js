const ci = require('miniprogram-ci');
const path = require('path');
const fs = require('fs');
const config = require('../project.config.json');
const pkg = require('../package.json');

const private = process.env.MINIPROGRAM_PRIVATE;

// 将内容写入 private.key
fs.writeFileSync('./cache/private.key', private);

const createProject = () => {
  const project = new ci.Project({
    appid: config.appid,
    type: 'miniProgram',
    projectPath: path.resolve(__dirname, '../'),
    privateKeyPath: path.resolve(__dirname, '../cache/private.key'),
    ignores: ['node_modules/**/*'],
  });
  return project;
};

const preview = async (project) => {
  const result = await ci.preview({
    project,
    version: pkg.version,
    desc: '自动化构建',
    robot: 20,
    setting: config.setting,
    qrcodeFormat: 'image',
    qrcodeOutputDest: path.resolve(__dirname, '../cache/qrcode.jpg'),
    onProgressUpdate: console.log,
  });
  return result;
};

const upload = async (project) => {
  const result = await ci.upload({
    project,
    version: pkg.version,
    desc: '自动化构建',
    robot: 1,
    setting: config.setting,
    onProgressUpdate: console.log,
  });
  return result;
};

const run = () => {
  const env = process.env.NODE_CI_ENV || 'preview';
  const action = env === 'upload' ? upload : preview;
  const project = createProject();
  const result = action(project);
  console.log(result);
};

run();
