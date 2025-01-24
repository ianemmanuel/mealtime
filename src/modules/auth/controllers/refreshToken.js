import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'
import CustomError from '../../../middleware/customError.js'
import { redis } from "../../../lib/redis.js"

const handleRefreshToken = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
      return next(new CustomError('Forbidden', 403))
    }

    const refreshToken = cookies.jwt

    //? Decode the refresh token to extract the user ID
    const decoded = jwt.decode(refreshToken)
    if (!decoded?.id) {
        return next(new CustomError('Forbidden', 403))
    }

    const userId = decoded.id
    let storedRefreshToken

    try {
      //? Attempt to fetch the refresh token from Redis
      const redisKey = `refresh_token:${userId}`;
      storedRefreshToken = await redis.get(redisKey);

      if (!storedRefreshToken) {
          const foundUser = await Model.findById(userId).select('refreshToken')
          if (!foundUser || foundUser.refreshToken !== refreshToken) {
              return next(new CustomError('Forbidden', 403))
          }
          storedRefreshToken = foundUser.refreshToken;
      }
    } catch (error) {
        console.error("Error checking refresh token:", error)
        return next(new CustomError('Internal Server Error', 500))
    }


    if (refreshToken !== storedRefreshToken) {
      return next(new CustomError('Forbidden', 403));
    }
    console.log(userId)
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || String(userId) !== decoded.id) {
          return next(new CustomError('Forbidden', 403))
        }

        const accessToken = jwt.sign(
          { id: userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1d' }
        )

        res.json({ accessToken })
      }
    )
  })

export default handleRefreshToken

