import { jest } from '@jest/globals';
import admin from 'firebase-admin';
import { getFunctions } from 'firebase-admin/functions';
import { createHash } from 'crypto';
import fs from 'fs';

// Initialize the Firebase app
admin.initializeApp();

// Adjust jest timeout
jest.setTimeout(30000);

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry function
export async function retry(b, interval=1000, max_r=5, r_c = 0, last_error = null) {
	if (r_c > max_r && last_error != null) throw last_error;
	try {
		await b();
		return 0;
	} catch (err) {
		await sleep(interval);
		return retry(b, interval, max_r, r_c + 1, err);
	}
}

// Test suite
describe('Task Queue', () => {
    it('Should enqueue a task', async () => {
        const scope = '🔥 | test.task.schedule';

        try {
            // Remove the task_dispatched.txt file
            const path = '/tmp/task_dispatched.txt';
            try {
                await
                fs.unlinkSync(path);
            } catch (error) {
                console.log(`[${scope}] Error: ${error}`);
            }

            const function_name = 'taskTestJobDispatcher'
            const region = 'europe-west1';
            const target_uri = `locations/${region}/functions/${function_name}`

            console.log(`[${scope}] Enqueuing task to ${target_uri}`);
    
            // Get reference to the task queue
            const queue = getFunctions().taskQueue(target_uri);

            console.log(`[${scope}] Queue set`);

            const offset_secs = 1;
            const schedule_time = (Date.now()/1000) + offset_secs;
            const time_id = `${Math.floor(Math.floor(schedule_time/offset_secs)*offset_secs)}`;
            const id = `test_queue_ref_${time_id}`;
            const id_hash = createHash('sha256').update(id).digest('hex');
        
            const dispatch_deadline_seconds = 15;
            
            console.log(`[${scope}] Enqueuing task with id: ${id}, schedule_time: ${schedule_time}, dispatch_deadline_seconds: ${dispatch_deadline_seconds}`);

            const payload = {
                test: 'test_payload_value'
            }

            // Enqueue the task
            await queue.enqueue(payload, {
                dispatchDeadlineSeconds: dispatch_deadline_seconds,
                id: id_hash,
                scheduleTime: new Date(schedule_time * 1000),
            });

            console.log(`[${scope}] Task enqueued`);

            await retry(async () => {
                // Check if the task was enqueued
                const task_dispatch = fs.readFileSync(path).toString();

                // Expect the file to be written
                expect(task_dispatch).toBe('ok');
            }, 1000, 5);

            return console.log(`[${scope}] Task was dispatched`);
        } catch (error) {
            console.error(`[${scope}] Error: ${error}`);
        }
    });
});