	document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');


  dropZone.addEventListener('click', () => fileInput.click());

 
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');

    const files = event.dataTransfer.files;
    handleFiles(files);
  });


  fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    handleFiles(files);
  });
});

function handleFiles(files) {
  if (files.length === 0) {
    alert('Please select one or more files to upload.');
    return;
  }

  const progressBarsContainer = document.getElementById('progressBarsContainer');
  progressBarsContainer.innerHTML = '';

  for (const file of files) {
    createProgressBar(file);
    uploadFile(file);
  }
}

function createProgressBar(file) {
  
  const progressBarsContainer = document.getElementById('progressBarsContainer');
  const fileProgressContainer = document.createElement('div');
  fileProgressContainer.className = 'mb-3';

  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'progress';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
  progressBar.role = 'progressbar';
  progressBar.style.width = '0%';
  progressBar.id = `progressBar-${file.name}`;

  const progressText = document.createElement('small');
  progressText.className = 'd-block text-muted mt-1';
  progressText.id = `progressText-${file.name}`;
  progressText.innerText = `Uploading ${file.name}: 0%`;

  progressBarContainer.appendChild(progressBar);
  fileProgressContainer.appendChild(progressBarContainer);
  fileProgressContainer.appendChild(progressText);
  progressBarsContainer.appendChild(fileProgressContainer);
}

async function uploadFile(file) {
  const chunkSize = 5 * 1024 * 1024; 
  const totalChunks = Math.ceil(file.size / chunkSize);

  const progressBar = document.getElementById(`progressBar-${file.name}`);
  const progressText = document.getElementById(`progressText-${file.name}`);

  const segmentWidth = 100 / totalChunks;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(chunk, chunkIndex, totalChunks, file.name);

  
    const progressPercent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
    progressBar.style.width = `${progressPercent}%`;

    
    progressText.innerText = `Uploading ${file.name}: ${progressPercent}%`;
  }

  console.log(`upload of the file ${file.name} is completed`);
}

async function uploadChunk(chunk, chunkIndex, totalChunks, fileName) {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunkIndex', chunkIndex);
  formData.append('totalChunks', totalChunks);
  formData.append('fileName', fileName);

  try {
    const response = await fetch('chunked_upload.php', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('chunked ' + chunkIndex);
    }

    console.log(`chunked file upload ${chunkIndex + 1}/${totalChunks} From ${fileName}`);

  } catch (error) {
    console.error('Error uploading the chunkedFile', error);
  }
}
