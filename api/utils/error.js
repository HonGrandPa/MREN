export const errorHandler = (statusCode, message) => {

    const error = new Error(); // <- create an arr object
    error.statusCode =  statusCode;
    error.message = message
    return error;
}