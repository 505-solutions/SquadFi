const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const prometheusURL = 'http://localhost:9090'; // Replace with your Prometheus URL


const projectId = '00bc088c4562cbad8696764bfe08cd24'; // Replace with your project ID
const apiSecret = '357cb08b-be22-44e2-99e4-b53336a0aebc';
const cluster_owner = [
  'eip155:17000:0x3847a460EB81De72E88dAf4614DfF72604e96907',
  'eip155:17000:0xBaa37770a6486f8070E3B6e0ebbCEe5dd1320894',
  'eip155:1:0xBaa37770a6486f8070E3B6e0ebbCEe5dd1320894']; // Replace with your cluster owner
const notification_types = [
  '589a82cc-e31c-4923-9711-b87a6426b11e', // alert
  '82a411fe-a8ec-4a86-bb0f-693e86cfa105', // onboarding
  'd035a6b9-e291-41d7-adf0-de94bc3fb7a6', // broadcast
]

async function sendNotification(notificationType, title, body, icon, url, accounts) {
  try {
    const response = await axios.post(
      `https://notify.walletconnect.com/${projectId}/notify`,
      {
        notification: {
          type: notificationType,
          title: title,
          body: body,
          icon: 'https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/d1ec9032-54e5-4f1c-f67a-51654f6f7900/md'
        },
        accounts: accounts
      },
      {
        headers: {
          Authorization: `Bearer ${apiSecret}`
        }
      }
    );
    
    // Handle response if needed
    console.log('Notification sent:', response.data);

    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error sending notification:', error);
    throw error;
  }
}


// Function to fetch targets from Prometheus API
const fetchTargets = () => {
  axios.get(`${prometheusURL}/api/v1/targets`)
    .then(response => {
      const targets = response.data.data.activeTargets;
      let msg = '';
      let OK = 0;
      let FAIL = 0;

      targets.forEach(target => {
        const { labels, health } = target;
        const statusEmoji = health === 'up' ? 'up' : 'DOWN'; // Green dot for UP, red dot otherwise
        if (health === 'up') OK++;
        else FAIL++;
        console.log(`Target: ${labels.instance}, Job: ${labels.job}, Status: ${statusEmoji}`);
        msg += `${labels.job}: ${statusEmoji} | `;
      });

      // Send notification
      const formattedUTCDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      sendNotification(notification_types[0], `Your node status | ${OK == targets.length ? 'ALL OK ✅': 'FAIL ❌'} | ${formattedUTCDate}`, msg, [""], [""], cluster_owner);

    })
    .catch(error => {
      console.error('Error fetching targets:', error);
    });
};

// Cron job to fetch targets every minute (adjust schedule as needed)
cron.schedule('*/30 * * * * *', () => {
  fetchTargets();
});

// Start the Express server
const port = 3012;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  sendNotification(notification_types[1], 'SquadFi Cluster | Onboarding | New operator', `Operator ${cluster_owner[0].substring(0, 32)}... is now online.`, [""], [""], cluster_owner);
});
