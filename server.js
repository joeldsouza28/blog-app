const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('public'));

// Home route - List all Markdown files
app.get('/', (req, res) => {
    fs.readdir('./posts', (err, files) => {
        if (err) {
            return res.status(500).send("Error reading posts directory.");
        }
        const posts = files.filter(file => file.endsWith('.md')).map(file => file.replace('.md', ''));
        res.render('index', { posts });
    });
});

// Blog post route - Convert Markdown to HTML
app.get('/post/:title', (req, res) => {
    const postTitle = req.params.title;
    const postPath = path.join(__dirname, 'posts', `${postTitle}.md`);

    fs.readFile(postPath, 'utf-8', (err, content) => {
        if (err) {
            return res.status(404).send("Post not found.");
        }
        const htmlContent = marked.parse(content);
        console.log(htmlContent)
        res.render('post', { title: postTitle, content: htmlContent });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
