const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'GetDone Task & Project Management API',
    version: '1.0.0',
    description: `### Production-Grade REST API for GetDone Daily Task Management
Features:
- **Role-Based Access Control (RBAC)**:
  - **Owner**: Full access to all 4 statuses (pending, ongoing, yetToFinal, complete), permanent delete.
  - **Admin**: Access to 3 statuses (pending, ongoing, complete), soft-delete.
  - **HR**: Access to 3 statuses (pending, ongoing, complete), permanent delete.
  - **Employee**: Access ONLY to assigned projects with status 'ongoing' or 'complete', soft-delete.
- **Soft Delete (TempDelete)**: Safe deletion moving items to Trash.
- **Permanent Hard Delete**: Strictly restricted to Owner and HR.
- **Dual Storage Engine**: MongoDB Atlas/Compass with automatic In-Memory fallback.`,
    contact: {
      name: 'GetDone Engineering Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      UserRoleHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'x-user-role',
        description: 'Direct Role override for API testing: Owner | Admin | HR | Employee',
      },
      UserIdHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'x-user-id',
        description: 'Direct User ID override for API testing (e.g. user_1, user_4)',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_1' },
          name: { type: 'string', example: 'Anish Owner' },
          email: { type: 'string', example: 'owner@demo.com' },
          role: { type: 'string', enum: ['Owner', 'Admin', 'HR', 'Employee'], example: 'Owner' },
          title: { type: 'string', example: 'Founder & CEO' },
          avatar: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'proj_1' },
          title: { type: 'string', example: 'Landing Page Design' },
          desc: { type: 'string', example: 'High converting marketing landing page.' },
          status: { type: 'string', enum: ['pending', 'ongoing', 'yetToFinal', 'complete'], example: 'ongoing' },
          tag: { type: 'string', example: 'UI Design' },
          taskType: { type: 'string', enum: ['Project', 'Meeting', 'Alpha Team', 'Daily Routine', 'Sprint'], example: 'Project' },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            example: ['user_4', 'user_6'],
          },
          createdBy: { type: 'string', example: 'user_1' },
          dueDate: { type: 'string', example: '2026-11-20' },
          estimatedHours: { type: 'number', example: 42.5 },
          commentsCount: { type: 'number', example: 5 },
          attachmentsCount: { type: 'number', example: 3 },
          location: { type: 'string', example: 'Design Studio' },
          deleted: { type: 'boolean', example: false },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', example: 'owner@demo.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      ProjectCreateRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'New Mobile Design System' },
          desc: { type: 'string', example: 'Setup component tokens and responsive typography.' },
          status: { type: 'string', enum: ['pending', 'ongoing', 'yetToFinal', 'complete'], example: 'ongoing' },
          tag: { type: 'string', example: 'Design' },
          taskType: { type: 'string', enum: ['Project', 'Meeting', 'Alpha Team', 'Daily Routine', 'Sprint'], example: 'Project' },
          assignees: { type: 'array', items: { type: 'string' }, example: ['user_4'] },
          dueDate: { type: 'string', example: '2026-11-28' },
          estimatedHours: { type: 'number', example: 12.0 },
          location: { type: 'string', example: 'Headquarters' },
        },
      },
    },
  },
  security: [
    { BearerAuth: [] },
    { UserRoleHeader: [] },
    { UserIdHeader: [] },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in user and retrieve JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Successful login' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/users': {
      get: {
        tags: ['Authentication'],
        summary: 'Get all team members',
        responses: {
          200: { description: 'List of users' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile and permissions',
        responses: {
          200: { description: 'User profile' },
        },
      },
    },
    '/api/projects': {
      get: {
        tags: ['Projects & Tasks'],
        summary: 'List active projects (Role-filtered)',
        description: 'Returns projects visible according to user role (Owner sees all 4 statuses; Admin & HR see pending, ongoing, complete; Employee sees assigned ongoing & complete).',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by status' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search keyword' },
          { name: 'tag', in: 'query', schema: { type: 'string' }, description: 'Filter by tag' },
          { name: 'taskType', in: 'query', schema: { type: 'string' }, description: 'Filter by task type' },
        ],
        responses: {
          200: { description: 'Projects list' },
        },
      },
      post: {
        tags: ['Projects & Tasks'],
        summary: 'Create a new project/task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectCreateRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Project created' },
        },
      },
    },
    '/api/projects/trash': {
      get: {
        tags: ['Projects & Tasks'],
        summary: 'List soft-deleted projects in Trash',
        responses: {
          200: { description: 'Trash list' },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects & Tasks'],
        summary: 'Get project by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project details' },
          403: { description: 'Access Denied' },
          404: { description: 'Project not found' },
        },
      },
      put: {
        tags: ['Projects & Tasks'],
        summary: 'Update project details or status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectCreateRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Project updated' },
        },
      },
      delete: {
        tags: ['Projects & Tasks'],
        summary: 'Permanent Hard Delete (Owner & HR ONLY)',
        description: 'Permanently removes the project from the database. Strictly forbidden for Admin and Employee.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Permanently deleted' },
          403: { description: 'Forbidden: Only Owner & HR can permanently delete' },
          404: { description: 'Project not found' },
        },
      },
    },
    '/api/projects/{id}/temp-delete': {
      patch: {
        tags: ['Projects & Tasks'],
        summary: 'Soft Delete (TempDelete) - Moves project to Trash',
        description: 'Marks project as deleted without removing from database. Available to all roles.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Moved to trash' },
        },
      },
    },
    '/api/projects/{id}/restore': {
      patch: {
        tags: ['Projects & Tasks'],
        summary: 'Restore project from Trash',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Restored' },
        },
      },
    },
    '/api/stats': {
      get: {
        tags: ['Dashboard Stats'],
        summary: 'Get dashboard summary metrics and status counts',
        responses: {
          200: { description: 'Statistics data' },
        },
      },
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('[Swagger Docs] Documentation running at http://localhost:5000/api-docs');
};

module.exports = { setupSwagger, swaggerDocument };

