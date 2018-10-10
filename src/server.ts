import app from './app';
const PORT = 3000;

app.listen(PORT, () => {
    console.log('[SUCCESS] - Express server listening on port', PORT);
});
