module.exports = (req, res, next) => {
  // const { method, path, body } = req;
  // if (method === "POST" && path === "/login") {
  //   if (body.username === "Riceecir" && body.password === "123456") {
  //     return res.status(200).json({
  //       user: {
  //         token: "uihdfh",
  //       },
  //     });
  //   } else {
  //     return res.status(400).json({
  //       message: "用户们或密码错误",
  //     });
  //   }
  // }

  next();
};
