// 确保这些变量是全局的
let board;
let playerScore;
let aiScore;
let isPlayerTurn;

// 在文件开头添加设备检测
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 如果是移动设备，重定向到移动版
if (isMobile()) {
    window.location.href = 'mobile.html';
}

document.addEventListener("DOMContentLoaded", function () {
    // 确保所有DOM元素都存在
    const rulesBtn = document.getElementById("rules-btn");
    const rulesModal = document.getElementById("rules-modal");
    const closeBtn = document.querySelector(".close");

    if (rulesBtn && rulesModal && closeBtn) {
        rulesBtn.onclick = function() {
            rulesModal.style.display = "block";
            updateTexts();
        }

        closeBtn.onclick = function() {
            rulesModal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == rulesModal) {
                rulesModal.style.display = "none";
            }
        }
    }

    // 防止移动端滑动穿透
    rulesModal.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    // 初始化棋盘，18个坑，每个坑9颗棋子
    board = new Array(18).fill(9);
    playerScore = 0;
    aiScore = 0;
    isPlayerTurn = true; // 玩家先手

    // 初始化界面
    createLanguageSelector();
    updateTexts();
    renderBoard();
});

// 渲染棋盘函数
function renderBoard() {
    const aiRow = document.getElementById("ai-row");
    const playerRow = document.getElementById("player-row");
    aiRow.innerHTML = "";
    playerRow.innerHTML = "";

    // AI的坑（从9到17）
    for (let i = 9; i <= 17; i++) {
        const hole = createHole(i);
        aiRow.appendChild(hole);
    }
    
    // 玩家的坑（从0到8）
    for (let i = 0; i < 9; i++) {
        const hole = createHole(i);
        playerRow.appendChild(hole);
    }
    
    document.getElementById("turn").textContent = isPlayerTurn ? "玩家回合" : "AI回合";
    updateScoreDisplay();
}

// 创建棋坑函数
function createHole(i) {
    if (board === null || board === undefined) {
        console.error('Board is not initialized');
        return;
    }

    const hole = document.createElement("div");
    hole.classList.add("hole");
    hole.dataset.index = i;
    
    // 创建一个容器来包含所有棋子
    const stonesContainer = document.createElement("div");
    stonesContainer.className = "stones-container";
    
    // 生成棋子
    if (board[i] !== undefined) {
        for (let j = 0; j < board[i]; j++) {
            const stone = document.createElement("div");
            stone.classList.add("stone");
            stonesContainer.appendChild(stone);
        }
    }
    
    hole.appendChild(stonesContainer);
    
    // 显示棋子数量
    const label = document.createElement("div");
    label.classList.add("hole-label");
    label.textContent = board[i];
    hole.appendChild(label);
    
    // 保持原有的点击事件处理
    if (isPlayerTurn && i >= 0 && i <= 8 && board[i] > 0) {
        hole.classList.add('active-hole');
        
        hole.addEventListener("click", function(event) {
            if (!isPlayerTurn) return;
            const index = parseInt(this.dataset.index);
            if (board[index] === 0) return;
            
            // 禁用所有坑的点击事件，直到动画完成
            const holes = document.querySelectorAll('.hole');
            holes.forEach(h => h.style.pointerEvents = 'none');
            
            distributeStones(index, "player");
        });
    }
    
    return hole;
}

// 检查得分函数
function checkScore() {
    // 检查是否有人达到81分或所有坑都空了
    let playerEmpty = board.slice(0, 9).every(x => x === 0);
    let aiEmpty = board.slice(9, 18).every(x => x === 0);
    
    if (playerScore >= 81 || aiScore >= 81 || playerEmpty || aiEmpty) {
        const winModal = document.getElementById('win-modal');
        const winMessage = document.getElementById('win-message');
        const t = translations[currentLang];
        
        let message = '';
        if (playerScore >= 81 || (aiEmpty && playerScore > aiScore)) {
            message = t.playerWin;
        } else if (aiScore >= 81 || (playerEmpty && aiScore > playerScore)) {
            message = t.aiWin;
        } else if (playerScore === aiScore) {
            message = t.draw;
        }
        
        winMessage.textContent = `${message}\n${t.finalScore}: ${t.player} ${playerScore}, ${t.ai} ${aiScore}`;
        winModal.style.display = 'block';
        return true;
    }
    return false;
}

// AI移动函数
function aiMove() {
    const validMoves = [];
    for (let i = 9; i < 18; i++) {
        if (board[i] > 0) {
            validMoves.push(i);
        }
    }
    
    // 随机选择一个有效的移动
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const move = validMoves[randomIndex];
    
    distributeStones(move, "ai");
}

// 分发棋子函数
function distributeStones(startIndex, player) {
    let stones = board[startIndex];
    let currentIndex = startIndex;

    if (stones === 1) {
        board[startIndex] = 0;
    } else {
        board[startIndex] = 1;
        stones--;
    }

    function dropStone() {
        if (stones > 0) {
            currentIndex = (currentIndex + 1) % 18;
            board[currentIndex]++;
            stones--;
            
            renderBoard();
            setTimeout(dropStone, 300);
        } else {
            checkCapture(currentIndex, player);
            
            if (!checkScore()) {
                isPlayerTurn = !isPlayerTurn;
                renderBoard();
                
                if (!isPlayerTurn) {
                    setTimeout(aiMove, 1000);
                }
            }
            
            const holes = document.querySelectorAll('.hole');
            holes.forEach(h => h.style.pointerEvents = 'auto');
        }
    }
    
    dropStone();
}

// 检查吃子函数
function checkCapture(pos, player) {
    if ((player === "player" && pos >= 9) || (player === "ai" && pos < 9)) {
        if (board[pos] % 2 === 0) {
            if (player === "player") {
                playerScore += board[pos];
            } else {
                aiScore += board[pos];
            }
            board[pos] = 0;
        }
    }
    renderBoard();
    updateScoreDisplay();
}

// 更新回合指示器
function updateTurnIndicator() {
    try {
        const t = translations[currentLang];
        const turnIndicator = document.querySelector('.white-turn');
        if (turnIndicator) {
            turnIndicator.textContent = isPlayerTurn ? t.playerTurn : t.aiTurn;
        }
    } catch (error) {
        console.error('Error updating turn indicator:', error);
    }
}

// 在updateScoreDisplay函数中调用
function updateScoreDisplay() {
    const aiScoreStones = document.getElementById('ai-score-stones');
    const playerScoreStones = document.getElementById('player-score-stones');
    const aiScoreValue = document.querySelector('#ai-score-stones + .score-value');
    const playerScoreValue = document.querySelector('#player-score-stones + .score-value');
    
    // 清空现有显示
    aiScoreStones.innerHTML = '';
    playerScoreStones.innerHTML = '';
    
    // 更新棋子显示
    for (let i = 0; i < aiScore; i++) {
        const stone = document.createElement('div');
        stone.className = 'score-stone';
        aiScoreStones.appendChild(stone);
    }
    
    for (let i = 0; i < playerScore; i++) {
        const stone = document.createElement('div');
        stone.className = 'score-stone';
        playerScoreStones.appendChild(stone);
    }

    // 更新数字显示
    aiScoreValue.textContent = aiScore;
    playerScoreValue.textContent = playerScore;

    // 更新回合指示器
    updateTurnIndicator();
}

// 添加语言配置
const translations = {
    zh: {
        title: 'Toguz Kumalak',
        rules: '规则说明',
        rulesTitle: '托古兹库玛拉克规则',
        rulesContent: [
            '1. 游戏开始时，每个坑有9颗棋子',
            '2. 玩家选择自己一方的坑，将里面的棋子按逆时针方向一颗一颗分发到后面的坑中',
            '3. 如果最后一颗棋子落在对方的坑中，且该坑的棋子数为偶数，则可以获得该坑中所有棋子',
            '4. 当一方的所有坑都空了，游戏结束',
            '5. 获得棋子最多的一方获胜'
        ],
        player: '玩家',
        ai: 'AI',
        score: '得分',
        playerTurn: '玩家回合',
        aiTurn: 'AI回合',
        gameOver: '游戏结束！',
        selectLanguage: '选择语言',
        playerWin: '恭喜你获胜！',
        aiWin: 'AI获胜！',
        draw: '平局！',
        restart: '重新开始',
        finalScore: '最终得分'
    },
    en: {
        title: 'Toguz Kumalak',
        rules: 'Rules',
        rulesTitle: 'Toguz Kumalak Rules',
        rulesContent: [
            '1. The game starts with 9 stones in each hole',
            '2. Players choose a hole on their side and distribute stones one by one counterclockwise',
            '3. If the last stone lands in an opponent\'s hole and makes it even, you capture all stones in that hole',
            '4. Game ends when all holes on one side are empty',
            '5. The player with the most stones wins'
        ],
        player: 'Player',
        ai: 'AI',
        score: 'Score',
        playerTurn: 'Player\'s Turn',
        aiTurn: 'AI\'s Turn',
        gameOver: 'Game Over!',
        selectLanguage: 'Select Language',
        playerWin: 'Congratulations! You Win!',
        aiWin: 'AI Wins!',
        draw: "It's a Draw!",
        restart: 'Restart Game',
        finalScore: 'Final Score'
    },
    kk: {
        title: 'Тоғыз құмалақ',
        rules: 'Ережелер',
        rulesTitle: 'Тоғыз құмалақ ережелері',
        rulesContent: [
            '1. Ойын басында әр ұяда 9 құмалақтан болады',
            '2. Ойыншы өз жағындағы ұяны таңдап, құмалақтарды сағат тіліне қарсы бағытта таратады',
            '3. Соңғы құмалақ қарсыластың ұясына түсіп, ондағы құмалақтар саны жұп болса, сол ұядағы барлық құмалақты алады',
            '4. Бір жақтың барлық ұясы босаса, ойын аяқталады',
            '5. Ең көп құмалақ жинаған жақ жеңіске жетеді'
        ],
        player: 'Ойыншы',
        ai: 'AI',
        score: 'Қазан',
        playerTurn: 'Ойыншы кезегі',
        aiTurn: 'AI кезегі',
        gameOver: 'Ойын аяқталды!',
        selectLanguage: 'Тілді таңдау',
        playerWin: 'Құттықтаймыз! Сіз жеңдіңіз!',
        aiWin: 'AI жеңді!',
        draw: 'Тең ойын!',
        restart: 'Қайта бастау',
        finalScore: 'Соңғы есеп'
    }
};

// 当前语言
let currentLang = 'zh';

// 添加语言选择按钮
function createLanguageSelector() {
    const langContainer = document.createElement('div');
    langContainer.style.position = 'fixed';
    langContainer.style.top = '20px';
    langContainer.style.left = '20px';
    langContainer.style.zIndex = '1000';

    const languages = [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' },
        { code: 'kk', name: 'Қазақша' }
    ];

    languages.forEach(lang => {
        const button = document.createElement('button');
        button.textContent = lang.name;
        button.style.marginRight = '10px';
        button.style.padding = '10px 20px';
        button.style.background = '#8B4513';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = () => changeLanguage(lang.code);
        langContainer.appendChild(button);
    });

    document.body.appendChild(langContainer);
}

// 更新界面文本
function updateTexts() {
    try {
        const t = translations[currentLang];
        
        // 更新标题
        const title = document.querySelector('h1');
        if (title) title.textContent = t.title;
        
        // 更新规则按钮
        const rulesBtn = document.getElementById('rules-btn');
        if (rulesBtn) rulesBtn.textContent = t.rules;
        
        // 更新规则模态框
        const modalTitle = document.querySelector('.modal-content h2');
        const rulesList = document.querySelector('.rules-text');
        if (modalTitle) modalTitle.textContent = t.rulesTitle;
        if (rulesList) rulesList.innerHTML = t.rulesContent.map(rule => `<p>${rule}</p>`).join('');
        
        // 更新玩家标识
        const playerIndicator = document.querySelector('.player-indicator:not(.ai-indicator)');
        const aiIndicator = document.querySelector('.ai-indicator');
        if (playerIndicator) playerIndicator.textContent = t.player;
        if (aiIndicator) aiIndicator.textContent = t.ai;
        
        // 更新得分区域
        const scoreContainers = document.querySelectorAll('.score-container span');
        scoreContainers.forEach(span => {
            if (span) {
                if (currentLang === 'kk') {
                    span.textContent = span.textContent.includes('AI') ? 
                        `${t.ai} ${t.score}:` : 
                        `${t.player} ${t.score}:`;
                } else {
                    span.textContent = span.textContent.includes('AI') ? 
                        `${t.ai}${t.score}:` : 
                        `${t.player}${t.score}:`;
                }
            }
        });
        
        // 更新回合指示器
        updateTurnIndicator();
    } catch (error) {
        console.error('Error updating texts:', error);
    }
}

// 切换语言
function changeLanguage(lang) {
    currentLang = lang;
    updateTexts();
}

// 添加重开游戏功能
document.getElementById('restart-btn').onclick = function() {
    // 重置游戏状态
    board = new Array(18).fill(9);
    playerScore = 0;
    aiScore = 0;
    isPlayerTurn = true;
    
    // 隐藏获胜提示
    document.getElementById('win-modal').style.display = 'none';
    
    // 重新渲染棋盘
    renderBoard();
}
