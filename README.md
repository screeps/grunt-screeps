# grunt-screeps

> A Grunt plugin for committing code to your [Screeps](https://screeps.com) account.

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-screeps
```

### Usage Example

**Gruntfile.js:**
```js
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        creds: grunt.file.readJSON('config/screeps-creds.json'),
        screeps: {
            options: {
                email: '<%= creds.email %>',
                password: '<%= creds.password %>',
                branch: grunt.option('branch') || 'default',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
};
```

#### Screep credentials

Add a new file to your project: `config/screeps-creds.json`

```
{
  "email": "<Your Email>",
  "password": "<Your Password>"
}
```

Ensure that file is added to your `.gitignore` file to avoid committing your credentials to GitHub.

#### Deploy to Screeps

Now you can run this command to deploy your code from `dist` folder to the `default` branch on your Screeps account:

```
grunt screeps
```

Or, to deploy to a specific branch:

```
grunt screeps --branch=mybranch
```

Note: You must create the branch on Screeps first before you can deploy to it
