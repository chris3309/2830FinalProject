export const validateUsername = (username) => {
    // Regular expression to validate username format
    const usernameRegex = /^[a-z0-9]+$/i;
    return usernameRegex.test(username);
};

  
export const validatePassword = (password) => {
    // Check password requirements (e.g., minimum length, special characters)
    return password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
};
