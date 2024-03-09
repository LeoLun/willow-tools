/* eslint-disable import/no-unresolved */
const ci = require('miniprogram-ci');
const path = require('path');
const fs = require('fs');
const config = require('../project.config.json');
const pkg = require('../package.json');

// const private = process.env.MINIPROGRAM_PRIVATE;
const private = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1XLxdwiPZBYNMa2/BYt7fxiHE4G8iCSYx+RjyF6iGMQJj9jn
hDfp+qS+xBsQmx7V8QUtBX4jEJ83DVAf2z0mIt8diG323GYzTCmz3ey5HFRh/A0f
3B2Vr3eYwdWDUPswin5Dn9nUFbW+1yMHl+dzDZ5t5L4kTr1pkFbbUexd7Gv8S80E
6Hg1fTdm68sPDBBzvUYRLf/LZ/ze1BYpYqDbi1FaS5wlPiChFbtLCb4WPEGYOD3M
1YNqZ+U6lU8m0xQKloqnOPg1v7OpjCkEoIIflE8N2yppSIDtuKPESpMxtEGCi12b
1BYqXuIdlxR/Cx8qmHtaK6sIH2rBQ9TH4m8S2QIDAQABAoIBADf14LSSe/WDioYB
xVkQzpnttkw48VLINX4CtN5tYRYZH2ClP118w01BL/p+FgZ1OSXtc3ZDMbJD680D
urZh+8Oct0NzgQsbiEtpi4ydaZKx1NaeIkI1R28vbc8zyS/MC1fj7prUIzRl59jD
iFQdDB7/8FPOPfqe0jRTcUCzNZSr6E59ws351TJ6QUiyT3e6s92LPmB4R40u+wi8
BRvy0WXVdFG8qz6NIacujUc8zz8RFEAT82J+qHezEvudjlmNEm2DryDIvbiulgXp
fl5F/CRNjcqv+TqR2M5D00/qHY3+jqKUG9NYgM/ojMssNgeRJx5RrQLLV7g6BVdf
1xiSZmECgYEA9P9nQSDzvo3/A97/GFpSEtfatWZdtXZ+/OTkkB2GL2WY8yY6T89r
rZY/Hl/S607ZE1xIzJ/qHTFbk8WWyiw+7Cap/Op8XSZm1gxQtK1pTldRf1rYWUPo
v3ir3M4ES4C3wlWnsrbOqs/D9GuF2BstY+SnD7qX1RdbGRDCuXR6fm0CgYEA3wjX
0Il/O3tILwmGYaQX5k0K3yqOB+qKbK5WExZSSVNMrbih2zmZn25v653RrsIixUQ/
zaoNHVJB20bJlgcAU8SQSe5Ltrn0btUL47l2DRHRGH6+pmdNIJIVgCYXU0M9hDzw
yWMQEgsADcJxSFR3prTj4q0GSfP7EpbwG9Uvcp0CgYA7FIwVzJh6z0s7576kZMN9
/8eiDvlyFQ0ydxAXIMeHDnz/xawyKtbQmXbHIFyAmhcG8C4uCjIusARhcjiWsGzM
DdbYQsOSwvvxii68I0VNuwjQKVwayqGJ6tOm/5dRjczCdF1oX2UfE9MxUeyI3KTp
fe47gMe0f1lchgovJsOTUQKBgQDYywi0PKJ+1+OfTRvhVxagFm0l5YBvc2ygHYmv
Pfg4LA8RobE6na+UyE1j8mC6BRy1MRTvvYbH5If9M76I5T9NLXivVEEmWXSeMto+
vaxhIdtkevaoWyseKMFbciskFOz72ByZNICPeT/RIBrrGqe/VH9ae6LsSYrYU/0K
oNthBQKBgQDZiG9r9DbNZiNUjiDjYlykGMz24rEqvW7c4ZKWxXjdBKMzA1bVEwFc
kZrma/A1tmzUPLVTUcpZMGAXBhoBAqd0Ys9eZKwEbWAh6kTvHlfd+WHeoOJLkGca
leezWyqQHyfHmiceEuZwoH3hoEexC+z5Di+BzaXKzbMN6itE3L8W5Q==
-----END RSA PRIVATE KEY-----
`;

const dir = './cache';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

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
