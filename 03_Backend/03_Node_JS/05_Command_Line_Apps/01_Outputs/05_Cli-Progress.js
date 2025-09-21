import { SingleBar, MultiBar, Presets } from 'cli-progress';

/*
📊 CLI-Progress Demo: Terminal Progress Bars

Installation:
    npm install cli-progress
*/

// ✅ Single Progress Bar
const singleBar = new SingleBar({
    format: 'Progress |{bar}| {percentage}% || {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

singleBar.start(100, 0);

let value = 0;
const interval = setInterval(() => {
    value += 5;
    singleBar.update(value);

    if (value >= 100) {
        singleBar.stop();
        clearInterval(interval);
        console.log('\n✅ Single progress bar complete\n');
    }
}, 100);

// ✅ Multi Progress Bars
const multiBar = new MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '{bar} | {percentage}% | {value}/{total} | {task}'
}, Presets.shades_classic);

const tasks = [
    { name: 'Download', total: 50 },
    { name: 'Upload', total: 30 },
    { name: 'Processing', total: 70 }
];

const bars = tasks.map(task => multiBar.create(task.total, 0, { task: task.name }));

let tick = 0;
const multiInterval = setInterval(() => {
    tick++;
    bars.forEach(bar => bar.increment());

    if (tick >= 70) {
        multiBar.stop();
        clearInterval(multiInterval);
        console.log('\n✅ Multi progress bars complete\n');
    }
}, 100);

/*
🧠 Summary:
- SingleBar: for individual tasks
- MultiBar: for parallel task tracking
- Customize format, characters, and labels
*/
