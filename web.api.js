const checkMemoryButton = document.getElementById('checkMemoryButton');
const memoryResult = document.getElementById('memoryResult');

checkMemoryButton.addEventListener('click', () => {
    if ('deviceMemory' in navigator) {
        const memory = navigator.deviceMemory; 
        memoryResult.innerHTML = `Laitteessasi on ${memory} GB RAM-muistia.`;
    } else {
        memoryResult.textContent = "Tämä API ei ole tuettu tällä laitteella.";
    }
});
