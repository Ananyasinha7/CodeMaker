from langchain_groq import  ChatGroq
from langchain_core.globals import set_verbose, set_debug

from dotenv import load_dotenv
from langchain.agents import create_agent

load_dotenv()
import warnings
warnings.filterwarnings("ignore")

set_debug(True)
set_verbose(True)

llm=ChatGroq(model="openai/gpt-oss-120b")
from Agent.prompts import *
from Agent.states import *
from Agent.tools import *

from langgraph.constants import END
from langgraph.graph import StateGraph

def planner_agent(state: dict)->dict:
    users_prompt=state["user_prompt"]
    resp=llm.with_structured_output(Plan,strict=False).invoke(planner_prompt(users_prompt))
    if resp is None:
        raise ValueError("Planner did not return a response")
    return {"plan":resp}

def architect_agent(state: dict)->dict:
    plan: Plan = state["plan"]
    resp=llm.with_structured_output(TaskPlan).invoke([
    {"role": "system", "content": "Return ONLY valid JSON that can be parsed."},
    {"role": "user", "content": architect_prompt(plan)}
])

    if resp is None:
        raise ValueError("Architect did not return a response")
    resp.plan=plan
    return {"task_plan":resp}


def coder_agent(state: dict)->dict:
    coder_state=state.get("coder_state")
    if coder_state is None:
        coder_state=CoderState(task_plan=state["task_plan"],current_step_idx=0)

    steps=coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx>=len(steps):
        return {"coder_state":coder_state,"status":"DONE"}

    current_task=steps[coder_state.current_step_idx]
    existing_content=read_file.run(current_task.filepath)
    user_prompt=(
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}"
        f"Existing Content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )
    system_prompt=coder_system_prompt()
    coder_tools=[read_file,write_file,list_file,get_current_directory]
    react_agent=create_agent(llm, coder_tools)
    react_agent.invoke(
        {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        }
    )

    coder_state.current_step_idx+=1
    return {"coder_state":coder_state}




graph=StateGraph(dict)
graph.add_node("planner",planner_agent)
graph.add_node("architect",architect_agent)
graph.add_node("coder",coder_agent)
graph.add_edge(start_key="planner",end_key="architect")
graph.add_edge(start_key="architect",end_key="coder")
graph.add_conditional_edges(
    source= "coder",
    path=lambda s: "END" if s.get("status")=="DONE" else "coder",
    path_map= {"END":END,"coder":"coder"}
)
graph.set_entry_point("planner")

agent=graph.compile()


if __name__=="__main__":
    user_prompt="Create a simple interactive tic-tac-toe web application"
    result=agent.invoke({"user_prompt":user_prompt})
    print(result)


