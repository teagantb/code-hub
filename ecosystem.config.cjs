module.exports = {
    apps: [
        {
            name: "code-hub",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
