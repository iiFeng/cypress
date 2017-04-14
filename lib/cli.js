const _ = require('lodash')
const commander = require('commander')

const coerceFalse = (arg) => {
  return arg !== 'false'
}

const parseOpts = (opts) => _.pick(opts, 'spec', 'reporter', 'reporterOptions', 'path', 'destination', 'port', 'env', 'cypressVersion', 'config', 'record', 'key')

const descriptions = {
  record: 'records the run. sends test results, screenshots and videos to your Cypress Dashboard.',
  key: 'your secret Record Key. you can omit this if you set a CYPRESS_RECORD_KEY environment variable.',
  spec: 'runs a specific spec file. defaults to "all"',
  reporter: 'runs a specific mocha reporter. pass a path to use a custom reporter. defaults to "spec"',
  reporterOptions: 'options for the mocha reporter. defaults to "null"',
  port: 'runs Cypress on a specific port. overrides any value in cypress.json. defaults to "2020"',
  env: 'sets environment variables. separate multiple values with a comma. overrides any value in cypress.json or cypress.env.json',
  config: 'sets configuration values. separate multiple values with a comma. overrides any value in cypress.json.',
}

const text = (description) => {
  if (descriptions[description] == null) {
    throw new Error(`Could not find description for: ${description}`)
  }

  return descriptions[description]
}

module.exports = {
  init () {
    const program = new commander.Command()

    program
      .command('run')
      .usage('[options]')
      .description('Runs Cypress Headlessly')
      .option('-r, --record [bool]',                       text('record'), coerceFalse)
      .option('-k, --key <record_key>',                    text('key'))
      .option('-s, --spec <spec>',                         text('spec'))
      .option('-r, --reporter <reporter>',                 text('reporter'))
      .option('-o, --reporter-options <reporter-options>', text('reporterOptions'))
      .option('-p, --port <port>',                         text('port'))
      .option('-e, --env <env>',                           text('env'))
      .option('-c, --config <config>',                     text('config'))
      .action((opts) => require('./exec/run').start(parseOpts(opts)))

    program
      .command('open')
      .usage('[options]')
      .description('Opens Cypress normally, as a desktop application.')
      .option('-p, --port <port>',         text('port'))
      .option('-e, --env <env>',           text('env'))
      .option('-c, --config <config>',     text('config'))
      .action((opts) => require('./exec/open').start(parseOpts(opts)))

    program
      .command('install')
      .description('Installs the Cypress executable matching this package\'s version')
      .action(() => require('./download').install({ force: true }))

    program
      .command('verify')
      .description('Verifies the Cypress executable')
      .action(() => require('./download/utils').verify({ force: true }))

    program.parse(process.argv)

    //# if the process.argv.length
    //# is less than or equal to 2
    if (process.argv.length <= 2) {
      //# then display the help
      program.help()
    }

    return program
  },
}