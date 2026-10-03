import figlet from 'figlet';

/*
📦 Figlet Demo: Render ASCII Art Text in Terminal

Installation:
    npm install figlet
*/

console.log('\n🔠 Basic ASCII Art');
figlet('Hello World!', (err, data) => {
    if (err) {
        console.error('Figlet error:', err);
        return;
    }
    console.log(data);
});

/*
🎨 Custom Font Example
*/
figlet.text('Stylized', { font: 'Ghost' }, (err, data) => {
    if (!err) {
        console.log('\n🎨 Ghost Font:\n');
        console.log(data);
    }
});

/*
⚡ Synchronous Rendering
*/
const banner = figlet.textSync('Sync Mode', { font: 'Standard' });
console.log('\n⚡ Synchronous Output:\n');
console.log(banner);

/*
🧠 Summary:
- figlet.text(): async rendering with optional font
- figlet.textSync(): quick synchronous rendering
- Use figlet.fonts() to list available fonts
*/
