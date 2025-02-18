import express, { Application, Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, users, roles } from "./db";
import { eq } from "drizzle-orm";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


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
// app.post("/api/register-super-admin", async (req: Request, res: Response) => {
app.post('/api/register-super-admin', async (req: Request, res: Response) => {

  try {
    const { fullname, companyName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminRole = await db.select().from(roles).where(eq(roles.name, "Super Admin")).execute();

    if (adminRole.length === 0) {
        res.status(400).json({ error: "Super Admin role does not exist" });
    }

    await db.insert(users).values({
      fullname,
      email,
      password: hashedPassword,
      roleId: adminRole[0].id,
    }).execute();

    res.status(201).json({ message: "Super Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add User
app.post("/api/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullname, email, roleId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();
    if (existingUser.length > 0) {
        res.status(400).json({ error: "User already exists" });
    }

    await db.insert(users).values({ fullname, email, roleId, password: hashedPassword }).execute();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.select().from(users).where(eq(users.email, email)).execute();
    if (!user.length)  res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword)  res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user[0].id, role: user[0].roleId },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


export default app;
