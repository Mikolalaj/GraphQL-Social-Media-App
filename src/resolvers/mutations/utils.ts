const deleteNotUsedFields = (obj: Object): Object => {
    for (const key in obj) {
        if (obj[key] === null) {
            delete obj[key]
        }
    }
    return obj
}

export { deleteNotUsedFields }
