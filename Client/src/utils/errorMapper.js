export const mapErrorToMessage = (error) => {
  const errorMap = {
    USER_NOT_FOUND: "User does not exist",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_ALREADY_EXISTS: "Account already exists",
    OTP_EXPIRED: "OTP expired. Request new one.",
    MOVIE_NOT_FOUND: "Movie not found",
    SHOW_NOT_FOUND: "Show not found",
    SEAT_CONFLICT: "Seats already booked. Please select different seats.",
    FORBIDDEN: "You are not allowed to perform this action",
    VALIDATION_ERROR: "Invalid input data",
    NETWORK_ERROR: "Network error. Please check connection",
  };

  return errorMap[error?.code] || error?.message || "Something went wrong";
};
