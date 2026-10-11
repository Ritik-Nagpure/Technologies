import { createClient } from 'redis'

const sred = createClient({
    username: 'default',
    password: 'xLi6tkhgY5gdiMSq6UCVizBMHJegqHDt',
    socket: {
        host: 'redis-19424.c10.us-east-1-3.ec2.cloud.redislabs.com',
        port: 19424
    }
});

sred.on('error', err => console.log('Redis Client Error', err));

export const createEntry = async (todoData: string) => {
    try {
        const newTodoKey = String(Date.now())
        await sred.connect();
        await sred.set(newTodoKey, todoData, { expiration: { type: 'EX', value: 604800 } })
        await sred.quit()
        return { 'newKey': newTodoKey }
    }
    catch {
        console.log("DB error Occured")
        return {}
    }


}

export const getEntry = async (key: string) => {
    try {
        await sred.connect();
        const result = await sred.get(key);
        await sred.quit();
        return result
    }
    catch {
        console.log("DB error Occured")
        return ''
    }
}
export const getALLEntries = async () => {
    try {
        await sred.connect();
        const keys = await sred.keys('*');
        const list = Promise.all(
            keys.map(async (key) => {
                let val = await sred.get(key);
                return { key: key, value: JSON.parse(val!) } 
                // Writing val! tells TypeScript: “I’m certain this value is not null here, so treat it as a string.”
            })
        )
        await sred.quit();
        return list
    }
    catch {
        console.log("DB error Occured")
    }

}


