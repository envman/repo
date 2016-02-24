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
        "user-agent": "envman-template-installer"
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

  github.authenticate({
      type: "basic",
      username: result.username,
      password: result.password
  });

  console.log(name);
  console.log(repo);

  github.repos.create({ name: name }, function(error, result) {
    exec('git clone https://github.com/envman/' + repo + '.git ' + name, [''], function(err, data) {
      console.log('clone done');
      console.log(error);
      console.log(data);

      exec('git remote set-url origin git@github.com:envman/' + name + '.git', {cwd: name}, function(error, data) {
        console.log('remote done');
        console.log(error);
        console.log(data);

        exec('git push', {cwd: name}, function(error, data) {
          console.log('push done');
          console.log(error);
          console.log(data);
        });
      });
    });
  })
});

function onErr(err) {
  console.log(err);
  return 1;
}
