// 在文件最开始添加这些代码
console.log("脚本开始加载...");

// 检查是否为本地环境
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname === '';

console.log("是否为本地环境:", isLocalhost);

// 在文件开头添加设备检测
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 如果是移动设备，重定向到移动版
if (isMobile()) {
    window.location.href = 'mobile.html';
}

// 将这些函数移到全局作用域
function findBestMove(board, score, isFirstAI, moveHistory) {
    let bestScore = -Infinity;
    let bestMoves = [];
    let allMoves = [];  // 记录所有可能移动的评分

    for (let i = 9; i < 18; i++) {
        if (board[i] > 0) {
            let tempBoard = [...board];
            let tempScore = evaluateMove(tempBoard, i, score, moveHistory);
            
            allMoves.push({
                move: i - 9,
                score: tempScore
            });

            if (tempScore > bestScore) {
                bestScore = tempScore;
                bestMoves = [i];
            } else if (tempScore === bestScore) {
                bestMoves.push(i);
            }
        }
    }

    // 输出所有可能移动的评分
    console.log('%c所有可能的移动评分:', 'color: #2E8B57');
    console.table(allMoves.sort((a, b) => b.score - a.score));

    let selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    console.log(`%c最终选择: ${selectedMove - 8} 号坑`, 'color: #FF4500; font-weight: bold');
    
    return selectedMove;
}

// 1. 添加深度学习机制
class AILearner {
    constructor() {
        this.memory = [];
        this.memorySize = 10000;
        this.gamma = 0.95; // 折扣因子
    }

    // 记录每步移动的结果
    recordMove(state, action, reward, nextState, done) {
        this.memory.push({ state, action, reward, nextState, done });
        if (this.memory.length > this.memorySize) {
            this.memory.shift();
        }
    }

    // 经验回放
    replay() {
        // 随机抽取批次
        const batch = Array(this.batchSize).fill(0).map(() => 
            this.memory[Math.floor(Math.random() * this.memory.length)]
        );

        batch.forEach(experience => {
            const { state, action, reward, nextState, done } = experience;
            // 计算目标Q值
            // 更新权重
        });
    }
}

// 2. 改进评估函数，使用学习到的权重
function evaluateMove(tempBoard, lastIndex, score, moveHistory, learner) {
    let evaluation = 0;
    let analysis = {};
    
    // 使用学习到的权重进行评估
    analysis.continuity = calculateContinuityScore(tempBoard) * learner.weights.continuity;
    analysis.local = calculateLocalScore(tempBoard, lastIndex) * learner.weights.local;
    analysis.scoring = calculateScoringPotential(tempBoard, lastIndex) * learner.weights.scoring;
    // ... 其他评估项

    // 记录这步棋的特征
    learner.recordMove(tempBoard, lastIndex, evaluation, 'pending');

    return evaluation;
}

// 3. 添加模式识别
function recognizePatterns(board) {
    const patterns = {
        'trap': checkTrapPattern(board),
        'fork': checkForkPattern(board),
        'blockade': checkBlockadePattern(board)
    };
    
    console.log('%c识别到的棋型:', 'color: #9932CC');
    console.table(patterns);
    
    return patterns;
}

// 4. 添加局势预测
function predictFutureStates(board, depth = 3) {
    let futures = [];
    
    // 模拟未来几步可能的局面
    for (let i = 9; i < 18; i++) {
        if (board[i] > 0) {
            let simulation = simulateMove(board, i, depth);
            futures.push(simulation);
        }
    }
    
    console.log('%c局势预测:', 'color: #008B8B');
    console.table(futures);
}

// AI训练函数
function trainAI() {
    console.log("开始训练...");
    let gamesPlayed = 0;
    let wins1 = 0;
    let wins2 = 0;

    function playOneGame() {
        console.log(`开始第 ${gamesPlayed + 1} 局训练`);
        if (gamesPlayed >= 1000) {
            console.log("训练完成！");
            console.log(`AI-1获胜: ${wins1}次`);
            console.log(`AI-2获胜: ${wins2}次`);
            return;
        }

        // 其他逻辑...
    }

    playOneGame();
}

// 添加训练按钮
if (isLocalhost) {
    window.addEventListener('load', function() {
        console.log("添加训练按钮...");
        const trainButton = document.createElement('div');
        trainButton.id = 'train-btn';
        trainButton.textContent = '训练AI';
        trainButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 100px;
            padding: 15px 25px;
            background: #8B4513;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            z-index: 1001;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;
        
        trainButton.onmouseover = function() {
            this.style.backgroundColor = '#654321';
        };
        trainButton.onmouseout = function() {
            this.style.backgroundColor = '#8B4513';
        };
        
        trainButton.onclick = function() {
            console.log("开始训练...");
            trainAI();
        };

        document.body.appendChild(trainButton);
        console.log("训练按钮已添加");
    });
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
                
                // 检查得分
                if (playerScore >= 81 || aiScore >= 81) {
                    const winModal = document.getElementById('win-modal');
                    const winMessage = document.getElementById('win-message');
                    
                    if (playerScore >= 81) {
                        winMessage.textContent = '恭喜你获胜！';
                    } else if (aiScore >= 81) {
                        winMessage.textContent = 'AI获胜！';
                    }
                    
                    winModal.style.display = 'block';
                    return;
                }
                
                isPlayerTurn = !isPlayerTurn;
                renderBoard();
                
                if (!isPlayerTurn) {
                    setTimeout(aiMove, 1000);
                }
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
        const state = deepAI.stateToInput(board, {
            ai: aiScore,
            player: playerScore
        }, moveHistory);
        
        const move = deepAI.selectMove(board, {
            ai: aiScore,
            player: playerScore
        }, moveHistory);

        // 保存移动前的状态
        const oldPlayerScore = playerScore; // 确保在使用前声明
        distributeStones(move, "ai");

        // 计算奖励
        const reward = aiScore - oldPlayerScore; // 使用旧得分计算奖励
        
        // 学习这步移动
        const nextState = deepAI.stateToInput(board, {
            ai: aiScore,
            player: playerScore
        }, moveHistory);
        
        deepAI.learn(state, move, reward, nextState, false);

        // 定期保存学习结果
        if (Math.random() < 0.1) { // 10%的概率保存
            deepAI.save();
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

    // 添加日志记录功能
    function logAIThinking(board, move, evaluation, score, phase) {
        console.log(`
%cAI 思考分析:
移动: ${move + 1} 号坑
局面评估: ${evaluation.toFixed(2)}
当前得分: ${score}
游戏阶段: ${phase}
局面分析:
AI区域:    ${board.slice(9, 18).join(' | ')}
玩家区域:  ${board.slice(0, 9).join(' | ')}
`, 'color: #8B4513; font-weight: bold;');
    }

    // 在原有的游戏逻辑中添加对局统计
    let gameStats = {
        totalGames: 0,
        aiWins: 0,
        playerWins: 0,
        draws: 0,
        averageScore: {
            ai: 0,
            player: 0
        }
    };

    // 在游戏结束时更新统计
    function updateGameStats(aiScore, playerScore) {
        gameStats.totalGames++;
        if (aiScore > playerScore) {
            gameStats.aiWins++;
        } else if (playerScore > aiScore) {
            gameStats.playerWins++;
        } else {
            gameStats.draws++;
        }
        
        gameStats.averageScore.ai = (gameStats.averageScore.ai * (gameStats.totalGames - 1) + aiScore) / gameStats.totalGames;
        gameStats.averageScore.player = (gameStats.averageScore.player * (gameStats.totalGames - 1) + playerScore) / gameStats.totalGames;

        console.log('%c对局统计:', 'color: #4B0082; font-weight: bold');
        console.table(gameStats);
    }

    let gameHistory = [];

    function logMove(move, score) {
        gameHistory.push({ move, score });
    }

    function displayGameHistory() {
        console.log("对局历史:", gameHistory);
    }

    function updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // 清空当前列表
        gameHistory.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `移动: ${entry.move}, 得分: ${entry.score}`;
            historyList.appendChild(li);
        });
    }

    renderBoard();
});

// 神经网络类
class NeuralNetwork {
    constructor(inputSize, hiddenSizes, outputSize) {
        this.weights = [];
        this.layers = [inputSize, ...hiddenSizes, outputSize];

        for (let i = 0; i < this.layers.length - 1; i++) {
            this.weights[i] = new Array(this.layers[i]).fill(0).map(() => 
                new Array(this.layers[i + 1]).fill(0).map(() => Math.random() - 0.5)
            );
        }
        this.learningRate = 0.01;
    }

    forward(input) {
        this.activations = [input];
        for (let i = 0; i < this.weights.length; i++) {
            const z = this.weights[i].map(row => 
                this.activations[i].reduce((sum, val, j) => sum + val * row[j], 0)
            );
            this.activations.push(z.map(x => 1 / (1 + Math.exp(-x)))); // sigmoid激活函数
        }
        return this.activations[this.activations.length - 1];
    }

    backward(input, target) {
        // 反向传播算法
        const outputError = this.activations[this.activations.length - 1].map((o, i) => o - target[i]);
        // 计算隐藏层误差并更新权重
        for (let i = this.weights.length - 1; i >= 0; i--) {
            const hiddenError = this.weights[i].map((_, j) =>
                outputError.reduce((sum, err, k) => sum + err * this.weights[i][k][j], 0)
            );

            // 更新权重
            this.weights[i] = this.weights[i].map((row, j) =>
                row.map((w, k) => w - this.learningRate * outputError[j] * this.activations[i][k])
            );
            outputError = hiddenError;
        }
    }
}

// 深度学习 AI 类
class DeepLearningAI {
    constructor() {
        this.memory = [];
        this.memorySize = 10000;
        this.batchSize = 32;
        this.gamma = 0.95; // 折扣因子
    }

    // 经验回放
    replay() {
        const batch = Array(this.batchSize).fill(0).map(() => 
            this.memory[Math.floor(Math.random() * this.memory.length)]
        );

        batch.forEach(experience => {
            const { state, action, reward, nextState, done } = experience;
            // 计算目标Q值
            // 更新权重
        });
    }

    load() {
        const data = JSON.parse(localStorage.getItem('aiModel'));
        if (data) {
            this.network.weights1 = data.weights1;
            this.network.weights2 = data.weights2;
            this.memory = data.memory;
        }
    }
}

// 在游戏中使用深度学习AI
const deepAI = new DeepLearningAI();
console.log("加载AI模型...");
deepAI.load(); // 加载之前的学习结果
console.log("AI模型加载完成");
