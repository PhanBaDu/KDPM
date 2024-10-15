import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await prisma.project.findMany();
        res.json(project);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving projects ${error.message}`});
    }
}

export const createProject = async (req: Request, res: Response): Promise<void> => {
    const { name, description, startDate, endDate } = req.body;
    try {   
        if (name.length < 4 || description.length < 4) {
            res.status(403).json({ message: "Please enter all information with length > 3" })
            return;
        }

        if (startDate > endDate) {
            res.status(403).json({ message: "Start date must be less than deadline" })
            return;
        }
        
        const existingProject = await prisma.project.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(),
                    mode: 'insensitive',
                }
            },
        });
        
        if (existingProject) {
            res.status(403).json({ message: "This project name already exists"});
            return
        }

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                startDate,
                endDate,
            },
        });

        res.status(201).json(newProject);
    } catch (error: any) {
        res.status(500).json({ message: `Error creating project: ${error.message}`});
    }
}