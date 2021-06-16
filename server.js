const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mongo = require("mongoose");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const path = require("path");
const server = require("http").createServer(app);
/// routes
const routePost = require("./route/postRoute");
const routeUser = require("./route/usersRoute");
const commentRoute = require("./route/commentsRoute");

const env = process.env.MODE_ENV || "development";
const config = require("./config/config")[env];
//// protect
const protectRoute = require("./midllewaire/protectRoute");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
    allowedHeaders: ["x-auth-token"],
  },
});

const oprton = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
const uri = `mongodb+srv://${config.User}:${config.Pass}@cluster0.lnufr.mongodb.net/${config.Name}?retryWrites=true&w=majority`;
mongo
  .connect(uri, oprton)
  .then((res) => {
    console.log("connect success mongo");
  })
  .catch((err) => console.log("error s :" + err));
const conn = mongo.connection;

conn.on("connected", () => console.log("success conenected"));
conn.on("error", () => console.log("error conneted to database mongo"));

io.on("connection", (socket) => {
  socket.on("online", function (data) {
    socket.broadcast.emit("onlineuser", { userId: data.userId });
  });
  socket.on("ofline", function (data) {
    socket.broadcast.emit("oflineuser", { userId: data.userId });
  });

  socket.on("add", function (data) {
    console.log("groupe is is : " + data.groupe);
    socket.to(data.groupe).emit("recev", {
      text: data.text,
      userId: data.userId,
      username_u: data.username_u,
      dateCreate: data.dateCreate,
    });
  });
  socket.on("joinGroup", (data) => {
    socket.join(data);
    console.log("hahaah :" + data);
  });
  socket.on("typing", function (data) {
    socket.broadcast.emit("typings", { nickname: data.nickname });
  });
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
io.attach(server);
// protected routes
// app.post("/comments/add", protectRoute);
// app.post("/posts/add", protectRoute);
app.put("/posts/update", protectRoute);
app.put("/users/update", protectRoute);
app.put("/posts/privacy", protectRoute);
app.get("/posts/videos/:user?", protectRoute);
// media use
app.get("/videos/:id", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/videos/" + req.params.id));
});
app.get("/thumbnail/:id", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/thumbnail/" + req.params.id));
});

// routes use
app.use("/posts", routePost);
app.use("/users", routeUser);
app.use("/comments", commentRoute);
//// vue
app.use("*", (req, res, next) => {
  if (req.baseUrl.trim() === "") {
    req.baseUrl = "index.html";
  }
  res.sendFile(path.resolve(__dirname, `./public/${req.baseUrl}`), (err) => {
    if (err) {
      res.sendFile(path.resolve(__dirname, "./public/index.html"));
    }
  });
});
app.use(function (err, req, res, next) {
  const error = {
    code: err.code,
    message: err,
  };

  res.status(err.status || 500);
  res.json({ error });
});
server.listen(port, () => console.log("success  connect express"));
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
}
// server.listen(port, () => console.log("success"));
