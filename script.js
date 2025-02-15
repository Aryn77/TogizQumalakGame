// 在文件开头添加设备检测
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 如果是移动设备，重定向到移动版
if (isMobile()) {
    window.location.href = 'mobile.html';
}

document.addEventListener("DOMContentLoaded", function () {
    // 在现有代码的开头添加以下内容
    const rulesBtn = document.getElementById("rules-btn");
    const rulesModal = document.getElementById("rules-modal");
    const closeBtn = document.querySelector(".close");

    rulesBtn.onclick = function() {
        rulesModal.style.display = "block";
        // 立即更新规则内容
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

    // 防止移动端滑动穿透
    rulesModal.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    // 初始化棋盘，18个坑，每个坑9颗棋子
    let board = new Array(18).fill(9);
    let playerScore = 0;
    let aiScore = 0;
    let isPlayerTurn = true; // 玩家先手

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
        const hole = document.createElement("div");
        hole.classList.add("hole");
        hole.dataset.index = i;
        
        // 创建一个容器来包含所有棋子
        const stonesContainer = document.createElement("div");
        stonesContainer.className = "stones-container";
        
        // 生成棋子
        for (let j = 0; j < board[i]; j++) {
            const stone = document.createElement("div");
            stone.classList.add("stone");
            stonesContainer.appendChild(stone);
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

    // 分发棋子函数
    function distributeStones(startIndex, player) {
        let stones = board[startIndex];
        let currentIndex = startIndex;

        // 定义 oldState 和 oldPlayerScore
        const oldState = [...board]; // 在这里获取当前棋盘状态
        const oldPlayerScore = playerScore; // 在这里获取当前玩家得分

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
                
                // 检查得分情况
                if (!checkScore()) {
                    isPlayerTurn = !isPlayerTurn;
                renderBoard();
                    
                if (!isPlayerTurn) {
                    setTimeout(aiMove, 1000);
                    }
                }
                
                // 重新启用坑的点击事件
                const holes = document.querySelectorAll('.hole');
                holes.forEach(h => h.style.pointerEvents = 'auto');
            }
        }
        
        dropStone();

        if (player === "player") {
            // 让 AI 从玩家的移动中学习
            const reward = playerScore - oldPlayerScore;
            aiLearner.updateQValue(oldState, startIndex, -reward, board); // 使用负奖励，因为这是对手的移动
        }
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

    // AI移动函数
    function aiMove() {
        // 保存移动前的状态
        const oldState = [...board];
        const oldScore = aiScore;
        
        // 使用Q-learning选择动作
        const action = aiLearner.chooseAction(board);
        
        // 执行移动
        distributeStones(action, "ai");
        
        // 计算奖励（基于得分变化）
        const reward = aiScore - oldScore;
        
        // 更新Q值
        aiLearner.updateQValue(oldState, action, reward, board);
        
        // 每局结束时保存学习结果
        if (checkGameOver()) {
            saveAIProgress();
        }
    }

    // 更新回合指示器
    function updateTurnIndicator() {
        const turnIndicator = document.querySelector('.white-turn');
        turnIndicator.textContent = isPlayerTurn ? "玩家回合" : "AI回合";
        turnIndicator.style.background = isPlayerTurn ? 
            'linear-gradient(145deg, #f5e6d3, #f0d9b5)' : 
            'linear-gradient(145deg, #8B4513, #654321)';
        turnIndicator.style.color = isPlayerTurn ? '#2c1810' : '#f5f5f5';
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

    // 添加 Q-learning 相关代码
    class QLearn {
        constructor() {
            this.qTable = new Map(); // 状态-动作价值表
            this.learningRate = 0.1;  // 学习率
            this.discountFactor = 0.9;  // 折扣因子
            this.epsilon = 0.1;  // 探索率
        }

        // 获取棋盘状态的唯一标识
        getStateKey(board) {
            return board.join(',');
        }

        // 获取所有可能的动作（可选择的坑）
        getValidActions(board) {
            let actions = [];
        for (let i = 9; i < 18; i++) {
                if (board[i] > 0) {
                    actions.push(i);
                }
            }
            return actions;
        }

        // 根据当前状态选择动作
        chooseAction(board) {
            const stateKey = this.getStateKey(board);
            const validActions = this.getValidActions(board);
            
            // ε-贪婪策略
            if (Math.random() < this.epsilon) {
                // 探索：随机选择动作
                return validActions[Math.floor(Math.random() * validActions.length)];
            }
            
            // 利用：选择价值最高的动作
            let bestAction = validActions[0];
            let maxValue = this.getQValue(stateKey, bestAction);
            
            for (let action of validActions) {
                const value = this.getQValue(stateKey, action);
                if (value > maxValue) {
                    maxValue = value;
                    bestAction = action;
                }
            }
            
            return bestAction;
        }

        // 获取状态-动作对的Q值
        getQValue(stateKey, action) {
            const key = `${stateKey}:${action}`;
            return this.qTable.get(key) || 0;
        }

        // 更新Q值
        updateQValue(oldState, action, reward, newState) {
            const oldStateKey = this.getStateKey(oldState);
            const newStateKey = this.getStateKey(newState);
            
            // 获取当前Q值
            const currentQ = this.getQValue(oldStateKey, action);
            
            // 获取下一状态的最大Q值
            const validActions = this.getValidActions(newState);
            let maxNextQ = 0;
            for (let nextAction of validActions) {
                const nextQ = this.getQValue(newStateKey, nextAction);
                maxNextQ = Math.max(maxNextQ, nextQ);
            }
            
            // Q-learning更新公式
            const newQ = currentQ + this.learningRate * (reward + this.discountFactor * maxNextQ - currentQ);
            
            // 更新Q表
            this.qTable.set(`${oldStateKey}:${action}`, newQ);
        }
    }

    // 创建 AI 学习实例
    const aiLearner = new QLearn();

    // 添加变量跟踪上一次得分
    let oldAiScore = 0;

    // 可以添加保存和加载学习结果的功能
    function saveAIProgress() {
        const data = JSON.stringify(Array.from(aiLearner.qTable.entries()));
        localStorage.setItem('aiLearningData', data);
    }

    function loadAIProgress() {
        const data = localStorage.getItem('aiLearningData');
        if (data) {
            aiLearner.qTable = new Map(JSON.parse(data));
        }
    }

    // 游戏结束时保存学习结果
    function checkGameOver() {
        let playerEmpty = board.slice(0, 9).every(x => x === 0);
        let aiEmpty = board.slice(9, 18).every(x => x === 0);
        if (playerEmpty || aiEmpty) {
            alert(`游戏结束！玩家得分：${playerScore}，AI得分：${aiScore}`);
            // 保存学习结果
            saveAIProgress();
        }
    }

    // 游戏开始时加载之前的学习结果
    window.addEventListener('DOMContentLoaded', function() {
        loadAIProgress();
    });

    // AI自我训练函数
    function trainAI(numGames = 50) {
        const originalBoard = [...board];
        const originalPlayerScore = playerScore;
        const originalAIScore = aiScore;
        const originalIsPlayerTurn = isPlayerTurn;
        
        // 创建训练进度显示
        const progressDiv = document.createElement('div');
        progressDiv.style.position = 'fixed';
        progressDiv.style.top = '50%';
        progressDiv.style.left = '50%';
        progressDiv.style.transform = 'translate(-50%, -50%)';
        progressDiv.style.padding = '20px';
        progressDiv.style.background = '#8B4513';
        progressDiv.style.color = '#fff';
        progressDiv.style.borderRadius = '10px';
        progressDiv.style.zIndex = '1000';
        document.body.appendChild(progressDiv);

        let gameCount = 0;
        
        // 创建第二个AI实例
        const aiLearner2 = new QLearn();
        
        function playOneGame() {
            // 重置游戏状态
            board = new Array(18).fill(9);
            playerScore = 0;
            aiScore = 0;
            let ai1Score = 0;
            let ai2Score = 0;
            let isAI1Turn = true;
            
            // 显示训练进度
            progressDiv.textContent = `AI自我对战训练中: ${gameCount + 1}/${numGames}`;
            
            function simulateMove() {
                if (!checkGameEnd()) {
                    // 当前AI
                    const currentAI = isAI1Turn ? aiLearner : aiLearner2;
                    // 当前分数
                    const currentScore = isAI1Turn ? ai1Score : ai2Score;
                    
                    // 保存移动前的状态
                    const oldState = [...board];
                    
                    // 使用Q-learning选择动作
                    const action = currentAI.chooseAction(isAI1Turn ? board : board.map((v, i) => {
                        // 对AI2来说，需要翻转棋盘视角
                        if (i < 9) return board[i + 9];
                        return board[i - 9];
                    }));
                    
                    // 执行移动
                    let stones = board[action];
                    let currentIndex = action;
                    
                    // 模拟移动
                    if (stones === 1) {
                        board[action] = 0;
                    } else {
                        board[action] = 1;
                        stones--;
                    }
                    
                    while (stones > 0) {
                        currentIndex = (currentIndex + 1) % 18;
                        board[currentIndex]++;
                        stones--;
                    }
                    
                    // 检查吃子
                    if (board[currentIndex] % 2 === 0) {
                        if (isAI1Turn) {
                            ai1Score += board[currentIndex];
                        } else {
                            ai2Score += board[currentIndex];
                        }
                        board[currentIndex] = 0;
                    }
                    
                    // 计算奖励
                    const reward = (isAI1Turn ? ai1Score : ai2Score) - currentScore;
                    
                    // 更新Q值
                    currentAI.updateQValue(oldState, action, reward, board);
                    
                    // 切换AI
                    isAI1Turn = !isAI1Turn;
                    
                    // 继续模拟
                    setTimeout(simulateMove, 0);
                } else {
                    // 根据对战结果给予额外奖励
                    const finalReward = ai1Score > ai2Score ? 100 : (ai1Score < ai2Score ? -100 : 0);
                    aiLearner.updateQValue(board, 0, finalReward, board);
                    aiLearner2.updateQValue(board, 0, -finalReward, board);
                    
                    gameCount++;
                    if (gameCount < numGames) {
                        // 开始下一局
                        setTimeout(playOneGame, 0);
                    } else {
                        // 训练完成
                        progressDiv.textContent = 'AI自我对战训练完成！';
                        setTimeout(() => {
                            document.body.removeChild(progressDiv);
                            // 恢复原始游戏状态
                            board = [...originalBoard];
                            playerScore = originalPlayerScore;
                            aiScore = originalAIScore;
                            isPlayerTurn = originalIsPlayerTurn;
                            renderBoard();
                            // 保存学习结果
                            saveAIProgress();
                        }, 1000);
                    }
                }
            }
            
            simulateMove();
        }
        
        // 开始训练
        playOneGame();
    }

    // 检查游戏是否结束的辅助函数
    function checkGameEnd() {
        let allEmpty = board.slice(9, 18).every(x => x === 0);
        return allEmpty;
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
            trainAI: '训练AI (50局)',
            training: 'AI自我对战训练中',
            trainingComplete: 'AI自我对战训练完成！',
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
            trainAI: 'Train AI (50 games)',
            training: 'AI Self-Training',
            trainingComplete: 'AI Training Complete!',
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
            trainAI: 'AI жаттығу (50 ойын)',
            training: 'AI өзін-өзі жаттықтыруда',
            trainingComplete: 'AI жаттығуы аяқталды!',
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
        const t = translations[currentLang];
        
        // 更新标题
        document.querySelector('h1').textContent = t.title;
        
        // 更新规则按钮
        document.getElementById('rules-btn').textContent = t.rules;
        
        // 更新规则模态框
        document.querySelector('.modal-content h2').textContent = t.rulesTitle;
        const rulesList = document.querySelector('.rules-text');
        rulesList.innerHTML = t.rulesContent.map(rule => `<p>${rule}</p>`).join('');
        
        // 更新玩家标识
        document.querySelector('.player-indicator:not(.ai-indicator)').textContent = t.player;
        document.querySelector('.ai-indicator').textContent = t.ai;
        
        // 更新得分区域
        document.querySelectorAll('.score-container span').forEach(span => {
            if (currentLang === 'kk') {
                // 哈萨克语使用 Қазан
                span.textContent = span.textContent.includes('AI') ? 
                    `${t.ai} ${t.score}:` : 
                    `${t.player} ${t.score}:`;
            } else {
                // 其他语言保持原样
                span.textContent = span.textContent.includes('AI') ? 
                    `${t.ai}${t.score}:` : 
                    `${t.player}${t.score}:`;
            }
        });
        
        // 更新回合指示器
        updateTurnIndicator();
    }

    // 切换语言
    function changeLanguage(lang) {
        currentLang = lang;
        updateTexts();
    }

    // 修改updateTurnIndicator函数
    function updateTurnIndicator() {
        const t = translations[currentLang];
        const turnIndicator = document.querySelector('.white-turn');
        turnIndicator.textContent = isPlayerTurn ? t.playerTurn : t.aiTurn;
    }

    // 在DOMContentLoaded事件中初始化语言选择器
    window.addEventListener('DOMContentLoaded', function() {
        createLanguageSelector();
        loadAIProgress();
    });

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

    renderBoard();
});
