# Provador Virtual de Perucas e Apliques

Um aplicativo web que permite aos usuários experimentar diferentes estilos de perucas e apliques virtualmente através da câmera do dispositivo.

## Estrutura do Projeto

- `index.html` - Página principal do aplicativo
- `styles/main.css` - Estilos CSS do aplicativo
- `scripts/main.js` - Código JavaScript para funcionalidades do aplicativo
- `models/` - Modelos de IA para detecção facial
- `assets/` - Imagens das perucas e apliques

## Requisitos

- Navegador moderno com suporte a WebRTC (Chrome, Firefox, Edge, Safari)
- Câmera web ou câmera do dispositivo móvel
- Conexão com a internet para carregar as bibliotecas

## Instalação

1. Clone este repositório:
   ```
   git clone https://seu-repositorio/provador-virtual-perucas.git
   ```

2. Baixe os modelos de detecção facial do face-api.js:
   ```
   curl -L https://github.com/justadudewhohacks/face-api.js-models/archive/refs/heads/master.zip -o models.zip && unzip models.zip && mv face-api.js-models-master/weights/* models/ && rm -rf face-api.js-models-master models.zip
   ```
   
   Ou baixe manualmente os modelos do repositório: https://github.com/justadudewhohacks/face-api.js-models e coloque-os na pasta `models/`.

3. Adicione suas imagens de perucas na pasta `assets/`:
   - `peruca1.png` (peruca longa lisa)
   - `peruca2.png` (peruca curta cacheada)
   - `peruca3.png` (peruca média ondulada)
   - `peruca4.png` (aplique longo)
   - Miniaturas correspondentes: `peruca1-thumb.png`, `peruca2-thumb.png`, etc.

   As imagens das perucas devem ter fundo transparente (formato PNG) para melhor sobreposição.

4. Inicie um servidor web local. Você pode usar:
   - Extensão Live Server no VS Code
   - Python: `python -m http.server`
   - Node.js: `npx serve`

5. Acesse o aplicativo no navegador (geralmente em http://localhost:8000 ou http://localhost:5500)

## Como Usar

1. Permita o acesso à câmera quando solicitado
2. Aguarde o carregamento dos modelos de detecção facial
3. Escolha uma peruca do catálogo clicando na miniatura
4. A peruca será sobreposta em tempo real sobre sua imagem
5. Clique em "Tirar Foto" para capturar a imagem
6. Você pode baixar ou compartilhar a imagem resultante

## Personalização

Para adicionar novas perucas:

1. Adicione a imagem da peruca (com fundo transparente) na pasta `assets/`
2. Adicione uma miniatura correspondente
3. Edite o arquivo `index.html` para incluir a nova peruca no catálogo
4. Atualize o array de perucas no arquivo `scripts/main.js`

## Solução de Problemas

- **A câmera não inicia**: Verifique se você concedeu permissões de câmera para o site
- **Detecção facial não funciona**: Certifique-se de estar em um ambiente bem iluminado
- **Perucas não aparecem**: Verifique se os caminhos das imagens estão corretos
- **Desempenho lento**: Reduza a resolução da câmera ou a frequência de detecção facial

## Tecnologias Utilizadas

- HTML5, CSS3, JavaScript
- WebRTC para acesso à câmera
- face-api.js para detecção facial
- Canvas API para manipulação de imagens

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes. 