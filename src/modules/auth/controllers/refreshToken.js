import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'
import CustomError from '../../../middleware/customError.js'

const handleRefreshToken = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
      return next(new CustomError('Forbidden', 403))
    }

    const refreshToken = cookies.jwt
    const foundUser = await Model.findOne({ refreshToken })

    if (!foundUser) {
      return next(new CustomError('Forbidden', 403))
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || String(foundUser._id) !== decoded.id) {
          return next(new CustomError('Forbidden', 403))
        }

        const accessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '50s' }
        )

        res.json({ accessToken })
      }
    )
  })

export default handleRefreshToken

