const deleteNotUsedFields = <T>(obj: T): T => {
    for (const key in obj) {
        if (obj[key] === null) {
            delete obj[key]
        }
    }
    return obj
}

export { deleteNotUsedFields }
