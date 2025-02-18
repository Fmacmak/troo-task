import express, { Application, Request, Response, NextFunction } from 'express';
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import { db, users, roles, companies } from "./db";
import { eq } from "drizzle-orm";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




app.get('/db/health', async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        // Simple query to check database connection
        await db.select().from(users).limit(1);
        res.status(200).json({ status: 'healthy' });
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(500).json({ status: 'unhealthy', error: 'Database connection failed' });
    }
});




app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy' });
  });



// Super Admin Registration
app.post('/api/register-super-admin', async (req: Request, res: Response) => {

  try {
    const { fullname, companyName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminRole = await db.select().from(roles).where(eq(roles.name, "Super Admin")).execute();

    if (adminRole.length === 0) {
        res.status(400).json({ error: "Super Admin role does not exist" });
    }

    const newCompany = await db.insert(companies)
      .values({
        companyName,
      })
      .returning({ insertedId: companies.id })
      .execute();

    await db.insert(users).values({
      fullname,
      email,
      password: hashedPassword,
      roleId: adminRole[0].id,
      companyId: newCompany[0].insertedId,
    }).execute();

    res.status(201).json({ message: "Super Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add User
//@ts-ignore
app.post("/api/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const { fullname, email, roleId, password, companyId } = req.body;

    // const hashedPassword = await bcrypt.hash(password, 'troo');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();
    if (existingUser.length > 0) {
        return res.status(400).json({ error: "User already exists" });
    }

    await db.insert(users).values({ fullname, email, roleId, password: hashedPassword, companyId }).execute();

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login
//@ts-ignore
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.select().from(users).where(eq(users.email, email)).execute();
    if (!user.length)  return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword)  return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user[0].id, role: user[0].roleId },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default app;
