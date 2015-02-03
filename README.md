# grunt-screeps

> A Grunt plugin for commiting code to your Screeps account

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-screeps 
```

### Usage Example

```js
grunt.loadNpmTasks('grunt-screeps');

grunt.initConfig({
    screeps: {
        options: {
            email: 'YOUR_EMAIL',
            password: 'YOUR_PASSWORD
        },
        dist: {
            src: ['dist/*.js']
        }
    }
});
```

