import { Worker } from 'worker_threads';


const processDataInWorker = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./workers/dataProcessor.js', {
      workerData: { csvFilePath }
    });

    worker.on('message', (message) => {
      if (message.status === 'success') {
        resolve();
      } else {
        reject(new Error(message.error));
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};


export const uploadData = async (req, res, filePath) => {

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {

    await processDataInWorker(filePath);
    
    res.status(202).json({ message: 'Data upload started' });

  } catch (err) {
    console.error('Error processing data:', err);

    res.status(500).json({ message: 'Error processing data', error: err.message });
  }

};



