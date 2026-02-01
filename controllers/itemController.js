import Groq from "groq-sdk";
const groq = new Groq({ apikey: process.env.GROQ_API_KEY });
import { redisClient } from "../utils/redisClient.js";

export const getSingleItem = async (req, res) => {
  try {
    const { description, itemType } = req.body;

    const getItem = await redisClient.get(`${description}-${itemType}`);

    if (getItem) {
      return res.status(200).json(JSON.parse(getItem));
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a technical product manager and specialized JSON generator. 
                    Return ONLY valid JSON.
                    
                    RULES FOR STORY OR TASK:
                    {
                      "acceptance_criteria": ["string"],
                      "test_cases": [{"title": "string", "steps": ["string"]}],
                      "pointers": 2, 3, 5, or 8
                    }

                    RULES FOR BUG:
                    {
                      "steps": ["string"],
                      "pointers": 2, 3, 5, or 8
                    }

                    POINTERS RULE: Must be a Fibonacci number (2, 3, 5, or 8) based on complexity.`,
        },
        {
          role: "user",
          content: `The item type is: ${itemType}. Analyze this description and return the matching JSON schema: ${description}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 1024,
    });

    await redisClient.setEx(
      `${description}-${itemType}`,
      3600,
      response.choices[0].message.content,
    );

    // Don't forget to parse and send the response back!
    const result = JSON.parse(response.choices[0].message.content);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Failed to generate item." });
  }
};

export const getMultipleItems = async (req, res) => {
  try {
    const { description, storiesCount, taskCount } = req.body;

    const getItems = await redisClient.get(
      `${description}-${storiesCount}-${taskCount}`,
    );

    if (getItems) {
      return res.status(200).json(JSON.parse(getItems));
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
                     You are a technical product manager and a strict JSON generator.

                     Return ONLY valid JSON.
                     Do NOT include explanations, comments, or markdown.

                     The input description is an EPIC.
                     Break the epic into:
                     - ${storiesCount} user stories
                     - ${taskCount} tasks

                     Return a SINGLE ARRAY.
                     Each object in the array MUST follow this exact structure:

                     {
                       "title": "string",
                       "description": "string",
                       "acceptance_criteria": ["string"],
                       "test_cases": [
                         {
                           "title": "string",
                           "steps": ["string"]
                         }
                       ],
                       "pointers": 2 | 3 | 5 | 8
                     }

                     Rules:
                     - pointers MUST be a Fibonacci number (2, 3, 5, or 8) based on complexity
                     - acceptance_criteria must not be empty
                     - test_cases must not be empty
                     - All items (stories and tasks) MUST use the SAME structure
                     - Output must be a valid JSON array only
                    `,
        },
        {
          role: "user",
          content: `Epic Description:${description}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 2048,
    });

    await redisClient.setEx(
      `${description}-${storiesCount}-${taskCount}`,
      3600,
      response.choices[0].message.content,
    );

    const result = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to generate items." });
  }
};
