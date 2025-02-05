import admin from "firebase-admin";
import { onTaskDispatched } from "firebase-functions/v2/tasks";
import fs from 'fs';

admin.initializeApp();

export const taskTestJobDispatcher = onTaskDispatched({
    region:  "europe-west1"
}, (request) => {
    // Touch a file to indicate that the task was dispatched, could also be a Firestore write
    const path = '/tmp/task_dispatched.txt';
    fs.writeFileSync(path, 'ok');

    console.info(`\n👋 Hello from taskTestJobDispatcher.\nData: ${JSON.stringify(request?.data, null, 1)}\n`);
});