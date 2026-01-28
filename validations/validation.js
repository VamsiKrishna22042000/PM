import { z } from "zod"

export const userSchema = z.object({
    name: z.string().nonempty("Name is required!"),
    email: z.string().email("Enter Valid email address!"),
    role: z.enum(["Admin", "Manager", "Member"], "Role is required! Admin or Manager or Memeber").optional(),
    orgId: z.string().nonempty("Organization Id is required!"),
    password: z.string().nonempty("Password is required").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?]).{8,}$/,
        "Password must have at least 1 uppercase, 1 lowercase, 1 special character, and minimum 8 characters"
    ),
})


export const userLoginSchema = z.object({
    email: z.string().email("Valid email is required!"),
    password: z
        .string()
        .nonempty("Password is required")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?]).{8,}$/,
            "Password must have at least 1 uppercase, 1 lowercase, 1 special character, and minimum 8 characters"
        ),
});


export const projectsSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    status: z.enum(["Active", "Archived", "Backlog"]).optional(),
    createdBy: z.string().nonempty("Created By Id is required!")
})


export const editProjectsSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    status: z.enum(["Active", "Archived", "Backlog"]).optional(),
})


export const taskCreationSchema = z.object({
    name: z.string().nonempty("Name is required!"),
    type: z.enum(["Story", "Bug", "TechDeb", "Task"], {
        required_error: "Type should be Story, Bug, TechDeb or Task!",
    }).optional(),
    pointers: z.number().int(),
    priority: z.enum(["High", "Medium", "Low"], {
        required_error: "Priority should be High, Medium or Low!",
    }).optional(),
    description: z.string().nonempty("Description is required!"),
    stage: z.enum(
        ["Todo", "Inprogress", "AwaitingDeployment", "DeployedReadyToTest", "Done"],
        { required_error: "Stage should be Todo, Inprogress, AwaitingDeployment, DeployedReadyToTest or Done!" }
    ).optional(),
    startTime: z.string().datetime("Start Time is required!"),
    endTime: z.string().datetime("End Time is required!"),
    createdBy: z.string().nonempty("Created By Id is required!"),
    assignedTo: z.string().nonempty("Assigned to is required!"),
});

export const taskEditSchema = z.object({
    name: z.string().nonempty("Name is required!").optional(),
    pointers: z.number().int().optional(),
    type: z.enum(["Story", "Bug", "TechDeb", "Task"], {
        required_error: "Type should be Story, Bug, TechDeb or Task!",
    }).optional(),
    priority: z.enum(["High", "Medium", "Low"], {
        required_error: "Priority should be High, Medium or Low!",
    }).optional(),
    description: z.string().nonempty("Description is required!").optional(),
    stage: z.enum(
        ["Todo", "Inprogress", "AwaitingDeployment", "DeployedReadyToTest", "Done"],
        { required_error: "Stage should be Todo, Inprogress, AwaitingDeployment, DeployedReadyToTest or Done!" }
    ).optional(),
    startTime: z.string().datetime("Start Time is required!").optional(),
    endTime: z.string().datetime("End Time is required!").optional(),
    assignedTo: z.string().nonempty("Assigned to is required!").optional(),
});



export const requestCreateSchema = z.object({
    name: z.string().nonempty("Name is required!"),
    description: z.string().nonempty("Description is required!"),
    type: z.enum(["Story", "Bug", "TechDeb", "Task"], "Type should be Story, Bug, TechDeb or Task!",
    ).optional(),
    pointers: z.number().int().optional(),
    startTime: z.string().datetime("Start Time is required!").optional(),
    endTime: z.string().datetime("End Time is required!").optional(),
    assignedTo: z.string().nonempty("Assigned to is required!"),
    createdBy: z.string().nonempty("Created By Id is required!"),
})

export const requestEditSchema = z.object({
    requestStatus: z.enum(["Approved", "Rejected"], "Status should be Approved or Rejected!"),
    approvedRejectedAt: z.string().nonempty("ApprovedRejectedAt Should not be empty"),
    rejectedReason: z.string().optional()
})

export const itemRequest = z.object({
    description: z.string().nonempty("Description should not be empty!"),
    itemType: z.enum(["Story", "Task", "Bug"], {
        errorMap: () => ({
            message: "Item type should be Story, Task, or Bug.",
        }),
    }),
});

export const itemMultipleRequest = z.object({
    description: z
        .string()
        .nonempty("Description should not be empty!"),

    storiesCount: z
        .number()
        .int("Stories count must be an integer")
        .min(1, "Stories count should not be empty!"),

    taskCount: z
        .number()
        .int("Task count must be an integer")
        .min(1, "Task count should not be empty!"),
});
