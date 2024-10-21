const jwt = require("jsonwebtoken")

const sign = (payload:any) => {
    return jwt.sign(payload, "SECRET_KEY")
}

const verify = (token:any) => {
   return jwt.verify(token, "SECRET_KEY")
}

export {verify, sign}
