document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Section Animations on Scroll ---
    const animatedSections = document.querySelectorAll('.section-animate');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: Stop observing once animated if it's a one-time animation
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove 'animated' class if it goes out of view,
                // for animations that should re-trigger on re-entry.
                // entry.target.classList.remove('animated');
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // --- Stroke Prediction Form Handling ---
    const predictionForm = document.getElementById('predictionForm');
    const predictionResult = document.getElementById('predictionResult');
    const alertMessage = document.getElementById('alertMessage');

    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        predictionResult.style.display = 'none';
        alertMessage.style.display = 'none';
        predictionResult.className = 'result-box'; // Reset classes
        predictionResult.textContent = '';
        alertMessage.textContent = '';

        const formData = new FormData(predictionForm);
        const data = {};
        for (const [key, value] of formData.entries()) {
            // Convert numerical inputs to float/int
            if (['age', 'avg_glucose_level', 'bmi', 'hypertension', 'heart_disease'].includes(key)) {
                data[key] = parseFloat(value);
            } else {
                data[key] = value;
            }
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/predict_stroke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                predictionResult.textContent = `Prediction: ${result.prediction} (Probability: ${(result.probability * 100).toFixed(2)}%)`;
                if (result.prediction === 'Stroke') {
                    predictionResult.classList.add('danger');
                    alertMessage.textContent = "High stroke risk detected! An alert has been sent to caregivers. Please consult a doctor immediately.";
                    alertMessage.style.display = 'block';
                    // Optional: Send a conceptual alert to backend
                    await fetch('http://127.0.0.1:5000/alert_system', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ patient_info: 'User Input', risk_level: result.probability.toFixed(2) })
                    });
                } else {
                    predictionResult.classList.add('success');
                }
                predictionResult.style.display = 'block';
            } else {
                predictionResult.textContent = `Error: ${result.error}`;
                predictionResult.classList.add('danger');
                predictionResult.style.display = 'block';
            }
        } catch (error) {
            predictionResult.textContent = `Network error: ${error.message}. Please ensure the backend server is running.`;
            predictionResult.classList.add('danger');
            predictionResult.style.display = 'block';
            console.error('Error:', error);
        }
    });

    // --- Chart.js Visualizations ---
    // Using pre-derived/dummy data for visualization.
    // In a real application, this data would come from a backend API that processes the CSV.

    // Stroke Prevalence by Age Group (Bar Chart)
    const ageStrokeCtx = document.getElementById('ageStrokeChart').getContext('2d');
    new Chart(ageStrokeCtx, {
        type: 'bar',
        data: {
            labels: ['0-18', '19-35', '36-55', '56-75', '76+'],
            datasets: [{
                label: 'Stroke Cases',
                data: [0.5, 1.5, 6, 15, 12], // Example data
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Stroke Cases',
                        font: {
                            size: 9 // Smaller title font
                        }
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller tick font
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Age Group',
                        font: {
                            size: 9 // Smaller title font
                        }
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller tick font
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: false,
                    text: 'Stroke Prevalence by Age Group',
                    font: {
                        size: 10 // Smaller title font if displayed
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        font: {
                            size: 8 // Smaller legend font if displayed
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 9 // Smaller tooltip title
                    },
                    bodyFont: {
                        size: 8 // Smaller tooltip body
                    },
                    padding: 4 // Reduced padding
                }
            }
        }
    });

    // BMI Distribution (Doughnut Chart)
    const bmiDistributionCtx = document.getElementById('bmiDistributionChart').getContext('2d');
    new Chart(bmiDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
            datasets: [{
                label: 'BMI Categories',
                data: [50, 300, 150, 100], // Example data
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Red
                    'rgba(76, 175, 80, 0.7)',  // Green
                    'rgba(255, 159, 64, 0.7)', // Orange
                    'rgba(54, 162, 235, 0.7)'  // Blue
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: 'BMI Distribution',
                    font: {
                        size: 10 // Smaller title font if displayed
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 8 // Adjusted from 3 to a more readable small size
                        },
                        padding: 5 // Reduced padding between legend items
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 9 // Smaller tooltip title
                    },
                    bodyFont: {
                        size: 8 // Smaller tooltip body
                    },
                    padding: 4, // Reduced padding
                    callbacks: {
                        label: function(tooltipItem) {
                            const data = tooltipItem.dataset.data;
                            const total = data.reduce((sum, val) => sum + val, 0);
                            const value = data[tooltipItem.dataIndex];
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${tooltipItem.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Hypertension & Heart Disease Impact (Bar Chart - Stacked or Grouped)
    const healthConditionCtx = document.getElementById('healthConditionChart').getContext('2d');
    new Chart(healthConditionCtx, {
        type: 'bar',
        data: {
            labels: ['No Condition', 'Hypertension Only', 'Heart Disease Only', 'Both Conditions'],
            datasets: [
                {
                    label: 'No Stroke',
                    data: [400, 80, 30, 10], // Example data
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Stroke',
                    data: [100, 150, 80, 70], // Example data (higher stroke rates with conditions)
                    backgroundColor: 'rgba(239, 83, 80, 0.7)', // Red for stroke
                    borderColor: 'rgba(239, 83, 80, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true, // Stacked bars
                    title: {
                        display: true,
                        text: 'Health Condition Status',
                        font: {
                            size: 9 // Smaller title font
                        }
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller tick font
                        }
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    // Removed 'max: 10' as it was incorrect for the data values.
                    // Chart.js will now auto-scale based on the data.
                    title: {
                        display: true,
                        text: 'Number of Patients',
                        font: {
                            size: 9 // Smaller title font
                        }
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller tick font
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: false,
                    text: 'Impact of Hypertension & Heart Disease on Stroke',
                    font: {
                        size: 10 // Smaller title font if displayed
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 8 // Smaller legend font
                        }
                    },
                    position: 'bottom', // Move legend to bottom for compactness
                    align: 'center'
                },
                tooltip: {
                    titleFont: {
                        size: 9 // Smaller tooltip title
                    },
                    bodyFont: {
                        size: 8 // Smaller tooltip body
                    },
                    padding: 4 // Reduced padding
                }
            }
        }
    });

    // Smoking Status vs. Stroke (Pie/Doughnut Chart or Bar Chart showing percentages)
    const smokingStrokeCtx = document.getElementById('smokingStrokeChart').getContext('2d');
    new Chart(smokingStrokeCtx, {
        type: 'bar',
        data: {
            labels: ['Formerly Smoked', 'Never Smoked', 'Smokes', 'Unknown'],
            datasets: [
                {
                    label: 'Stroke Rate (%)',
                    data: [5.2, 2.5, 7.8, 3.5], // Example stroke rates
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(200, 200, 200, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(200, 200, 200, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10, // Max percentage is appropriate here
                    title: {
                        display: true,
                        text: 'Stroke Rate (%)',
                        font: {
                            size: 9 // Smaller title font
                        }
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller tick font
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Smoking Status',
                        font: {
                            size: 9 // Smaller title font
                        }
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller tick font
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: false,
                    text: 'Stroke Rate by Smoking Status',
                    font: {
                        size: 10 // Smaller title font if displayed
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        font: {
                            size: 8 // Smaller legend font if displayed
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 9 // Smaller tooltip title
                    },
                    bodyFont: {
                        size: 8 // Smaller tooltip body
                    },
                    padding: 4 // Reduced padding
                }
            }
        }
    });


    // --- Chatbot Handling ---
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Display user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'user-message');
        userMessageDiv.textContent = message;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

        chatInput.value = ''; // Clear input

        // Add a typing indicator for the bot
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
        typingIndicator.textContent = '...typing';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send message to backend
        try {
            const response = await fetch('http://127.0.0.1:5000/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            const result = await response.json();

            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);

            // Display bot reply
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('message', 'bot-message');
            botMessageDiv.textContent = result.reply || `Error: ${result.error || 'Could not get response.'}`;
            chatMessages.appendChild(botMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

        } catch (error) {
            chatMessages.removeChild(typingIndicator); // Remove indicator even on error
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.classList.add('message', 'bot-message');
            errorMessageDiv.textContent = `Error: Failed to connect to chatbot service. ${error.message}`;
            chatMessages.appendChild(errorMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            console.error('Chatbot error:', error);
        }
    }

    // --- AI-Based Planners Handling ---
    window.getPlannerRecommendation = async (plannerType, input) => {
        const resultElement = document.getElementById(`${plannerType}PlannerResult`);
        resultElement.style.display = 'none';
        resultElement.textContent = 'Generating plan...';
        resultElement.style.backgroundColor = '#e8f5e9'; // Reset success background
        resultElement.style.color = '#2e7d32'; // Reset success text color
        resultElement.style.border = '1px solid #4CAF50'; // Reset success border
        resultElement.style.display = 'block';


        try {
            const response = await fetch(`http://127.0.0.1:5000/planner/${plannerType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: input }),
            });

            const result = await response.json();

            if (response.ok) {
                resultElement.textContent = result.plan;
            } else {
                resultElement.textContent = `Error generating plan: ${result.error}`;
                resultElement.style.backgroundColor = '#ffebee';
                resultElement.style.color = '#c62828';
                resultElement.style.border = '1px solid #ef5350';
            }
        } catch (error) {
            resultElement.textContent = `Network error: ${error.message}. Please ensure the backend server is running and OpenAI key is set.`;
            resultElement.style.backgroundColor = '#ffebee';
            resultElement.style.color = '#c62828';
            resultElement.style.border = '1px solid #ef5350';
            console.error(`Error with ${plannerType} planner:`, error);
        }
    };

    // --- Future Scope Progress Bar Animations ---
    const progressBarContainers = document.querySelectorAll('.progress-bar-container');

    const progressBarObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the container is visible
    };

    const progressBarObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const targetWidth = progressBar.style.width; // Get the inline width
                progressBar.style.width = '0%'; // Reset to 0 for animation
                // Force reflow
                void progressBar.offsetWidth;
                progressBar.style.width = targetWidth; // Animate to target width
                progressBar.classList.add('animated-progress'); // Add class to show label
                progressBar.style.opacity = 1; // Ensure it's visible if hidden
                observer.unobserve(entry.target); // Observe once
            }
        });
    }, progressBarObserverOptions);

    progressBarContainers.forEach(container => {
        progressBarObserver.observe(container);
    });
});

