[![npm version](https://badge.fury.io/js/grunt-screeps.svg)](https://badge.fury.io/js/grunt-screeps)

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
        screeps: {
            options: {
                accountAlias: 'LABEL_FOR_THIS_ACCOUNT',
                branch: 'default',
                ptr: false,
                // token is used for the public server, will be preferred if
                // both are provided.
                token: 'YOUR_AUTH_TOKEN',
                // email/password are used for private servers.
                email: 'YOUR_EMAIL',
                password: 'YOUR_PASSWORD'
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.{js,wasm}'],
                        flatten: true
                    }
                ]
            }
        }
    });
}
```

Now you can run this command to commit your code from `dist` folder to your Screeps account:
```
grunt screeps
```

See more advanced usage examples in [this docs article](http://docs.screeps.com/contributed/advanced_grunt.html).
