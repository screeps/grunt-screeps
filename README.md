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
                email: 'YOUR_EMAIL',
                password: 'YOUR_PASSWORD',
                branch: 'default',
                ptr: false,
                http_proxy: 'http://YOUR_PROXY_HOST:YOUR_PROXY_PORT',
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}
```

Now you can run this command to commit your code from `dist` folder to your Screeps account:
```
grunt screeps
```
