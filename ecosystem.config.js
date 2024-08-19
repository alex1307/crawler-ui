module.exports = {
    apps: [
        {
            name: 'crawler-ui',
            script: 'yarn',
            args: 'serve',
            cwd: '/crawler-ui', // Update this to your project directory
            interpreter: '/bin/bash', // Ensure the script runs in a bash shell
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
            env_development: {
                NODE_ENV: 'development',
            },
        },
    ],
};