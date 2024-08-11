import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client'
import { stringToBitmask } from '../utils/bitmask'

export const SECRET_KEY: Secret = 'SECRET_KEY';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(403).send('Please authenticate');
  }
};

declare module 'jsonwebtoken' {
  export interface UserRoleJwtPayload extends jwt.JwtPayload {
    role: string
  }
}

export const userRoleFromJWT = (jwtToken: string): number => {
  try {
      const { role } = <jwt.UserRoleJwtPayload>jwt.verify(jwtToken, SECRET_KEY);
      return stringToBitmask(role);
  } catch (error) {
      return 0;
  }
}

declare module 'jsonwebtoken' {
  export interface UserIdJwtPayload extends jwt.JwtPayload {
    role: string
  }
}

export const userIdFromJWT = (jwtToken: string): number => {
  try {
      const { id } = <jwt.UserIdJwtPayload>jwt.verify(jwtToken, SECRET_KEY);
      return +id;
  } catch (error) {
      return 0;
  }
}

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const admin = await prisma.role.findUnique({
      where: { title: "Admin" }
    });

    if (!admin) {
      throw new Error("No admin role");
    }

    const role = userRoleFromJWT(token);
    const adminRole = stringToBitmask(admin.bitMask);


    if (role & adminRole) {
      const decoded = jwt.verify(token, SECRET_KEY);
      (req as CustomRequest).token = decoded;
      next();
    } else {
      res.status(403).send('Admin permissions required');
    }
  } catch (err) {
    res.status(403).send('Please authenticate');
  }
};
