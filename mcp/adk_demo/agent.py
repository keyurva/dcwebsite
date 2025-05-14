# agent.py
from contextlib import AsyncExitStack
from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, SseServerParams


async def create_agent():
  """Gets tools from MCP Server."""
  common_exit_stack = AsyncExitStack()

  remote_tools, _ = await MCPToolset.from_server(
      connection_params=SseServerParams(
          url="https://mcp-demo-496370955550.us-central1.run.app/sse"),
      async_exit_stack=common_exit_stack)

  agent = LlmAgent(
      model='gemini-2.5-pro-exp-03-25',
      name='dc_assistant',
      instruction=
      ('Fetch time series data for a given statistical variable and place from Data Commons.'
      ),
      tools=[
          *remote_tools,
      ],
  )
  return agent, common_exit_stack


root_agent = create_agent()
