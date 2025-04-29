// Variáveis globais
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const overlayCtx = overlay.getContext('2d');
const resultCanvas = document.getElementById('result-canvas');
const resultCtx = resultCanvas.getContext('2d');
const loadingElement = document.getElementById('loading');
const captureBtn = document.getElementById('capture-btn');
const shareBtn = document.getElementById('share-btn');
const backBtn = document.getElementById('back-btn');
const downloadBtn = document.getElementById('download-btn');
const catalogItems = document.querySelectorAll('.catalog-item');
const resultContainer = document.querySelector('.result-container');

// Estado da aplicação
let currentHair = null;
let hairImages = {};
let detectionReady = false;
let faceDetectionInterval = null;

// Inicialização
async function init() {
    try {
        // Carregar modelos do face-api.js
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('models')
        ]);
        
        // Acessar a câmera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        // Aguardar o carregamento do vídeo
        video.addEventListener('loadedmetadata', () => {
            // Ajustar dimensões do canvas de sobreposição
            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;
            
            // Iniciar detecção facial
            startFaceDetection();
            
            // Carregar imagens das perucas
            loadHairImages();
            
            // Esconder mensagem de carregamento
            loadingElement.style.display = 'none';
            detectionReady = true;
        });
    } catch (error) {
        console.error('Erro ao inicializar:', error);
        loadingElement.textContent = 'Erro ao acessar a câmera. Verifique as permissões.';
    }
}

// Carregar imagens das perucas
function loadHairImages() {
    const hairs = ['peruca1', 'peruca2', 'peruca3', 'peruca4'];
    
    hairs.forEach(hair => {
        const img = new Image();
        img.src = `assets/${hair}.png`;
        hairImages[hair] = img;
    });
}

// Iniciar detecção facial
function startFaceDetection() {
    faceDetectionInterval = setInterval(async () => {
        if (!detectionReady) return;
        
        const detections = await faceapi.detectAllFaces(
            video, 
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();
        
        // Limpar canvas
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        
        // Se uma face for detectada e uma peruca estiver selecionada
        if (detections.length > 0 && currentHair) {
            const detection = detections[0];
            drawHairOnFace(detection);
        }
    }, 100);
}

// Desenhar peruca no rosto
function drawHairOnFace(detection) {
    const landmarks = detection.landmarks;
    const positions = landmarks.positions;
    
    // Pontos de referência para posicionar a peruca
    const topOfHead = positions[24]; // Topo da testa
    const leftSide = positions[0];   // Lado esquerdo do rosto
    const rightSide = positions[16]; // Lado direito do rosto
    
    // Calcular largura da peruca baseada na largura do rosto
    const faceWidth = Math.abs(rightSide.x - leftSide.x) * 1.5;
    
    // Calcular altura proporcional mantendo a proporção da imagem
    const hairAspectRatio = hairImages[currentHair].height / hairImages[currentHair].width;
    const hairHeight = faceWidth * hairAspectRatio;
    
    // Posicionar a peruca acima da cabeça
    const hairX = topOfHead.x - (faceWidth / 2);
    const hairY = topOfHead.y - (hairHeight * 0.7); // Ajuste para posicionar corretamente
    
    // Desenhar a peruca
    overlayCtx.drawImage(
        hairImages[currentHair],
        hairX,
        hairY,
        faceWidth,
        hairHeight
    );
}

// Capturar foto
function capturePhoto() {
    // Configurar canvas de resultado
    resultCanvas.width = video.videoWidth;
    resultCanvas.height = video.videoHeight;
    
    // Desenhar vídeo
    resultCtx.drawImage(video, 0, 0, resultCanvas.width, resultCanvas.height);
    
    // Desenhar sobreposição (peruca)
    resultCtx.drawImage(overlay, 0, 0, resultCanvas.width, resultCanvas.height);
    
    // Mostrar resultado
    resultContainer.style.display = 'block';
    document.querySelector('.video-container').style.display = 'none';
    document.querySelector('.catalog').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
}

// Voltar para o modo de câmera
function backToCamera() {
    resultContainer.style.display = 'none';
    document.querySelector('.video-container').style.display = 'block';
    document.querySelector('.catalog').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
}

// Baixar imagem
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'minha-peruca-virtual.png';
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
}

// Compartilhar imagem (se suportado pelo navegador)
async function shareImage() {
    if (!navigator.share) {
        alert('Seu navegador não suporta a funcionalidade de compartilhamento.');
        return;
    }
    
    try {
        resultCanvas.toBlob(async (blob) => {
            const file = new File([blob], 'minha-peruca-virtual.png', { type: 'image/png' });
            
            await navigator.share({
                title: 'Minha Peruca Virtual',
                text: 'Veja como fiquei com esta peruca virtual!',
                files: [file]
            });
        });
    } catch (error) {
        console.error('Erro ao compartilhar:', error);
        alert('Não foi possível compartilhar a imagem.');
    }
}

// Event Listeners
captureBtn.addEventListener('click', capturePhoto);
backBtn.addEventListener('click', backToCamera);
downloadBtn.addEventListener('click', downloadImage);
shareBtn.addEventListener('click', shareImage);

// Selecionar peruca do catálogo
catalogItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remover seleção anterior
        catalogItems.forEach(i => i.classList.remove('active'));
        
        // Adicionar seleção atual
        item.classList.add('active');
        
        // Atualizar peruca atual
        currentHair = item.dataset.hair;
    });
});

// Iniciar aplicação
init();

// Limpar intervalo quando a página for fechada
window.addEventListener('beforeunload', () => {
    clearInterval(faceDetectionInterval);
});