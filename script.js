// ====== GLOBAL VARIABLES ======
let array = [];
let speed = 100; // default speed
let isSorting = false;

// HTML elements
const container = document.getElementById("array-container");
const algoSelect = document.getElementById("algo-select");
const speedSlider = document.getElementById("speed");
const sizeSlider = document.getElementById("size");
const description = document.getElementById("algo-description");
const timeBox = document.getElementById("time-complexity");
const spaceBox = document.getElementById("space-complexity");

// ====== UTILITY FUNCTIONS ======

// Delay function based on speed
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create random array
function generateArray() {
  if (isSorting) return;
  array = [];
  container.innerHTML = '';
  for (let i = 0; i < sizeSlider.value; i++) {
    let val = Math.floor(Math.random() * 300) + 10;
    array.push(val);
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${val}px`;
    container.appendChild(bar);
  }
}

// Swap DOM elements visually
async function swap(el1, el2) {
  let temp = el1.style.height;
  el1.style.height = el2.style.height;
  el2.style.height = temp;
  await sleep(speed);
}

// Update complexity & description
function updateInfo(algo) {
  const info = {
    bubble: {
      desc: "Compares adjacent elements and swaps if out of order.",
      time: "Best: O(n), Avg/Worst: O(n²)",
      space: "O(1)"
    },
    selection: {
      desc: "Selects min element and places it in correct position.",
      time: "Best/Worst/Avg: O(n²)",
      space: "O(1)"
    },
    insertion: {
      desc: "Builds the sorted array one element at a time.",
      time: "Best: O(n), Avg/Worst: O(n²)",
      space: "O(1)"
    },
    merge: {
      desc: "Divide & conquer algorithm splitting the array recursively.",
      time: "O(n log n)",
      space: "O(n)"
    },
    quick: {
      desc: "Picks pivot and partitions the array around it.",
      time: "Best/Avg: O(n log n), Worst: O(n²)",
      space: "O(log n)"
    },
    heap: {
      desc: "Converts array to max-heap and extracts max repeatedly.",
      time: "O(n log n)",
      space: "O(1)"
    },
    linear: {
      desc: "Checks each element for the target value.",
      time: "O(n)",
      space: "O(1)"
    },
    binary: {
      desc: "Divides sorted array and checks midpoint recursively.",
      time: "O(log n)",
      space: "O(1)"
    }
  };

  if (info[algo]) {
    description.textContent = info[algo].desc;
    timeBox.textContent = info[algo].time;
    spaceBox.textContent = info[algo].space;
  }
}

// ====== SORTING ALGORITHMS ======

// Bubble Sort
async function bubbleSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < bars.length; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      bars[j].style.backgroundColor = 'red';
      bars[j + 1].style.backgroundColor = 'red';

      if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
        await swap(bars[j], bars[j + 1]);
      }

      bars[j].style.backgroundColor = 'teal';
      bars[j + 1].style.backgroundColor = 'teal';
    }
    bars[bars.length - i - 1].style.backgroundColor = 'green';
  }
}

// Selection Sort
async function selectionSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < bars.length; i++) {
    let minIndex = i;
    bars[i].style.backgroundColor = 'orange';
    for (let j = i + 1; j < bars.length; j++) {
      bars[j].style.backgroundColor = 'red';
      if (parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)) {
        minIndex = j;
      }
      await sleep(speed);
      bars[j].style.backgroundColor = 'teal';
    }
    await swap(bars[i], bars[minIndex]);
    bars[i].style.backgroundColor = 'green';
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 1; i < bars.length; i++) {
    let j = i;
    while (j > 0 && parseInt(bars[j].style.height) < parseInt(bars[j - 1].style.height)) {
      bars[j].style.backgroundColor = 'red';
      bars[j - 1].style.backgroundColor = 'red';
      await swap(bars[j], bars[j - 1]);
      bars[j].style.backgroundColor = 'teal';
      bars[j - 1].style.backgroundColor = 'teal';
      j--;
    }
    bars[i].style.backgroundColor = 'green';
  }
}

// Merge Sort – animation helper
async function mergeSort(arr = array, l = 0, r = arr.length - 1) {
  const bars = document.getElementsByClassName('bar');

  if (l < r) {
    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r, bars);
  }
}

// Merge helper
async function merge(arr, l, m, r, bars) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    bars[k].style.backgroundColor = 'red';
    await sleep(speed);
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      arr[k] = right[j];
      bars[k].style.height = `${right[j]}px`;
      j++;
    }
    bars[k].style.backgroundColor = 'green';
    k++;
  }

  while (i < left.length) {
    arr[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    bars[k].style.backgroundColor = 'green';
    i++;
    k++;
    await sleep(speed);
  }

  while (j < right.length) {
    arr[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    bars[k].style.backgroundColor = 'green';
    j++;
    k++;
    await sleep(speed);
  }
}

// Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;

  let index = await partition(start, end);
  await Promise.all([
    quickSort(start, index - 1),
    quickSort(index + 1, end)
  ]);
}

// Partition function for quick sort
async function partition(start, end) {
  const bars = document.getElementsByClassName('bar');
  let pivot = parseInt(bars[end].style.height);
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    bars[i].style.backgroundColor = 'red';
    if (parseInt(bars[i].style.height) < pivot) {
      await swap(bars[i], bars[pivotIndex]);
      pivotIndex++;
    }
    bars[i].style.backgroundColor = 'teal';
  }
  await swap(bars[pivotIndex], bars[end]);
  bars[pivotIndex].style.backgroundColor = 'green';
  return pivotIndex;
}

// Heap Sort
async function heapSort() {
  const bars = document.getElementsByClassName('bar');
  let n = bars.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    await swap(bars[0], bars[i]);
    bars[i].style.backgroundColor = 'green';
    await heapify(i, 0);
  }
  bars[0].style.backgroundColor = 'green';
}

// Heapify function
async function heapify(n, i) {
  const bars = document.getElementsByClassName('bar');
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;

  if (l < n && parseInt(bars[l].style.height) > parseInt(bars[largest].style.height)) {
    largest = l;
  }

  if (r < n && parseInt(bars[r].style.height) > parseInt(bars[largest].style.height)) {
    largest = r;
  }

  if (largest !== i) {
    await swap(bars[i], bars[largest]);
    await heapify(n, largest);
  }
}

// ====== SEARCHING ALGORITHMS ======

async function linearSearch() {
  const target = prompt("Enter a number to search:");
  const bars = document.getElementsByClassName('bar');

  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = 'red';
    await sleep(speed);
    if (parseInt(bars[i].style.height) == target) {
      bars[i].style.backgroundColor = 'green';
      alert(`Found at index ${i}`);
      return;
    }
    bars[i].style.backgroundColor = 'teal';
  }
  alert("Not found");
}

async function binarySearch() {
  const bars = document.getElementsByClassName('bar');
  array.sort((a, b) => a - b);
  generateArrayBars(); // regenerate DOM from sorted array

  const target = prompt("Enter a number to search:");
  let l = 0, r = array.length - 1;

  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    bars[mid].style.backgroundColor = 'red';
    await sleep(speed);

    if (array[mid] == target) {
      bars[mid].style.backgroundColor = 'green';
      alert(`Found at index ${mid}`);
      return;
    } else if (array[mid] < target) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
    bars[mid].style.backgroundColor = 'teal';
  }

  alert("Not found");
}

// Redraw bars from array
function generateArrayBars() {
  container.innerHTML = '';
  array.forEach(val => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${val}px`;
    container.appendChild(bar);
  });
}

// ====== CONTROLS ======

async function start() {
  if (isSorting) return;
  isSorting = true;
  updateInfo(algoSelect.value);

  switch (algoSelect.value) {
    case 'bubble': await bubbleSort(); break;
    case 'selection': await selectionSort(); break;
    case 'insertion': await insertionSort(); break;
    case 'merge': await mergeSort(); break;
    case 'quick': await quickSort(); break;
    case 'heap': await heapSort(); break;
    case 'linear': await linearSearch(); break;
    case 'binary': await binarySearch(); break;
  }

  isSorting = false;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Update on slider change
speedSlider.oninput = () => speed = 1010 - speedSlider.value;
sizeSlider.oninput = generateArray;

// Init array
generateArray();


