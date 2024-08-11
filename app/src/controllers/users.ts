import prisma from '../prisma/client'
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { stringToBitmask } from '../utils/bitmask';
import { SECRET_KEY, userIdFromJWT } from '../middleware/auth';

const saltRounds = 8

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, saltRounds),
        email
      }
    });
    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      },
    });
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const roleBitMask = stringToBitmask(user.role);
        const token = jwt.sign({ id: user.id, name: user.username, email: user.email, role: user.role }, SECRET_KEY, {
          expiresIn: '2 days',
        });
        res.json(token);
      } else {
        res.json("User/password is not correct");
      }
    } else {
      res.json("User/password is not correct");
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};

export const meUser = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(403).send('Please authenticate');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userIdFromJWT(token)) },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(400).send("No such user");
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};

export const updateUserRoleById = async (req: Request, res: Response) => {
  const { role } = req.body;
  const { id }: { id?: string } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        role: role
      }
    });
    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};