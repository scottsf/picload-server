import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const header = request.request 
    ? request.request.headers.authorization 
    : request.connection.context.Authorization // request.connection auth for socket (closing up subscription)
  // console.log('header: ', header)
  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('decoded :', decoded)
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }

  return null
};

export { getUserId as default };
