const express= require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const path = require("path");
const cookieParser = require('cookie-parser')
const connectToDb = require('./config/connectToDb')
connectToDb()
const notesController = require('./controllers/notesController')
const usersController = require('./controllers/usersController')

// ------->------->-------> Imports
// ------->------->-------> Middleware
const ensureLoggedIn = require('./config/ensureLoggedIn')
app.use(express.json());
//  data -> json

app.use(require('./config/checkToken'))
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  }))
// CORS: CrossOriginResourceSharing

// app.use(cookieParser())
// cookieParser: npm i cookie-parser *




// ------->------->-------> Routes
app.get("/notes", ensureLoggedIn, notesController.fetchNotes);
app.get("/notes/:id", ensureLoggedIn, notesController.fetchNote);
app.post("/notes", ensureLoggedIn, notesController.createNote);
app.put("/notes/:id", ensureLoggedIn, notesController.updateNote);
app.delete("/notes/:id", ensureLoggedIn, notesController.deleteNote);
app.post("/notes/:id/bodies", ensureLoggedIn, notesController.addBody);
app.delete("/notes/:id/bodies", ensureLoggedIn, notesController.deleteCheckedBodies);
// +++++++++++++ {DELETE} ++++++++++++++
// -------------------------------------------------------[userRoutes]
app.post('/api/users', usersController.create);
app.post('/api/users/login', usersController.login);
app.get('/api/users/check-token', ensureLoggedIn, usersController.checkToken);
app.get('/api/users/verify/:token', usersController.verifyEmail);
app.post('/api/users/forgot-password', usersController.forgotPassword);
app.post('/api/users/reset-password/:token', usersController.resetPassword);


// ------->------->-------> Serve React Frontend (Production / Render Deployment)
// [1] Tells Express to serve all static files (HTML, CSS, JS, images) from React's build folder.
//     The build folder is created when you run "npm run build" inside the frontend directory.
app.use(express.static(path.join(__dirname, '../frontend/src-app/dist')));

// [2] Catches every route that is NOT an API route (like /notes or /api/users).
//     Without this, refreshing or directly visiting a React route (e.g. /login) would return a 404.
//     Instead, Express sends back index.html and lets React Router handle the navigation client-side.
app.get('*', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(__dirname, '../frontend/src-app/dist', 'index.html'));
});

// ------->------->-------> Server
app.listen(PORT,()=>{
    console.log(`ServerConnectedOn: ${PORT}`)
})
