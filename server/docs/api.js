// API Documentation Data
export const apiDocumentation = {
    title: "Development Dashboard API",
    description: "REST API for the Node.js Express + React Vite development dashboard",
    version: "1.0.0",
    baseUrl: "/api",
    contact: {
        name: "Development Team",
        email: "dev@example.com"
    },
    endpoints: [
        {
            path: "/health",
            method: "GET",
            summary: "Health Check",
            description: "Returns the health status of the API server",
            tags: ["System"],
            responses: {
                "200": {
                    description: "Server is healthy",
                    contentType: "application/json",
                    schema: {
                        type: "object",
                        properties: {
                            status: { type: "string", example: "healthy" },
                            timestamp: { type: "string", format: "date-time" },
                            uptime: { type: "number", description: "Server uptime in seconds" },
                            responseTime: { type: "string", example: "23ms" }
                        }
                    },
                    example: {
                        status: "healthy",
                        timestamp: "2025-09-21T09:30:00.000Z",
                        uptime: 3600,
                        responseTime: "23ms"
                    }
                }
            }
        },
        {
            path: "/services",
            method: "GET",
            summary: "Get All Services",
            description: "Retrieve a list of all monitored services",
            tags: ["Services"],
            responses: {
                "200": {
                    description: "List of services",
                    contentType: "application/json",
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                type: { type: "string" },
                                port: { type: "number" },
                                status: { type: "string", enum: ["running", "stopped"] },
                                pid: { type: "number", nullable: true },
                                uptime: { type: "string", nullable: true },
                                lastChecked: { type: "string", format: "date-time" }
                            }
                        }
                    }
                }
            }
        },
        {
            path: "/services/{id}",
            method: "PATCH",
            summary: "Update Service",
            description: "Update a service's configuration or status",
            tags: ["Services"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    type: "string",
                    description: "Service ID"
                }
            ],
            requestBody: {
                required: true,
                contentType: "application/json",
                schema: {
                    type: "object",
                    properties: {
                        status: { type: "string", enum: ["running", "stopped"] },
                        port: { type: "number" },
                        pid: { type: "number" },
                        uptime: { type: "string" }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Service updated successfully",
                    contentType: "application/json",
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            type: { type: "string" },
                            port: { type: "number" },
                            status: { type: "string" },
                            pid: { type: "number", nullable: true },
                            uptime: { type: "string", nullable: true },
                            lastChecked: { type: "string", format: "date-time" }
                        }
                    }
                },
                "404": {
                    description: "Service not found",
                    contentType: "application/json",
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            error: {
                                type: "object",
                                properties: {
                                    message: { type: "string" },
                                    code: { type: "string" },
                                    timestamp: { type: "string" },
                                    path: { type: "string" },
                                    method: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            path: "/endpoints",
            method: "GET",
            summary: "Get API Endpoints",
            description: "Retrieve a list of all available API endpoints",
            tags: ["Documentation"],
            responses: {
                "200": {
                    description: "List of API endpoints",
                    contentType: "application/json",
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                method: { type: "string" },
                                path: { type: "string" },
                                description: { type: "string" },
                                status: { type: "string" }
                            }
                        }
                    }
                }
            }
        },
        {
            path: "/structure",
            method: "GET",
            summary: "Get Project Structure",
            description: "Retrieve the project's file and folder structure",
            tags: ["Project"],
            responses: {
                "200": {
                    description: "Project structure tree",
                    contentType: "application/json",
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                type: { type: "string", enum: ["file", "folder"] },
                                path: { type: "string" },
                                parentId: { type: "string", nullable: true }
                            }
                        }
                    }
                }
            }
        },
        {
            path: "/packages",
            method: "GET",
            summary: "Get Package Information",
            description: "Retrieve information about installed packages",
            tags: ["Project"],
            responses: {
                "200": {
                    description: "List of installed packages",
                    contentType: "application/json",
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                version: { type: "string" },
                                environment: { type: "string", enum: ["frontend", "backend"] },
                                isDev: { type: "boolean" }
                            }
                        }
                    }
                }
            }
        },
        {
            path: "/scripts",
            method: "GET",
            summary: "Get Development Scripts",
            description: "Retrieve available development scripts",
            tags: ["Project"],
            responses: {
                "200": {
                    description: "List of development scripts",
                    contentType: "application/json",
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                command: { type: "string" },
                                description: { type: "string", nullable: true },
                                environment: { type: "string" }
                            }
                        }
                    }
                }
            }
        },
        {
            path: "/test-endpoint",
            method: "POST",
            summary: "Test Endpoint Connectivity",
            description: "Test the connectivity and response time of an API endpoint",
            tags: ["Testing"],
            requestBody: {
                required: true,
                contentType: "application/json",
                schema: {
                    type: "object",
                    required: ["method", "path"],
                    properties: {
                        method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
                        path: { type: "string" }
                    }
                },
                example: {
                    method: "GET",
                    path: "/api/health"
                }
            },
            responses: {
                "200": {
                    description: "Endpoint test successful",
                    contentType: "application/json",
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean" },
                            responseTime: { type: "string" },
                            status: { type: "number" },
                            timestamp: { type: "string", format: "date-time" }
                        }
                    },
                    example: {
                        success: true,
                        responseTime: "45ms",
                        status: 200,
                        timestamp: "2025-09-21T09:30:00.000Z"
                    }
                }
            }
        }
    ]
};
