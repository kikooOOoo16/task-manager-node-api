checkIfValidUpdateFields = (reqUpdateFields, allowedUpdateFields, res) => {

    const validUpdateFields = reqUpdateFields.every(updateField => allowedUpdateFields.includes(updateField));

    if (!validUpdateFields || reqUpdateFields.length === 0) {
        return res.status(400).json({
            message: 'Invalid updates!'
        })
    }
}

module.exports = checkIfValidUpdateFields;
