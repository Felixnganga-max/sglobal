const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("Generated Token:", token);
  console.log("Current NODE_ENV:", process.env.NODE_ENV);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // Explicitly set to false for development
    sameSite: "lax", // Set to lax for development
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
