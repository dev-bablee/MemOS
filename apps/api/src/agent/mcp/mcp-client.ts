import { logger } from "../../config/logger.js";

export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export class McpClient {
  private static registeredServers = new Map<string, { url: string; tools: McpTool[] }>();

  /**
   * Registers an external MCP server endpoint.
   */
  static registerServer(name: string, url: string): void {
    this.registeredServers.set(name, { url, tools: [] });
    logger.info(`Registered MCP Server: ${name} (${url})`);
  }

  /**
   * Discovers tools from connected MCP servers.
   */
  static async discoverTools(serverName: string): Promise<McpTool[]> {
    const server = this.registeredServers.get(serverName);
    if (!server) {
      throw new Error(`MCP Server '${serverName}' is not registered.`);
    }

    // Default built-in discovery for CockroachDB MCP and standard servers
    const defaultMcpTools: McpTool[] = [
      {
        name: `${serverName}_execute_query`,
        description: `Execute a read-only SQL query against ${serverName}`,
        inputSchema: {
          type: "object",
          properties: {
            sql: { type: "string", description: "The SQL statement to execute" },
          },
          required: ["sql"],
        },
      },
      {
        name: `${serverName}_describe_schema`,
        description: `Describe tables, columns, and vector indexes on ${serverName}`,
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "string", description: "Optional table name filter" },
          },
        },
      },
    ];

    server.tools = defaultMcpTools;
    return defaultMcpTools;
  }
}

// Auto-register CockroachDB Cloud MCP
McpClient.registerServer("cockroachdb-cloud", "https://cockroachlabs.cloud/mcp");
