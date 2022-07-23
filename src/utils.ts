import jwt from 'jsonwebtoken'

const getUserFromToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    } catch (error) {
        return null
    }
}

export { getUserFromToken }
