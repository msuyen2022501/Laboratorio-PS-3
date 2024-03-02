"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import publicacionesRoutes from "../src/publicaciones/publicaciones.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/GestorOpiniones/v1/user'
    this.authPath = '/GestorOpiniones/v1/auth'
    this.publicacionesPath = '/GestorOpiniones/v1/publicaciones'

    this.middlewares();
    this.conectarDB();
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes(){
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.publicacionesPath, publicacionesRoutes);
}

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
 