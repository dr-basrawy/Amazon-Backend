const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
  "http://localhost:4200",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      //null=no error ,true=pass
      callback(null, true);
    } else {
      callback(new Error("not Allowed By cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = { allowedOrigins, corsOptions };
