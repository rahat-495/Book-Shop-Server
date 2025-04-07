
import dotenv from "dotenv" ;
import path from "path" ;

dotenv.config({path : path.join(process.cwd() , ".env")}) ;

export default {
    port : process.env.PORT,
    databaseUrl : process.env.DATABASE_URL,
    bcryptSaltRounds : process.env.BCRYPT_SALT_ROUNDS,
    nodeEnv : process.env.NODE_ENV,
    jwtAccessSecret : process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret : process.env.JWT_Refresh_SECRET,
    jwtAccessSecretTime : process.env.JWT_ACCESS_SECRET_TIME,
}
