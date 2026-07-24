const form = document.getElementById('predictionForm');
const submitBtn = document.getElementById('submitBtn');
const btnSpinner = document.getElementById('btnSpinner');
const resultEmpty = document.getElementById('resultEmpty');
const resultContent = document.getElementById('resultContent');
const errorBox = document.getElementById('errorBox');
const scoreValue = document.getElementById('scoreValue');
const scoreNote = document.getElementById('scoreNote');
const resultCard = document.getElementById('resultCard');

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnSpinner.classList.toggle('hidden', !isLoading);
  submitBtn.querySelector('.btn-text').textContent = isLoading ? 'Predicting...' : 'Predict Score';
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function clearError() {
  errorBox.textContent = '';
  errorBox.classList.add('hidden');
}

function showResult(score) {
  scoreValue.textContent = Number(score).toFixed(2);
  scoreNote.textContent = score >= 7
    ? 'Great balance. Your routine looks supportive, and these habits are likely helping keep your score strong.'
    : score >= 4
      ? 'You are in a fairly balanced range. A little more sleep, movement, or less screen time may help improve it further.'
      : 'Your score suggests extra care may help. Consider improving rest, reducing screen time, and keeping a steadier routine.';
  resultEmpty.classList.add('hidden');
  resultContent.classList.remove('hidden');
  resultContent.classList.remove('result-content--animate');
  void resultContent.offsetWidth;
  resultContent.classList.add('result-content--animate');

  resultCard.classList.remove('result-card--animate');
  void resultCard.offsetWidth;
  resultCard.classList.add('result-card--animate');

  window.requestAnimationFrame(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function buildPayload(formData) {
  return {
    age: Number(formData.get('age')),
    gender: formData.get('gender'),
    country: formData.get('country'),
    academic_level: formData.get('academic_level'),
    most_used_platform: formData.get('most_used_platform'),
    purpose_of_use: formData.get('purpose_of_use'),
    avg_daily_usage_hours: Number(formData.get('avg_daily_usage_hours')),
    daily_unlocks: Number(formData.get('daily_unlocks')),
    study_hours: Number(formData.get('study_hours')),
    physical_activity_hours: Number(formData.get('physical_activity_hours')),
    sleep_hours_per_night: Number(formData.get('sleep_hours_per_night')),
    stress_level: formData.get('stress_level')
  };
}

function getValidationMessage(data) {
  const requiredFields = [
    'age',
    'gender',
    'country',
    'academic_level',
    'most_used_platform',
    'purpose_of_use',
    'avg_daily_usage_hours',
    'daily_unlocks',
    'study_hours',
    'physical_activity_hours',
    'sleep_hours_per_night',
    'stress_level'
  ];

  for (const field of requiredFields) {
    if (data[field] === '' || data[field] === null || Number.isNaN(data[field])) {
      return 'Please complete all fields with valid values before predicting.';
    }
  }

  if (data.age < 10 || data.age > 100) return 'Age must be between 10 and 100.';
  if (data.avg_daily_usage_hours < 0 || data.avg_daily_usage_hours > 24) return 'Average daily usage hours must be between 0 and 24.';
  if (data.study_hours < 0 || data.study_hours > 24) return 'Study hours must be between 0 and 24.';
  if (data.physical_activity_hours < 0 || data.physical_activity_hours > 24) return 'Physical activity hours must be between 0 and 24.';
  if (data.sleep_hours_per_night < 0 || data.sleep_hours_per_night > 24) return 'Sleep hours per night must be between 0 and 24.';

  return '';
}

function formatBackendError(detail) {
  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || JSON.stringify(item))
      .join(' ');
  }

  if (detail && typeof detail === 'object') {
    return detail.detail ? formatBackendError(detail.detail) : JSON.stringify(detail);
  }

  return 'Something went wrong while processing the request.';
}

async function readResponseMessage(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return { detail: 'The server returned invalid JSON.' };
    }
  }

  const text = await response.text();
  return { detail: text || 'The server returned an empty response.' };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  const formData = new FormData(form);
  const payload = buildPayload(formData);
  const validationMessage = getValidationMessage(payload);

  if (validationMessage) {
    showError(validationMessage);
    return;
  }

  setLoading(true);
  resultEmpty.classList.remove('hidden');
  resultContent.classList.add('hidden');
  resultEmpty.textContent = 'Waiting for prediction...';

  try {
    const response = await fetch('/post/pridict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await readResponseMessage(response);

    if (!response.ok) {
      const message = formatBackendError(responseData);
      throw new Error(message);
    }

    showResult(responseData.predicted_mental_health_score);
  } catch (error) {
    showError(error.message || 'Unable to complete prediction request.');
    resultEmpty.textContent = 'Prediction unavailable right now.';
    resultEmpty.classList.remove('hidden');
    resultContent.classList.add('hidden');
  } finally {
    setLoading(false);
  }
});

form.addEventListener('reset', () => {
  clearError();
  resultContent.classList.add('hidden');
  resultContent.classList.remove('result-content--animate');
  resultCard.classList.remove('result-card--animate');
  resultEmpty.classList.remove('hidden');
  resultEmpty.textContent = 'Fill the form and click predict to see the score here.';
});
