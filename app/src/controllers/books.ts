import prisma from '../prisma/client'
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express';

export const createBook = async (req: Request, res: Response) => {
  const { title, author, publicationDate, genres } = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        publicationDate: new Date(publicationDate),
        genres
      }
    });
    res.json(book);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};
  
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};
  
export const getBookById = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) }
    });
    res.json(book);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};
  
export const updateBookById = async (req: Request, res: Response) => {
  const { title, author, publicationDate, genres } = req.body;
  const { id }: { id?: string } = req.params;
  try {
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publicationDate: new Date(publicationDate),
        genres
      }
    });
    res.json(book);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};
  
export const deleteBookById = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;
  try {
    const book = await prisma.book.delete({
      where: {
        id: Number(id),
      }
    });
    res.json(book);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).send(error.message);
    }
  }
};