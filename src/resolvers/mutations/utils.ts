import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ZodError } from 'zod'

const deleteNotUsedFields = <T>(obj: T): T => {
    for (const key in obj) {
        if (obj[key] === null) {
            delete obj[key]
        }
    }
    return obj
}

export type userErrorsType = {
    message: string
}[]

const stringifyZodError = (error: ZodError): userErrorsType => {
    return error.issues.map(field => {
        return { message: `${field.message} (${field.path.join('.')})` }
    })
}

const createJWT = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
}

export { deleteNotUsedFields, stringifyZodError, createJWT }
