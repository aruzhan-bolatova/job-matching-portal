import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import Job from "../models/Job";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithGemini = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;

    if (!message) {
        res.status(400).json({ error: "Missing message in request body" });
    }

    try {

        // Fetch available jobs from DB
        const jobs = await Job.find({ status: "open" }).limit(10);

        // Build job list string for context
        const jobList = jobs.map(job =>
            `- ${job.title} at ${job.company} (${job.location})`
        ).join("\n");

        // console.log("Job List:", jobList);

        // Construct context message for Gemini
        const systemPrompt = `You are a helpful job recommendation assistant for an online job portal.
                            The user can ask for jobs by role, location, or skill.
                            You have access to the following job postings: ${jobList}

                            When the user asks for jobs or application help, suggest appropriate jobs from this list. 
                            If the list is empty, suggest applying later. Send the response as formatted HTML`;


        // Generate content with context + user message
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "user", parts: [{ text: message }] }
            ]
        });

        const aiReply = response.text;
        res.status(200).json({ reply: aiReply });
        // console.log("Gemini Response:", aiReply);

    } catch (error: any) {
        console.error("Gemini API Error:", error.message || error.response?.data);
        res.status(500).json({
            500: "Internal Server Error",
            error: error.message || "Failed to get response from Gemini chatbot",
        });
    }
};