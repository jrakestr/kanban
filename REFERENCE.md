Here’s what each of the installed packages does:

Express is a web framework for Node.js used for server creation
dotenv helps read all the environment variables
bcrypt is used to encrypt a password
jsonwebtoken are often used to identify a user, as well as to transmit information about the user, and the tokens are often used for authentication and authorization in web applications
concurrently is a Node.js utility that allows you to run multiple npm scripts concurrently in a single terminal
memory-cache is a simple in-memory caching library for Node.js. It provides a way to store data in memory so that it can be quickly accessed and retrieved
Install TypeScript type definitions for these dependencies:
Since we are working with TypeScript, it is a good idea to install @types for our dependencies.

npm i @types/express @types/bcrypt @types/jsonwebtoken @types/memory-cache
Now, we need to make some modifications to the generated files.

Modifying Project Files
New Folder Structure:

step-by-step
 ┣ src
 ┃ ┣ controllers
 ┃ ┃ ┣ auth.controller.ts
 ┃ ┃ ┣ movie.controllers.ts
 ┃ ┃ ┗ user.controllers.ts
 ┃ ┣ dto
 ┃ ┃ ┗ user.dto.ts
 ┃ ┣ entity
 ┃ ┃ ┣ Movies.entity.ts
 ┃ ┃ ┗ User.entity.ts
 ┃ ┣ helpers
 ┃ ┃ ┗ encrypt.ts
 ┃ ┣ middleware
 ┃ ┃ ┣ errorHandler.ts
 ┃ ┃ ┣ authentification.ts
 ┃ ┃ ┗ authorization.ts
 ┃ ┣ migration
 ┃ ┃ ┣ 1698321500514-user.ts
 ┃ ┃ ┗ 1698321512351-movie.ts
 ┃ ┣ routes
 ┃ ┃ ┣ movie.routes.ts
 ┃ ┃ ┗ user.routes.ts
 ┃ ┣ data-source.ts
 ┃ ┗ index.ts
 ┣ .env
 ┣ .gitignore
 ┣ package-lock.json
 ┣ package.json
 ┣ README.md
 ┗ tsconfig.json
package.json
Update package.json file with the following dependencies

{
  "name": "restTye",
  "version": "0.0.1",
  "description": "Awesome project developed with TypeORM.",
  "type": "commonjs",
  "devDependencies": {
    "@types/bcrypt": "^5.0.1",
    "@types/express": "^4.17.20",
    "@types/jsonwebtoken": "^9.0.4",
    "@types/memory-cache": "^0.2.4",
    "@types/node": "^16.11.10",
    "concurrently": "^8.2.2",
    "ts-node": "10.7.0",
    "typescript": "4.5.2"
  },
  "dependencies": {
    "@types/cors": "^2.8.15",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "memory-cache": "^0.2.0",
    "pg": "^8.4.0",
    "reflect-metadata": "^0.1.13",
    "typeorm": "0.3.17"
  },
  "scripts": {
    "watch": "tsc -w",
    "dev": "nodemon build/index.js",
    "start:dev": "concurrently \"tsc -w\" \"nodemon build/index.js\"",
    "build": "tsc",
    "start": "ts-node src/index.ts",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration": " npm run typeorm migration:run -- -d ./src/data-source.ts"
  }
}
This includes the necessary dependencies, scripts for development, and running migrations.

As you can see I’m using concurrently to run both “tsc -w” and “nodemon build/index.js” so to run my app I will just run npm run start: dev it will compile the ts file to js then run nodemon

src/index.ts
Here’s an improved src/index.ts file:

import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { userRouter } from "./routes/user.routes";
import { movieRouter } from "./routes/movie.routes";
import "reflect-metadata";
dotenv.config();

const app = express();
app.use(express.json());
app.use(errorHandler);
const { PORT = 3000 } = process.env;
app.use("/auth", userRouter);
app.use("/api", movieRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
This index.ts file sets up our Express.js server, applies routes, and starts the server. It also includes routes for both user-related and movie-related endpoints.

src/data-source.ts
Here’s the updated src/data-source.ts file:

This file handles database configuration, including reading environment variables. Make sure your .env file contains the necessary database connection details.

import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import { User } from "./entity/User.entity";
import { Movie } from "./entity/Movies.entity";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,

  synchronize: NODE_ENV === "dev" ? false : false,
//logging logs sql command on the treminal
  logging: NODE_ENV === "dev" ? false : false,
  entities: [User, Movie],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});
Entities
These define the structure of the database tables:

User Entity
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: "user" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
Movie Entity
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "movies" })
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  director: string;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false })
  rating: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  cast: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
I’m using uuid but you can use rowid and incremental,… and I do not want my field to be empty that’s why I’m passing the nullable option as false

src/helpers/helpers.ts

The encrypt class helps us to encrypt our password, compare it for the logging process, and generate a token

import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { payload } from "../dto/user.dto";

dotenv.config();
const { JWT_SECRET = "" } = process.env;
export class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}
Middleware
Error Handling
Let’s set up global error-handling middleware in src/middlewares/error.middleware.ts:

import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${error.message}`);
  return res.status(500).json({ message: "Internal server error" });
};

Authentication and Authorization Middleware
In src/middlewares/auth.middleware.ts, implement authentication and authorization middleware:

import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req[" currentUser"] = decode;
  next();
};
We are checking if the request has a header with the authorization property if it does not we return unauthorized that user will not access a certain route if it has we extract the token from it and then decode it with the secret key we used to generate the token with if it is correct we pass the data in the token to the request to make available to the rest of the app. if the token is not decoded the next function will not be called

import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req[" currentUser"].id },
    });
    console.log(user);
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
Customizing User Data with user.dto.ts
There has been interest expressed in utilizing a user.dto.ts file to tailor the user data sent in API responses. While this specific file wasn't explicitly included in the provided code samples, it serves as a potent tool to structure and modify data intended for API responses.

What is user.dto.ts?
The user.dto.ts file, which stands for Data Transfer Object, allows for precise customization of the format and content of user data before it's sent as a response from the API. By defining specific interfaces, structures, or transformation logic within this file, developers can finely shape the user data to match the requirements of the application or client consuming the API. And secure some user data

Utilizing user.dto.ts
Here’s an example of how you might structure a user.dto.ts file:

export class UserResponce {
  name: string;
  email: string;
  role: string;
}
How to Use
In scenarios where customization of the user data sent in the API response is necessary, the user.dto.ts file can be employed. Define the structure of the UserDTO interface based on the desired response format before sending it as a response.

This approach offers flexibility in tailoring API responses to meet specific requirements, enhancing the interoperability and efficiency of your application.

Feel free to integrate and adapt the user.dto.ts file based on your project's needs, enabling precise control over the data being transmitted via your API endpoints.

In the case of this project this is how I would have used it:

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";
import { UserResponce} from "../dto/user.dto"; // Import UserDto from the correct path
import * as cache from "memory-cache";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { name, email, password, role } = req.body;
    const encryptedPassword = await encrypt.encryptpass(password);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;
    user.role = role;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);
// Use the UserResponse DTO to structure the data being sent in the response
const userdataSent = new UserResponce()
userDataSent.name = user.name;
userDataSent.email= user.email;
userDataSent.role = user.role;


    
    const token = encrypt.generateToken({ id: user.id });

    return res
      .status(200)
      .json({ message: "User created successfully", token, userDataSent });
  }
Ensure the UserResponse class is correctly imported into the UserController file and the properties align with the data you want to send in the API response. This approach allows for precise customization of the user data being transmitted via API endpoints.

Controllers
Define controller methods for both user and movie entities:

a controller is a component responsible for handling and processing incoming requests from clients (typically web browsers) and orchestrating the application’s logic. Controllers play a central role in separating the concerns of an application, helping to keep the code organized and maintainable. You will notice in our getalluser and get movies we are trying to get data from the cache memory if it exists if it does not exist then we fetch it from the database the put it in the cache for some time

Auth Controller (src/controllers/Auth.controller.ts)
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: " email and password required" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      const isPasswordValid = encrypt.comparepassword(user.password, password);
      if (!user || !isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = encrypt.generateToken({ id: user.id });

      return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    if (!req[" currentUser"]) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req[" currentUser"].id },
    });
    return res.status(200).json({ ...user, password: undefined });
  }
}
User Controller (src/controllers/user.controller.ts)
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";
import * as cache from "memory-cache";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { name, email, password, role } = req.body;
    const encryptedPassword = await encrypt.encryptpass(password);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;
    user.role = role;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    // userRepository.create({ Name, email, password });
    const token = encrypt.generateToken({ id: user.id });

    return res
      .status(200)
      .json({ message: "User created successfully", token, user });
  }
  static async getUsers(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      cache.put("data", users, 6000);
      return res.status(200).json({
        data: users,
      });
    }
  }
  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.status(200).json({ message: "udpdate", user });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    await userRepository.remove(user);
    res.status(200).json({ message: "ok" });
  }
}
Movie Controlle(src/controllers/movie.controller.ts)
import { Request, Response } from "express";
import * as cache from "memory-cache";
import { AppDataSource } from "../data-source";
import { Movie } from "../entity/Movies.entity";

export class MovieController {
  static async getAllMovies(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const movieRepository = AppDataSource.getRepository(Movie);
      const movies = await movieRepository.find();
      cache.put("data", movies, 10000);
      return res.status(200).json({
        data: movies,
      });
    }
  }
  static async createMovie(req: Request, res: Response) {
    const { title, description, director, year, rating, image, cast } =
      req.body;
    const movie = new Movie();
    movie.title = title;
    movie.description = description;
    movie.director = director;
    movie.year = year;
    movie.rating = rating;
    movie.image = image;
    movie.cast = cast;
    const movieRepository = AppDataSource.getRepository(Movie);
    await movieRepository.save(movie);
    return res
      .status(200)
      .json({ message: "Movie created successfully", movie });
  }

  static async updateMovie(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, director, year, rating, image, cast } =
      req.body;
    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id },
    });
    movie.title = title;
    movie.description = description;
    movie.director = director;
    movie.year = year;
    movie.rating = rating;
    movie.image = image;
    movie.cast = cast;
    await movieRepository.save(movie);
    return res
      .status(200)
      .json({ message: "Movie updated successfully", movie });
  }

  static async deleteMovie(req: Request, res: Response) {
    const { id } = req.params;
    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id },
    });
    await movieRepository.remove(movie);
    return res
      .status(200)
      .json({ message: "Movie deleted successfully", movie });
  }
}
User Routes
In the src/routes/user.routes.ts file, define routes related to user management:

routes refer to the specific URLs or endpoints within a web application that clients can access to perform various actions or request specific resources. Routes are a fundamental part of defining how the web application responds to incoming HTTP requests.

import * as express from "express";
import { authentification } from "../middleware/authentification";
import { UserController } from "../controllers/user.controllers";
import { authorization } from "../middleware/authorization";
import { AuthController } from "../controllers/auth.controller";
const Router = express.Router();

Router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  UserController.getUsers
);
Router.get(
  "/profile",
  authentification,
  authorization(["user", "admin"]),
  AuthController.getProfile
);
Router.post("/signup", UserController.signup);
Router.post("/login", AuthController.login);
Router.put(
  "/update/:id",
  authentification,
  authorization(["user", "admin"]),
  UserController.updateUser
);
Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  UserController.deleteUser
);
export { Router as userRouter };
Movie Routes
import * as express from "express";
import { authentification } from "../middleware/authentification";
import { MovieController } from "../controllers/movie.controllers";
import { authorization } from "../middleware/authorization";

const Router = express.Router();

Router.get("/movies", authentification, MovieController.getAllMovies);
Router.post("/movies", authentification, MovieController.createMovie);

Router.put(
  "/movies/:id",
  authentification,
  authorization(["admin"]),
  MovieController.updateMovie
);
Router.delete(
  "/movies/:id",
  authentification,
  authorization(["admin"]),
  MovieController.deleteMovie
);
export { Router as movieRouter };
Middleware Ordering
Express.js executes middleware in the order they are defined. It’s important to place middleware in the correct order in the route definitions.

For example user routes, we have two middleware functions: authenticate and authorize. authenticate should come first, as it verifies the user's identity. authorize should follow and ensure that the user has the appropriate role.

Migration
We need to create and run migrations for our entities to generate the corresponding database tables as the documentation says

“Once you get into production you’ll need to synchronize model changes into the database. Typically, it is unsafe to use synchronize: true for schema synchronization on production once you get data in your database. Here is where migrations come to help. Read more about it”

This command generates a migration file in the src/migration directory. Edit the generated migration file to define your table structure and run the migration as shown in the code below

typeorm migration:create ./migrations/users
import { MigrationInterface, QueryRunner } from "typeorm";

export class User1698321500514 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
// this part you will add your self
    await queryRunner.query(
      ` 
          --Table Definition
          CREATE TABLE "users"  (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "role"  character varying NOT NULL DEFAULT 'user',
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )

          
          
          
          
          `
    ),
      undefined;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
// and this part
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
import { MigrationInterface, QueryRunner } from "typeorm";

export class Movie1698321512351 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        --Table Definition
        CREATE TABLE "movies"  (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "title" character varying NOT NULL,
            "description" character varying NOT NULL,
            "director" character varying NOT NULL,
            "year" integer NOT NULL,
            "rating" character varying NOT NULL,
            "image" character varying NOT NULL,
            "cast" character varying NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
          )
          
          
          
          
          
          `),
      undefined;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies"`, undefined);
  }
}
In your package JSON you should add a script in order to run your migration:

   "migration": " npm run typeorm migration:run -- -d ./src/data-source.ts"
the data-source.ts is where the database configuration is located

Testing
To test your API, you can use tools like Postman, cURL, or any other HTTP client. You can make requests to your API endpoints to ensure that they work as expected.

Error Handling
In the provided errorHandler middleware, any unhandled errors are caught, logged, and a generic error response is sent to the client. You can customize this middleware to suit your error-handling needs.

Conclusion

In this tutorial, we embarked on a journey to create a powerful REST API using TypeScript, Express.js, and TypeORM. Along the way, we explored essential concepts such as authentication, authorization, and database interactions. Let’s recap what we’ve learned:

We understood the importance of Object-Relational Mapping (ORM) and how TypeORM streamlines database interactions, particularly in TypeScript applications.
Caching was demystified as a technique to improve data access and retrieval speed, enhancing system performance.
We set up our project, installed dependencies, and established key configuration files.
Now, equipped with this knowledge, you have the foundation to build robust web applications. But remember, this is just the beginning. There’s a vast world of web development waiting to be explored, and we encourage you to dive deeper, explore more advanced topics, and expand the functionality of your API.

