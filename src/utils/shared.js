checkIfValidUpdateFields = async function(reqUpdateFields, allowedUpdateFields, res) {

    const validUpdateFields = reqUpdateFields.every(updateField => allowedUpdateFields.includes(updateField));

    if (!validUpdateFields || reqUpdateFields.length === 0) {
        throw new Error('Invalid update field!');
    }
}

module.exports = checkIfValidUpdateFields;
