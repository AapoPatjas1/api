const copyButton = document.getElementById('copyButton');
const textInput = document.getElementById('textInput');
const message = document.getElementById('message');

copyButton.addEventListener('click', () => {
    const text = textInput.value.trim(); 
    if (text) {
      
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea); 
        tempTextArea.select(); 
        try {
            
            const successful = document.execCommand('copy');
            message.textContent = successful 
                ? "Teksti kopioitiin leikepöydälle!" 
                : "Kopiointi epäonnistui!";
            message.style.color = successful ? "green" : "red";
        } catch (err) {
            message.textContent = "Kopiointi ei onnistu selaimessasi.";
            message.style.color = "red";
        }
        document.body.removeChild(tempTextArea); 
    } else {
        message.textContent = "Tekstikenttä on tyhjä!";
        message.style.color = "orange";
    }
});
