// DOM Elements
const goalInput = document.getElementById('goalInput');
const counter = document.getElementById('counter');
const goalAmountInput = document.getElementById('goalAmount');
const setGoalBtn = document.getElementById('setGoal');
const incrementBtn = document.getElementById('increment');
const resetBtn = document.getElementById('reset');
const currentCountDisplay = document.getElementById('currentCount');
const pieChartCanvas = document.getElementById('pieChart');

// App State
let goal = 0;
let currentCount = 0;
let pieChart;

// Initialize from localStorage
function initFromStorage() {
    const savedGoal = localStorage.getItem('tasbeehGoal');
    const savedCount = localStorage.getItem('tasbeehCount');
    
    if (savedGoal && savedCount) {
        goal = parseInt(savedGoal);
        currentCount = parseInt(savedCount);
        showCounter();
    }
}

// Show counter screen
function showCounter() {
    goalInput.classList.add('hidden');
    counter.classList.remove('hidden');
    updateChart();
    updateCountDisplay();
}

// Update pie chart
function updateChart() {
    const remaining = Math.max(0, goal - currentCount);
    const percentage = (currentCount / goal) * 100;

    if (pieChart) {
        pieChart.data.datasets[0].data = [currentCount, remaining];
        pieChart.update();
    } else {
        pieChart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [currentCount, remaining],
                    backgroundColor: [
                        '#4CAF50',
                        '#E0E0E0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw} (${Math.round(context.parsed)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update count display
function updateCountDisplay() {
    currentCountDisplay.textContent = `Current Count: ${currentCount}`;
    if (currentCount >= goal) {
        currentCountDisplay.innerHTML += '<br><span class="text-green-600">Goal reached! Mashallah!</span>';
    }
}

// Event Listeners
setGoalBtn.addEventListener('click', () => {
    const amount = parseInt(goalAmountInput.value);
    if (amount > 0) {
        goal = amount;
        currentCount = 0;
        localStorage.setItem('tasbeehGoal', goal);
        localStorage.setItem('tasbeehCount', currentCount);
        showCounter();
    } else {
        alert('Please enter a valid positive number');
    }
});

incrementBtn.addEventListener('click', () => {
    currentCount++;
    localStorage.setItem('tasbeehCount', currentCount);
    updateChart();
    updateCountDisplay();
    
    // Button animation
    incrementBtn.classList.add('animate-pulse');
    setTimeout(() => {
        incrementBtn.classList.remove('animate-pulse');
    }, 200);
});

resetBtn.addEventListener('click', () => {
    // Clear all stored data
    localStorage.removeItem('tasbeehGoal');
    localStorage.removeItem('tasbeehCount');
    
    // Show goal input screen
    counter.classList.add('hidden');
    goalInput.classList.remove('hidden');
    goalAmountInput.value = '';
    
    // Reset app state
    goal = 0;
    currentCount = 0;
    
    // Button animation
    resetBtn.classList.add('animate-pulse');
    setTimeout(() => {
        resetBtn.classList.remove('animate-pulse');
    }, 200);
});

// Initialize app
document.addEventListener('DOMContentLoaded', initFromStorage);