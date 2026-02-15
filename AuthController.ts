import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthController {
  
  /**
   * FR-001: User Registration
   * Creates User and Profile transactionally
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      console.log('Register Payload:', req.body); // Debug log to see what frontend sends
      let { email, password, firstName, lastName, name } = req.body;

      // Support for 'name' field from frontend (splits into firstName/lastName)
      if (name && (!firstName || !lastName)) {
        const nameParts = name.trim().split(/\s+/);
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
        
        // Ensure lastName is not empty (Prisma constraint)
        if (!lastName) lastName = '.';
      }

      // Basic Validation
      if (!email || !password || !firstName) {
        res.status(400).json({ message: 'Missing required fields: email, password, name' });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({ message: 'User with this email already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Transaction: Create User -> Create Profile
      const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'STUDENT', // Default role
          },
        });

        await tx.profile.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            skills: [], // Initialize empty skills
          },
        });

        return user;
      });

      // Generate JWT Token
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        }
      });

    } catch (error: any) {
      console.error('Registration Error Detailed:', error);
      // Return the actual error message so the frontend displays "Table 'User' does not exist" etc.
      res.status(500).json({ 
        message: error.message || 'Internal server error during registration',
        details: error.meta 
      });
    }
  }

  /**
   * FR-002: User Login
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '24h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}