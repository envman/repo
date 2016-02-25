var fs = require('fs')
var GitHubApi = require("github");
var prompt = require('prompt');
var exec = require('child_process').exec;

var repo = process.argv[2]
var name = process.argv[3]

var github = new GitHubApi({
    version: "3.0.0",
    debug: false,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
        "user-agent": "github-template-installer"
    }
});

var properties = [
  {
    name: 'username',
  },
  {
    name: 'password',
    hidden: true
  }
];

prompt.start();

prompt.get(properties, function (err, result) {
  if (err) { return onErr(err); }

  var username = result.username;

  github.authenticate({
      type: "basic",
      username: result.username,
      password: result.password
  });

  console.log(name);
  console.log(repo);

  github.repos.create({ name: name }, function(error, result) {
    var cloneCommand = 'git clone https://github.com/' + username +'/' + repo + '.git ' + name
    exec(cloneCommand, [''], function(err, data) {
      console.log('clone done');

      exec('git remote set-url origin git@github.com:' + username + '/' + name + '.git', {cwd: name}, function(error, data) {
        console.log('remote done');

        exec('git push', {cwd: name}, function(error, data) {
          console.log('push done');
        });
      });
    });
  })
});

function onErr(err) {
  console.log(err);
  return 1;
}
