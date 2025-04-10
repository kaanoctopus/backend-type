export const config = {
    database: {
        uri: process.env.MONGO_URI,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        authKey: process.env.AUTH_KEY,
    },
    email: {
        service: process.env.EMAIL_SERVICE,
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM,
    },
};
