const Mailjs = require("../dist/mailjs.js");

const mailjs = new Mailjs();
(async () => {
    const login = await mailjs.loginWithToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjA0Njk0NjIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6IjEwdGN1QGFyeHh3YWxscy5jb20iLCJpZCI6IjYyZjhjMDc3MTI2ZmVkZDFjODAzN2FjNiIsIm1lcmN1cmUiOnsic3Vic2NyaWJlIjpbIi9hY2NvdW50cy82MmY4YzA3NzEyNmZlZGQxYzgwMzdhYzYiXX19.-5VcwrkJjzL6wcGwrDab8R-Y9v6gzGRB8GZJdqmIWQwzpTsWmoEEtJ6v6OAkBsPwa70Dq07buyxcQ27iTtW35w");
    
    console.log(login);
})();
