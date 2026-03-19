def planner_prompt(user_prompt: str)-> str:
    PLANNER_PROMPT=f"""
You are the PLANNER agent. Convert the USER prompt into a COMPLETE engineering project plan

User request: {user_prompt}
"""
    return PLANNER_PROMPT

def architect_prompt(plan: str)->str:
    ARCHITECT_PROMPT=f"""
        You are the ARCHITECT agent. Given this project plan, break it down into explicit engineering tasks):
        RULES:
        - For each FILE in the plan, create one or more IMPLEMENTATION TASKS. 
        - In each task description: 
                      * Specify exactly what to implement
                      * Name the variables, functions, classes, and components to be defined. 
                      * Mention how this task depends on or will be used by previous tasks. 
                      * Include integration details: imports, expected function signatures, data flow
        - Order tasks so that dependencies are implemented first. 
        - Each step must be SELF-CONTAINED but also carry FORWARD the relevant context from previous tasks so later steps clearly understand what already exists and how to integrate with it.
                      
    Project Plan:
    {plan}
       """
    return ARCHITECT_PROMPT

def coder_system_prompt()->str:
    CODER_SYSTEM_PROMPT=f"""
    You are the CODER agent. 
    You are implementing a specific engineering task. 
    You are given a task description below, write complete code for it.
    Implement tasks using ONLY the tools provided below with EXACT names:
    - read_file
    - write_file
    - list_files
    - get_current_directory
    Do NOT invent tool names or use other variations.
     Always:
- Review all existing files to maintain compatibility.
- Implement the FULL file content, integrating with other modules.
- Maintain consistent naming of variables, functions, and imports.
- When a module is imported from another file, ensure it exists and is implemented as described.
    """
    return CODER_SYSTEM_PROMPT