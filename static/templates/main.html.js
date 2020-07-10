module.exports = {
    htmlDocumentTemplate: (data) => { 
        return `<!doctype html>
<head>
    <link href="./stylesheets/styles.css" rel="stylesheet">
</head>
<body>
${data.content}
</body>
</html>`
    }
};