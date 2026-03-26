<h1>CyberCityz Tutoring Platform</h1>
<h2>Step 1:</h2>
<p>Initial files written for phase 1 of the project, to achieve the following:</p>
<ul>
<li>Secure authentication system</li>
<li>Clean architecture</li>
<li>Cloud database</li>
<li>Access control system</li>
</ul>

<h3>List of files:</h3>
<ul>
<li>src/app.js - defines the Express application configuration</li>
<li>src/config/db.js - handles MongoDB connection logic</li>
<li>src/models/user.model.js - defines User schema (database structure)</li>
<li>src/controllers/auth.controller.js - handles authentication logic</li>
<li>src/middlewares/auth.middleware.js - protects routes (only logged-in users allowed)</li>
<li>src/middlewares/role.middleware.js - restricts access by role</li>
<li>src/routes/auth.routes.js - defines API endpoints</li>
<li>server.js - the entry point of the application</li>
<li>.env - holds configuration details</li>
</ul>