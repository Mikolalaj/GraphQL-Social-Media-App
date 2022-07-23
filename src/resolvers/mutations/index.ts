import { PostMutations } from './Post'
import { AuthMutations } from './Auth'

export const Mutation = {
    ...PostMutations,
    ...AuthMutations,
}
